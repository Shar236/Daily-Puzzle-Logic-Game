'use client';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export const ResultOverlay = () => {
  const { status, score, timer } = useSelector((state: RootState) => state.puzzle);
  
  if (status !== 'completed') return null;
  
  const formattedTime = `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600"
          >
            <CheckCircle size={48} strokeWidth={3} />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Puzzle Solved!</h2>
          <p className="text-gray-500 mb-8">Great job keeping your streak alive.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-sm text-gray-500 mb-1">Score</p>
              <p className="text-2xl font-bold text-blue-600">{score}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-sm text-gray-500 mb-1">Time</p>
              <p className="text-2xl font-bold text-gray-800">{formattedTime}</p>
            </div>
          </div>
          
          <button 
             onClick={() => window.location.reload()} // Placeholder for "Next" or "Close"
             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-transform active:scale-95"
          >
            Continue
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
