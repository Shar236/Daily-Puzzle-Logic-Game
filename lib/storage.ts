import { openDB, DBSchema } from 'idb';
import { GameState } from './puzzle-engine/types';
import dayjs from 'dayjs';

interface LogicLooperDB extends DBSchema {
    daily_progress: {
        key: string; // date YYYY-MM-DD
        value: any; // Serialized PuzzleState
    };
    user_stats: {
        key: string;
        value: any;
    };
}

const DB_NAME = 'logic-looper-db';
const DB_VERSION = 1;

export const initDB = async () => {
    return openDB<LogicLooperDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('daily_progress')) {
                db.createObjectStore('daily_progress');
            }
            if (!db.objectStoreNames.contains('user_stats')) {
                db.createObjectStore('user_stats');
            }
        },
    });
};

export const saveDailyProgress = async (date: string, state: any) => {
    const db = await initDB();
    await db.put('daily_progress', state, date);
};

export const loadDailyProgress = async (date: string) => {
    const db = await initDB();
    return db.get('daily_progress', date);
};

export const saveUserStats = async (stats: any) => {
    const db = await initDB();
    await db.put('user_stats', stats, 'main');
};

export const loadUserStats = async () => {
    const db = await initDB();
    return db.get('user_stats', 'main');
};
