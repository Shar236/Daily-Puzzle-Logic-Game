import { generateDailySeed } from './seed';
import { generateNumberMatrix } from './puzzles/numberMatrix';
import { generateSequence } from './puzzles/sequenceSolver';
import { Puzzle } from './types';

export const getDailyPuzzle = (date: string): Puzzle => {
    const seed = generateDailySeed(date);

    // Decide which puzzle type based on the seed (first char hex)
    const typeByte = parseInt(seed.substring(0, 2), 16);

    // 50/50 split for now
    if (typeByte % 2 === 0) {
        return generateNumberMatrix(seed);
    } else {
        return generateSequence(seed);
    }
};
