'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { loadPuzzle, checkSolution, useHint } from '../../store/puzzleSlice';
import { getDailyPuzzle } from '../../lib/puzzle-engine/generator';
import {
  loadDailyProgress,
  saveDailyProgress,
  loadUserStats,
  saveUserStats,
} from '../../lib/storage';
import { NumberMatrixBoard } from './NumberMatrixBoard';
import { SequenceBoard } from './SequenceBoard';
import { Timer } from './Timer';
import { ResultOverlay } from './ResultOverlay';
import { Heatmap } from '../stats/Heatmap';
import { motion } from 'framer-motion';
import { HelpCircle, Check } from 'lucide-react';
import dayjs from 'dayjs';

export const GameContainer = () => {
  const dispatch = useDispatch();
  const {
    currentPuzzle,
    status,
    userGrid,
    userSequence,
    score,
    timer,
    hintsUsed,
    isSolved,
  } = useSelector((state: RootState) => state.puzzle);

  const [streak, setStreak] = useState(0);

  /* -------------------- INIT GAME -------------------- */
  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');

    const initGame = async () => {
      const stats = await loadUserStats();
      if (stats) setStreak(stats.streak);

      const puzzle = getDailyPuzzle(today);
      dispatch(loadPuzzle(puzzle));
    };

    initGame();
  }, [dispatch]);

  /* -------------------- AUTO SAVE -------------------- */
  useEffect(() => {
    if (currentPuzzle) {
      const today = dayjs().format('YYYY-MM-DD');

      saveDailyProgress(today, {
        currentPuzzle,
        status,
        userGrid,
        userSequence,
        score,
        timer,
        hintsUsed,
        isSolved,
      });
    }
  }, [
    currentPuzzle,
    status,
    userGrid,
    userSequence,
    score,
    timer,
    hintsUsed,
    isSolved,
  ]);

  /* -------------------- STREAK UPDATE -------------------- */
  useEffect(() => {
    if (status === 'completed') {
      const updateStreak = async () => {
        const stats = (await loadUserStats()) || {
          streak: 0,
          lastPlayed: null,
          totalPoints: 0,
        };

        const today = dayjs().format('YYYY-MM-DD');
        const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

        let newStreak = stats.streak;

        if (stats.lastPlayed === yesterday) {
          newStreak += 1;
        } else if (stats.lastPlayed !== today) {
          newStreak = 1;
        }

        await saveUserStats({
          ...stats,
          streak: newStreak,
          lastPlayed: today,
          totalPoints: (stats.totalPoints || 0) + score,
        });

        setStreak(newStreak);
      };

      updateStreak();
    }
  }, [status, score]);

  if (!currentPuzzle) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">

      {/* TOP GRADIENT */}
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-b-[3rem] shadow-lg"></div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-8 py-8 flex flex-col gap-10">

        {/* HEADER */}
        <div className="flex items-center justify-between text-white">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Logic Looper
            </h1>
            <p className="text-blue-100 text-sm font-medium">
              {dayjs().format('MMMM D, YYYY')}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/20 flex items-center gap-2">
            <span>🔥</span>
            <span>{streak}</span>
            <span className="font-normal opacity-80">Streak</span>
          </div>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* GAME SECTION */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="lg:col-span-8 bg-white rounded-3xl shadow-xl p-10 flex flex-col gap-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-500 tracking-wider uppercase bg-blue-50 px-2 py-1 rounded-md">
                  {currentPuzzle.type === 'number_matrix'
                    ? 'Number Matrix'
                    : 'Sequence Solver'}
                </span>

                <h2 className="text-2xl font-bold text-gray-800 mt-2">
                  Daily Challenge
                </h2>
              </div>

              <Timer />
            </div>

            {/* BOARD */}
            <div className="min-h-[420px] flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 p-6">
              {currentPuzzle.type === 'number_matrix' && (
                <NumberMatrixBoard />
              )}
              {currentPuzzle.type === 'sequence_solver' && (
                <SequenceBoard />
              )}
            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-2 gap-6 mt-auto">
              <button
                onClick={() => dispatch(useHint())}
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <HelpCircle size={20} />
                Hint
              </button>

              <button
                onClick={() => dispatch(checkSolution())}
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
              >
                <Check size={20} strokeWidth={3} />
                Submit
              </button>
            </div>
          </motion.div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 flex flex-col gap-8">

            <Heatmap />

            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-gray-800 font-bold text-lg mb-6">
                Today's Stats
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
                    Solved By
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    12,403
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
                    Avg Time
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    4:12
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ResultOverlay />
    </div>
  );
};
