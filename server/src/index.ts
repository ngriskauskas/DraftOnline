import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { __prod__, __session__ } from './constants';
import { createConnection } from 'typeorm';
import config from './ormconfig';

const main = async () => {
	await createConnection(config);

	const app = express();

	const RedisStore = connectRedis(session);
	const redisClient = redis.createClient();

	app.use(
		session({
			name: 'qid',
			store: new RedisStore({ client: redisClient }),
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
			resolvers: [HelloResolver, PostResolver, UserResolver],
		}),
		context: ({ req, res }) => ({ req, res }),
	});

	apolloServer.applyMiddleware({ app });
	app.listen(4000, () => {
		console.log('server listening on localhost:4000');
	});
};
main().catch((err) => {
	console.error(err);
});
