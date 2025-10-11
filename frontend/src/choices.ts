export interface Choice {
  gameId: number;
  choice: number;
  chosenTime: string; // ISO 8601 timestamp
}

export interface AllChoiceCounts {
  [gameId: number]: Record<number, number>;
}

/**
 * Get the total number of choices from a record of choice counts.
 *
 * @param choices - A record mapping choice indices to their counts
 * @returns The total number of choices
 */
export function getTotalChoices(choices: Record<number, number>) {
  if (!choices) {
    return 0;
  }

  return Object.values(choices).reduce((sum, count) => sum + count, 0);
}
