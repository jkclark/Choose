export interface Choice {
  gameId: number;
  choice: number;
}

export interface AllChoiceCounts {
  [gameId: number]: Record<number, number>;
}

const API_BASE_URL = "https://4w1im8e5i2.execute-api.us-east-1.amazonaws.com";
const AGGREGATE_FILE_URL =
  "https://choose-choices.s3.us-east-1.amazonaws.com/aggregated_choices.json";

export async function submitChoices(choices: Choice[]) {
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

export function getPercentagesOfChoices(choices: Record<number, number>) {
  const total = Object.values(choices).reduce((sum, count) => sum + count, 0);
  const percentages: Record<number, number> = {};
  for (const [choice, count] of Object.entries(choices)) {
    percentages[Number(choice)] = (count / total) * 100;
  }

  return percentages;
}
