'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { tickTimer } from '../../store/puzzleSlice';
import { clsx } from 'clsx';
import { Timer as TimerIcon } from 'lucide-react';

export const Timer = () => {
  const dispatch = useDispatch();
  const { timer, status } = useSelector((state: RootState) => state.puzzle);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'playing') {
      interval = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, dispatch]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={clsx(
      "flex items-center gap-2 px-4 py-2 rounded-full font-mono text-lg transition-colors border",
      status === 'playing' ? "bg-white text-gray-800 border-gray-200" : 
      status === 'completed' ? "bg-green-100 text-green-700 border-green-200" :
      "bg-gray-100 text-gray-500 border-gray-200"
    )}>
      <TimerIcon size={20} />
      <span>{formatTime(timer)}</span>
    </div>
  );
};
