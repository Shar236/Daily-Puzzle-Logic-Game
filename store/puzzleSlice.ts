import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Puzzle, NumberMatrixPuzzle, SequencePuzzle } from '../lib/puzzle-engine/types';

interface PuzzleState {
    currentPuzzle: Puzzle | null;
    userGrid: number[][] | null; // For matrix puzzles
    userSequence: number[] | null; // For sequence puzzles
    isSolved: boolean;
    score: number;
    timer: number;
    hintsUsed: number;
    startTime: number | null;
    endTime: number | null;
    status: 'idle' | 'playing' | 'completed' | 'failed';
}

const initialState: PuzzleState = {
    currentPuzzle: null,
    userGrid: null,
    userSequence: null,
    isSolved: false,
    score: 0,
    timer: 0,
    hintsUsed: 0,
    startTime: null,
    endTime: null,
    status: 'idle',
};

const puzzleSlice = createSlice({
    name: 'puzzle',
    initialState,
    reducers: {
        loadPuzzle: (state, action: PayloadAction<Puzzle>) => {
            state.currentPuzzle = action.payload;
            state.userGrid = action.payload.type === 'number_matrix'
                ? (action.payload as NumberMatrixPuzzle).grid.map(row => row.map(cell => cell === 0 ? 0 : cell))
                : null;

            state.userSequence = action.payload.type === 'sequence_solver' ? [] : null;
            state.isSolved = false;
            state.score = 0;
            state.timer = 0;
            state.hintsUsed = 0;
            state.startTime = Date.now();
            state.status = 'playing';
        },
        updateCell: (state, action: PayloadAction<{ row: number; col: number; value: number }>) => {
            if (state.currentPuzzle?.type === 'number_matrix' && state.userGrid) {
                const { row, col, value } = action.payload;
                const puzzle = state.currentPuzzle as NumberMatrixPuzzle;
                if (!puzzle.initial[row][col]) {
                    state.userGrid[row][col] = value;
                }
            }
        },
        updateSequenceGuess: (state, action: PayloadAction<number>) => {
            if (state.currentPuzzle?.type === 'sequence_solver') {
                state.userSequence = [action.payload];
            }
        },
        checkSolution: (state) => {
            if (!state.currentPuzzle) return;

            let isCorrect = false;

            if (state.currentPuzzle.type === 'number_matrix') {
                const puzzle = state.currentPuzzle as NumberMatrixPuzzle;
                isCorrect = state.userGrid?.every((row, r) =>
                    row.every((cell, c) => cell === puzzle.solution[r][c])
                ) ?? false;
            } else if (state.currentPuzzle.type === 'sequence_solver') {
                const puzzle = state.currentPuzzle as SequencePuzzle;
                if (state.userSequence && state.userSequence.length > 0) {
                    isCorrect = state.userSequence[0] === puzzle.answer;
                }
            }

            if (isCorrect) {
                state.isSolved = true;
                state.status = 'completed';
                state.endTime = Date.now();
                const timeTaken = (state.endTime - (state.startTime || 0)) / 1000;
                state.score = Math.max(10, 1000 - Math.floor(timeTaken * 2) - (state.hintsUsed * 50));
            }
        },
        useHint: (state) => {
            if (state.hintsUsed < 3) {
                state.hintsUsed += 1;
            }
        },
        tickTimer: (state) => {
            if (state.status === 'playing') {
                state.timer += 1;
            }
        }
    },
});

export const { loadPuzzle, updateCell, updateSequenceGuess, checkSolution, useHint, tickTimer } = puzzleSlice.actions;
export default puzzleSlice.reducer;
