import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';

const SECRET_KEY = 'LOGIC_LOOPER_SECRET_KEY'; // In a real app, this would be an env var

export const generateDailySeed = (date: string): string => {
  // Format consistent date string YYYY-MM-DD
  const dateString = dayjs(date).format('YYYY-MM-DD');
  return CryptoJS.SHA256(dateString + SECRET_KEY).toString();
};

export const pseudoRandom = (seed: string) => {
  let value = parseInt(seed.substring(0, 8), 16);
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};
