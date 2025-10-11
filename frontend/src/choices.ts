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

/**
 * Get the most recent 3am Eastern time when the backend tally occurred.
 * The backend runs at 3am Eastern (UTC-4, or UTC-5 during standard time) daily.
 *
 * @returns ISO 8601 timestamp of the most recent 3am Eastern tally
 */
export function getMostRecentTallyTime(): string {
  const now = new Date();

  // Eastern Time offset (UTC-4 during EDT, UTC-5 during EST)
  // For simplicity, use UTC-4 (Eastern Daylight Time)
  const easternOffset = -4; // hours from UTC

  // Get current time in Eastern
  const nowEastern = new Date(now.getTime() + easternOffset * 60 * 60 * 1000);

  // Get today's 3am Eastern in UTC
  const todayTallyEastern = new Date(
    nowEastern.getFullYear(),
    nowEastern.getMonth(),
    nowEastern.getDate(),
    3,
    0,
    0,
    0,
  );
  const todayTallyUTC = new Date(
    todayTallyEastern.getTime() - easternOffset * 60 * 60 * 1000,
  );

  // If it's before 3am Eastern today, use yesterday's 3am
  if (nowEastern.getHours() < 3) {
    const yesterdayTallyUTC = new Date(
      todayTallyUTC.getTime() - 24 * 60 * 60 * 1000,
    );
    return yesterdayTallyUTC.toISOString();
  }

  return todayTallyUTC.toISOString();
}
