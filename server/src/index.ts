import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import microConfig from './mikro-orm.config';
import { buildSchema } from 'type-graphql';

const main = async () => {
	const orm = await MikroORM.init(microConfig);
	await orm.getMigrator().up();

	const app = express();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver],
			validate: false,
		}),
		context: () => ({ em: orm.em }),
	});

	apolloServer.applyMiddleware({ app });
	app.listen(4000, () => {
		console.log('server listening on localhost:4000');
	});
};
main().catch((err) => {
	console.error(err);
});
