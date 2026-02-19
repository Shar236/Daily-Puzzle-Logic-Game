'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateCell } from '../../store/puzzleSlice';
import { NumberMatrixPuzzle, Puzzle } from '../../lib/puzzle-engine/types';
import { Cell } from './Cell';
import { AnimatePresence, motion } from 'framer-motion';

export const NumberMatrixBoard = () => {
  const dispatch = useDispatch();
  const { currentPuzzle, userGrid } = useSelector((state: RootState) => state.puzzle);
  
  const [selectedCell, setSelectedCell] = useState<{ r: number, c: number } | null>(null);

  if (!currentPuzzle || currentPuzzle.type !== 'number_matrix' || !userGrid) return null;

  const puzzle = currentPuzzle as NumberMatrixPuzzle;
  const gridSize = puzzle.grid.length;

  const handleSelect = (r: number, c: number) => {
    if (!puzzle.initial[r][c]) {
      setSelectedCell({ r, c });
    }
  };

  const handleInput = (num: number) => {
    if (selectedCell) {
      dispatch(updateCell({ 
        row: selectedCell.r, 
        col: selectedCell.c, 
        value: num 
      }));
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        className="grid gap-2 p-4 bg-gray-50 rounded-xl shadow-inner border border-gray-200"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      >
        {userGrid.map((row, r) => (
          row.map((val, c) => (
            <Cell
              key={`${r}-${c}`}
              row={r}
              col={c}
              value={val}
              locked={puzzle.initial[r][c]}
              selected={selectedCell?.r === r && selectedCell?.c === c}
              onSelect={handleSelect}
            />
          ))
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
        {[1, 2, 3, 4].map((num) => (
          <motion.button
            key={num}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleInput(num)}
            className="h-12 bg-white text-gray-800 font-bold border rounded-lg shadow-sm hover:bg-gray-50 active:bg-blue-50 active:border-blue-300 transition-colors"
          >
            {num}
          </motion.button>
        ))}
         <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleInput(0)}
            className="col-span-4 h-10 mt-2 text-sm text-gray-500 font-medium hover:text-red-500 transition-colors"
          >
            Clear Cell
          </motion.button>
      </div>
    </div>
  );
};
