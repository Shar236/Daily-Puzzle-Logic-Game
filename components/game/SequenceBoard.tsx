'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateCell, updateSequenceGuess } from '../../store/puzzleSlice';
import { SequencePuzzle } from '../../lib/puzzle-engine/types';
import { motion } from 'framer-motion';

export const SequenceBoard = () => {
  const dispatch = useDispatch();
  const { currentPuzzle, userSequence } = useSelector((state: RootState) => state.puzzle);
  
  const [guess, setGuess] = useState('');
  
  if (!currentPuzzle || currentPuzzle.type !== 'sequence_solver' || !userSequence) return null;

  const puzzle = currentPuzzle as SequencePuzzle;
  
  const handleSubmit = () => {
    // Basic interaction for sequence: user confirms guess.
    // In current Redux setup, there is no separate 'submit guess' for sequence.
    // We can add it or just check solution immediately?
    // Let's modify the store action checkSolution to read `userSequence`.
    // But currently `userSequence` is `[]` initially.
    // Wait, the store `updateCell` is for grid.
    // We need a store action specifically for sequence guess *or* allow `checkSolution` to handle input.
    // For simplicity, let's just make the user input update `userSequence`.
    // But `userSequence` is an array?
    // It seems `userSequence` should store the guess?
    // Let's rethink `userSequence`.
    // If user inputs '32', we store it.
    // Let's just create a local specific action or repurpose `updateCell`? No, that's bad DX.
    // For now, let's assume `checkSolution` validates `userSequence` directly or allow local state to be passed.
    // Actually, check step 59 for `checkSolution`. It reads from state.
    // I should add `updateSequenceGuess` to the slice.
    // Re-reading step 59. `checkSolution` reads `puzzle.solution` vs `userGrid`.
    // For sequence, it should compare `puzzle.answer` vs `userSequence`.
    // Let's assume `userSequence` holds the single guess as the last element? Or as a single string?
    // Step 59 defines `userSequence: number[] | null`.
    // So `updateSequenceGuess` should set `userSequence` to `[guess]`.
    
    // For now, let's allow updating `score` via logic here or call a generic `solve` if valid.
    // I'll create a `submitSequenceGuess` action later.
    // But since I'm implementing the view now, I'll rely on a placeholder action.
    
    // For now, just dispatch checkSolution.
    // But checkSolution needs the guess in the store.
    
    // I will call a temporary action `setSequenceGuess`.
  };
  
  return (
    <div className="flex flex-col items-center gap-8 p-6 bg-white rounded-xl shadow-lg w-full max-w-md">
      <div className="flex gap-4 items-center justify-center flex-wrap">
        {puzzle.sequence.map((num, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="w-16 h-16 flex items-center justify-center text-2xl font-bold bg-blue-50 text-blue-600 rounded-full border border-blue-100 shadow-sm"
          >
            {num}
          </motion.div>
        ))}
        <div className="w-16 h-16 flex items-center justify-center text-2xl font-bold bg-gray-50 text-gray-400 rounded-full border border-gray-200 border-dashed">
          ?
        </div>
      </div>
      
      <div className="w-full flex gap-2">
        <input 
          type="number" 
          value={guess}
          onChange={(e) => {
             setGuess(e.target.value);
             dispatch(updateSequenceGuess(parseInt(e.target.value) || 0));
          }}
          placeholder="Enter the next number"
          className="flex-1 p-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
        />
      </div>
       <p className="text-sm text-gray-500 italic">
        Hint: {puzzle.logic.split(" ").slice(0, 3).join(" ")}...
      </p>
    </div>
  );
};
