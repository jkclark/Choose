export const Orientation = {
  DEFAULT: "default",
  SIDEWAYS: "sideways",
} as const;

export type Orientation = (typeof Orientation)[keyof typeof Orientation];

interface Game {
  id: number;
  rows: number;
  cols: number;
  orientation: Orientation;
}

export const games: Game[] = [
  // Left-right
  {
    id: 0,
    rows: 1,
    cols: 2,
    orientation: Orientation.DEFAULT,
  },
  // Up-down
  {
    id: 1,
    rows: 2,
    cols: 1,
    orientation: Orientation.SIDEWAYS,
  },
  // Four in a line
  {
    id: 2,
    rows: 1,
    cols: 4,
    orientation: Orientation.DEFAULT,
  },
  // 2x2
  {
    id: 3,
    rows: 2,
    cols: 2,
    orientation: Orientation.DEFAULT,
  },
  // 3x3
  {
    id: 4,
    rows: 3,
    cols: 3,
    orientation: Orientation.DEFAULT,
  },
];
