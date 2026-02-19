import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface CellProps {
  value: number;
  row: number;
  col: number;
  locked: boolean;
  selected: boolean;
  onSelect: (row: number, col: number) => void;
  isValid?: boolean; // For future instant validation UI
}

export const Cell = ({ value, row, col, locked, selected, onSelect, isValid = true }: CellProps) => {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={() => !locked && onSelect(row, col)}
      className={clsx(
        "w-12 h-12 flex items-center justify-center text-xl font-bold border rounded-lg cursor-pointer transition-colors select-none",
        locked ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50",
        selected && !locked && "ring-2 ring-blue-500 bg-blue-100",
        !isValid && "bg-red-100 border-red-300 text-red-600",
        value === 0 && "text-transparent"
      )}
    >
      {value !== 0 ? value : ''}
    </motion.div>
  );
};
