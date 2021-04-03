import dotenv from 'dotenv';
dotenv.config();

export const __prod__ = process.env.NODE_ENV === 'production';
export const __session__ = process.env.SESSION_SECRET;
