import { NumberMatrixPuzzle } from '../types';
import { pseudoRandom } from '../seed';

const SIZE = 4; // 4x4 mini Sudoku

// Helper to shuffle array with seeded RNG
const shuffle = (array: number[], rng: () => number) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Check if number is valid in cell
const isValid = (grid: number[][], row: number, col: number, num: number) => {
    // Check row and column
    for (let x = 0; x < SIZE; x++) {
        if (grid[row][x] === num || grid[x][col] === num) return false;
    }

    // Check 2x2 box for Sudoku variant (if implementing 4x4 Sudoku)
    const startRow = row - (row % 2);
    const startCol = col - (col % 2);
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            if (grid[i + startRow][j + startCol] === num) return false;
        }
    }

    return true;
};

// Generate full solution
const solveGrid = (grid: number[][], rng: () => number): boolean => {
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            if (grid[row][col] === 0) {
                const numbers = shuffle([1, 2, 3, 4], rng);
                for (const num of numbers) {
                    if (isValid(grid, row, col, num)) {
                        grid[row][col] = num;
                        if (solveGrid(grid, rng)) return true;
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
};

export const generateNumberMatrix = (seed: string): NumberMatrixPuzzle => {
    const rng = pseudoRandom(seed);
    const grid = Array(SIZE).fill(0).map(() => Array(SIZE).fill(0));

    // Fill diagonal to ensure randomization
    for (let i = 0; i < SIZE; i++) {
        // Basic pre-fill strategy or just solve empty grid with shuffled numbers
    }

    solveGrid(grid, rng);

    const solution = grid.map(row => [...row]);
    const initial = grid.map(row => row.map(() => true)); // All visible initially

    // Remove numbers based on difficulty (seeded)
    const emptyCells = Math.floor(rng() * 3) + 6; // remove 6-8 cells
    let removed = 0;

    while (removed < emptyCells) {
        const r = Math.floor(rng() * SIZE);
        const c = Math.floor(rng() * SIZE);
        if (grid[r][c] !== 0) {
            grid[r][c] = 0;
            initial[r][c] = false;
            removed++;
        }
    }

    return {
        type: 'number_matrix',
        difficulty: 'medium',
        score: 100,
        grid,
        solution,
        initial,
        targetSum: 0 // Unused for Sudoku logic
    };
};
