import json

import boto3

S3_BUCKET_NAME = "choose-choices"
S3_CHOICES_FOLDER_PREFIX = "choices/"

def lambda_handler(event, context):
    try:
        parsed_event = json.loads(event["body"])
    except (KeyError, json.JSONDecodeError) as e:
        return {
            "statusCode": 400,
            "body": json.dumps(f"Invalid input: {e}")
        }

    try:
        choices = parsed_event["choices"]
    except KeyError:
        return {
            "statusCode": 400,
            "body": json.dumps("Request does not contain choices")
        }

    if not isinstance(choices, list) or len(choices) == 0:
        return {
            "statusCode": 400,
            "body": json.dumps("Choices must be a non-empty list")
        }

    choices_as_tuples = convert_choices_from_objects_to_string(choices)

    lambda_request_id = context.aws_request_id  # Unique ID for this Lambda invocation

    write_choices_to_s3(S3_BUCKET_NAME, f"{S3_CHOICES_FOLDER_PREFIX}{lambda_request_id}.csv", choices_as_tuples)

    return {
        "statusCode": 200,
        "body": json.dumps("Choices saved successfully!")
    }

def convert_choices_from_objects_to_string(choices):
    """Converts a list of choice objects to a single string.

    Each choice in the list has its own line and is formatted as "game_id,choice".

    We do this in order to reduce the size of the data we write to S3.
    """
    try:
        choices_as_strings = [f"{choice['game_id']},{choice['choice']}" for choice in choices]
    except KeyError as e:
        return {
            "statusCode": 400,
            "body": json.dumps(f"Missing required information in a given choice: {e}")
        }

    return "\n".join(choices_as_strings)

def write_choices_to_s3(bucket, object_name, choices):
    client = boto3.client("s3")
    try:
        client.put_object(
            Bucket=bucket,
            Key=object_name,
            Body=choices,
            ContentType="text/csv",
        )
    except Exception as e:
        print("Error writing to S3:", e)

