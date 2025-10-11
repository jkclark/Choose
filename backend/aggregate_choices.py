import json

import boto3

S3_BUCKET_NAME = "choose-choices"
S3_CHOICES_FOLDER_PREFIX = "choices/"
S3_AGGREGATED_CHOICES_OBJECT_NAME = "aggregated_choices.json"

def lambda_handler(_, __):
    s3_client = boto3.client("s3")

    # Read existing aggregated choices if they exist
    try:
        previous_aggregated_choices_file = s3_client.get_object(Bucket=S3_BUCKET_NAME, Key=S3_AGGREGATED_CHOICES_OBJECT_NAME)
    except s3_client.exceptions.NoSuchKey as e:
        raise e

    previous_aggregated_choices = json.loads(previous_aggregated_choices_file["Body"].read().decode("utf-8"))

    # Aggregate new choices from all choice files
    new_aggregated_choices = {}
    all_choice_files = list_all_choice_files(s3_client)
    for choice_file in all_choice_files:
        choices = read_choice_file(s3_client, choice_file)
        for game_id, choice in choices.items():
            if game_id not in new_aggregated_choices:
                new_aggregated_choices[game_id] = {}

            new_aggregated_choices[game_id][choice] = new_aggregated_choices[game_id].get(choice, 0) + 1

    # Merge previous aggregated choices with the new ones
    total_aggregated_choices = merge_aggregated_choices(previous_aggregated_choices, new_aggregated_choices)

    # Delete individual choice files after aggregation
    delete_all_choice_files(s3_client, all_choice_files)

    # Write the aggregated choices back to S3
    s3_client.put_object(Bucket=S3_BUCKET_NAME, Key=S3_AGGREGATED_CHOICES_OBJECT_NAME, Body=json.dumps(total_aggregated_choices))

def list_all_choice_files(s3_client):
    paginator = s3_client.get_paginator("list_objects_v2")
    page_iterator = paginator.paginate(Bucket=S3_BUCKET_NAME, Prefix=S3_CHOICES_FOLDER_PREFIX)

    choice_files = []
    for page in page_iterator:
        if "Contents" in page:
            for obj in page["Contents"]:
                choice_files.append(obj["Key"])
    return choice_files

def read_choice_file(s3_client, object_key):
    """Get a dictionary of game ID -> choice."""
    choices_raw = s3_client.get_object(Bucket=S3_BUCKET_NAME, Key=object_key)
    choices = choices_raw["Body"].read().decode("utf-8").splitlines()
    return {line[0]: line[1] for line in (choice.split(",") for choice in choices)}

def merge_aggregated_choices(previous, new):
    merged = previous.copy()
    for game_id, choices in new.items():
        if game_id not in merged:
            merged[game_id] = {}
        for choice, count in choices.items():
            merged[game_id][choice] = merged[game_id].get(choice, 0) + count
    return merged

def delete_all_choice_files(s3_client, choice_files):
    if not choice_files:
        return

    objects_to_delete = [{"Key": key} for key in choice_files]
    s3_client.delete_objects(Bucket=S3_BUCKET_NAME, Delete={"Objects": objects_to_delete})
