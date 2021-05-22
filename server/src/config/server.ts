import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { Connection } from 'typeorm';
import { createUserLoader } from '../utils/createUserLoader';
import { COOKIE_NAME, __prod__, Resolvers } from './constants';
import { Redis } from 'ioredis';
import { buildSchema } from 'type-graphql';
import {
	createGameUserLoader,
	createManangerLoader,
} from '../utils/createGameUserLoader';

export const createApp = async (conn: Connection, redis: Redis) => {
	await conn.runMigrations();
	const app = express();

	const RedisStore = connectRedis(session);

	app.use(
		cors({
			origin: 'http://localhost:3000',
			credentials: true,
		})
	);

	app.use(
		session({
			name: COOKIE_NAME,
			store: new RedisStore({ client: redis }),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
				httpOnly: true,
				secure: __prod__,
				sameSite: 'lax',
			},
			saveUninitialized: false,
			secret: 'temp',
			resave: false,
		})
	);

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: Resolvers,
		}),
		context: ({ req, res }) => ({
			req,
			res,
			redis,
			userLoader: createUserLoader(),
			gameUserLoader: createGameUserLoader(),
			managerLoader: createManangerLoader(),
		}),
	});

	apolloServer.applyMiddleware({ app, cors: false });
	return app;
};
