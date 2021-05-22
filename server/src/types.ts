import { Request, Response } from 'express';
import session from 'express-session';
import { Redis } from 'ioredis';
import {
	createGameUserLoader,
	createManangerLoader,
} from './utils/createGameUserLoader';
import { createUserLoader } from './utils/createUserLoader';

declare module 'express-session' {
	export interface SessionData {
		userId: number;
	}
}

export type Context = {
	req: Request & { session: session.Session };
	res: Response;
	redis: Redis;
	userLoader: ReturnType<typeof createUserLoader>;
	gameUserLoader: ReturnType<typeof createGameUserLoader>;
	managerLoader: ReturnType<typeof createManangerLoader>;
};
