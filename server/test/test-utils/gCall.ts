import { graphql, GraphQLSchema } from 'graphql';
import { buildSchema, Maybe } from 'type-graphql';
import { PostResolver } from '../../src/resolvers/post';
import { UserResolver } from '../../src/resolvers/user';

interface Options {
	source: string;
	variableValues?: Maybe<{
		[key: string]: any;
	}>;
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues }: Options) => {
	if (!schema) {
		schema = await buildSchema({
			resolvers: [PostResolver, UserResolver],
		});
	}
	return graphql({
		schema,
		source,
		variableValues,
	});
};
