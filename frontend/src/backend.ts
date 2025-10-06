/**
 * This module handles communication with AWS (Lambda and S3) for storing and
 * retrieving choices.
 */
import type { Choice } from "./choices";

const API_BASE_URL = "https://4w1im8e5i2.execute-api.us-east-1.amazonaws.com";
const AGGREGATE_FILE_URL =
  "https://choose-choices.s3.us-east-1.amazonaws.com/aggregated_choices.json";

export async function submitChoice(choice: Choice) {
  await submitChoices([choice]);
}

async function submitChoices(choices: Choice[]) {
  // Rename gameId to game_id to comply with what the backend expects
  const transformedChoices = choices.map((choice) => ({
    game_id: choice.gameId,
    choice: choice.choice,
  }));

  await fetch(`${API_BASE_URL}/choose`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ choices: transformedChoices }),
  });
}

export async function getAllChoices() {
  const response = await fetch(AGGREGATE_FILE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch choices");
  }
  return response.json();
}
