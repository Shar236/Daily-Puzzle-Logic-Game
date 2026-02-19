export type PuzzleType = 'number_matrix' | 'sequence_solver';

export interface BasePuzzle {
    type: PuzzleType;
    difficulty: 'easy' | 'medium' | 'hard';
    score: number;
}

export interface NumberMatrixPuzzle extends BasePuzzle {
    type: 'number_matrix';
    grid: number[][]; // 5x5 grid or similar
    targetSum: number; // For Sudoku variants or sum-based puzzles
    solution: number[][];
    initial: boolean[][]; // Which cells are locked
}

export interface SequencePuzzle extends BasePuzzle {
    type: 'sequence_solver';
    sequence: number[]; // e.g. [2, 4, 8, 16]
    answer: number; // 32
    logic: string; // Explanation: "Each number is multiplied by 2"
}

export type Puzzle = NumberMatrixPuzzle | SequencePuzzle;

// Game State Interface
export interface GameState {
    currentPuzzle: Puzzle | null;
    userProgress: any; // Flexible structure depending on puzzle type
    isSolved: boolean;
    score: number;
    timer: number;
    hintsUsed: number;
    lastPlayedDate: string | null;
    streak: number;
}
