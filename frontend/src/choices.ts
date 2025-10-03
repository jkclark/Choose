export interface Choice {
  gameId: number;
  choice: number;
}

export interface AllChoiceCounts {
  [gameId: number]: Record<number, number>;
}
