'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { loadUserStats } from '../../lib/storage';

interface DayData {
  date: string;
  intensity: 0 | 1 | 2 | 3 | 4; // 0: none, 1: played, 2: good, 3: great, 4: perfect
  score?: number;
}

export const Heatmap = () => {
  const [data, setData] = useState<DayData[]>([]);
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  useEffect(() => {
    const generateData = async () => {
      // In a real app, we would load historical data from IndexedDB or Server
      // For now, we'll generate a static 365-day grid with some dummy data + actual data for today
      
      const stats = await loadUserStats(); // We might store history here later
      const today = dayjs().format('YYYY-MM-DD');
      
      const days: DayData[] = [];
      const endDate = dayjs();
      // Generate last 365 days
      const startDate = endDate.subtract(364, 'day');
      
      for (let i = 0; i < 365; i++) {
        const date = startDate.add(i, 'day');
        const dateStr = date.format('YYYY-MM-DD');
        
        // Mock random data for visual demo (except today)
        let intensity: DayData['intensity'] = 0;
        
        // Logic to simulate "activity" for demo purposes
        if (Math.random() > 0.7) {
            intensity = Math.floor(Math.random() * 4) + 1 as DayData['intensity'];
        }

        // If it's today and we have a score, update intensity
        // (This part would need real data integration)
        if (dateStr === today && stats?.lastPlayed === today) {
           intensity = 4; // Assume played today means active
        }
        
        days.push({
          date: dateStr,
          intensity,
        });
      };
      setData(days);
    };

    generateData();
  }, []);

  const getIntensityColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-100';
      case 1: return 'bg-blue-200';
      case 2: return 'bg-blue-400';
      case 3: return 'bg-blue-600';
      case 4: return 'bg-blue-800';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-4">
      <h3 className="text-gray-800 font-bold text-lg">Activity</h3>
      
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex gap-1 min-w-max">
            {/* We need to arrange in columns of 7 days (weeks) */}
             {Array.from({ length: 53 }).map((_, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, rowIndex) => {
                        const dayIndex = colIndex * 7 + rowIndex;
                        const day = data[dayIndex];
                        if (!day) return null;
                        
                        return (
                            <motion.div
                                key={day.date}
                                whileHover={{ scale: 1.2, zIndex: 10 }}
                                onMouseEnter={() => setHoveredDay(day)}
                                onMouseLeave={() => setHoveredDay(null)}
                                className={clsx(
                                    "w-3 h-3 rounded-sm cursor-pointer transition-colors",
                                    getIntensityColor(day.intensity)
                                )}
                            />
                        );
                    })}
                </div>
             ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-400">
         <span>Less</span>
         <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100" />
            <div className="w-3 h-3 rounded-sm bg-blue-200" />
            <div className="w-3 h-3 rounded-sm bg-blue-400" />
            <div className="w-3 h-3 rounded-sm bg-blue-600" />
            <div className="w-3 h-3 rounded-sm bg-blue-800" />
         </div>
         <span>More</span>
      </div>

      {hoveredDay ? (
         <div className="text-sm text-gray-600 font-medium text-center h-5">
            {dayjs(hoveredDay.date).format('MMM D, YYYY')}: {hoveredDay.intensity > 0 ? 'Puzzle solved' : 'No activity'}
         </div>
      ) : (
         <div className="h-5"></div>
      )}
    </div>
  );
};
