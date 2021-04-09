import { Request, Response } from 'express';
import session from 'express-session';
import { Redis } from 'ioredis';

declare module 'express-session' {
	export interface SessionData {
		userId: number;
	}
}

export type MyContext = {
	req: Request & { session: session.Session };
	res: Response;
	redis: Redis;
};
