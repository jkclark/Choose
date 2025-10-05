interface Game {
  id: number;
  rows: number;
  cols: number;
}

export const games: Game[] = [
  // Left-right
  {
    id: 0,
    rows: 1,
    cols: 2,
  },
  // Up-down
  {
    id: 1,
    rows: 2,
    cols: 1,
  },
  // Four in a line
  {
    id: 2,
    rows: 1,
    cols: 4,
  },
  // 2x2
  {
    id: 3,
    rows: 2,
    cols: 2,
  },
  // 3x3
  {
    id: 4,
    rows: 3,
    cols: 3,
  },
];
