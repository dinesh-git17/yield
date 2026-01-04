import type { MazeContext, MazeStep } from "./types";
import { toKey } from "./types";

/**
 * Wall probability for random noise generation.
 * 0.3 = 30% chance each cell becomes a wall.
 */
const WALL_PROBABILITY = 0.3;

/**
 * Random Noise Maze Generator (The "Rubble" Maze)
 *
 * Simple random probability for stress testing.
 * Great for testing how pathfinding handles "Unsolvable" scenarios
 * with disconnected islands.
 *
 * @param context - Grid dimensions and start/end positions
 * @yields Wall placement steps for visualization
 */
export function* randomNoise(context: MazeContext): Generator<MazeStep, void, unknown> {
  const { rows, cols, start, end } = context;
  const startKey = toKey(start);
  const endKey = toKey(end);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = toKey([r, c]);

      // Never place walls on start or end
      if (key === startKey || key === endKey) {
        continue;
      }

      // Random chance to place a wall
      if (Math.random() < WALL_PROBABILITY) {
        yield { type: "wall", coord: [r, c] };
      }
    }
  }

  yield { type: "complete" };
}
