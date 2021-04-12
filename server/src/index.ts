import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { PostResolver } from './resolvers/post';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { COOKIE_NAME, __prod__, __session__ } from './constants';
import { createConnection } from 'typeorm';
import config from './ormconfig';
import cors from 'cors';

const main = async () => {
	const conn = await createConnection(config);
	await conn.runMigrations();
	const app = express();

	const RedisStore = connectRedis(session);
	const redis = new Redis();

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
			resolvers: [PostResolver, UserResolver],
		}),
		context: ({ req, res }) => ({ req, res, redis }),
		debug: false,
	});

	apolloServer.applyMiddleware({ app, cors: false });
	app.listen(4000, () => {
		console.log('server listening on http://localhost:4000');
	});
};
main().catch((err) => {
	console.error(err);
});
