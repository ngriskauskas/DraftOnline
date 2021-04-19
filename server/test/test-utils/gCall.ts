import { graphql, GraphQLSchema } from 'graphql';
import { buildSchema, Maybe } from 'type-graphql';
import { Resolvers } from '../../src/config/constants';
interface Options {
	source: string;
	variableValues?: Maybe<{
		[key: string]: any;
	}>;
	userId?: number;
}

let schema: GraphQLSchema;

//Maybe use for unit tests?
export const gCall = async ({ source, variableValues, userId }: Options) => {
	if (!schema) {
		schema = await buildSchema({
			resolvers: Resolvers,
		});
	}
	return graphql({
		schema,
		source,
		variableValues,
		contextValue: {
			req: {
				session: {
					userId,
				},
			},
			res: {},
		},
	});
};
