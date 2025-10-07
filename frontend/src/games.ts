interface Game {
  id: number;
  rows: number;
  cols: number;
  sideways: boolean;
}

export const games: Game[] = [
  // Left-right
  {
    id: 0,
    rows: 1,
    cols: 2,
    sideways: false,
  },
  // Up-down
  {
    id: 1,
    rows: 2,
    cols: 1,
    sideways: true,
  },
  // Four in a line
  {
    id: 2,
    rows: 1,
    cols: 4,
    sideways: false,
  },
  // 2x2
  {
    id: 3,
    rows: 2,
    cols: 2,
    sideways: false,
  },
  // 3x3
  {
    id: 4,
    rows: 3,
    cols: 3,
    sideways: false,
  },
];
