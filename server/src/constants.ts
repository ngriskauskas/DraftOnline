import dotenv from 'dotenv';
dotenv.config();

export const __prod__ = process.env.NODE_ENV === 'production';
export const __session__ = process.env.SESSION_SECRET;
export const __dbPassword__ = process.env.DB_PASSWORD;
export const COOKIE_NAME = 'qid';
export const FORGET_PASSWORD_PREFIX = 'forgot-password:';
