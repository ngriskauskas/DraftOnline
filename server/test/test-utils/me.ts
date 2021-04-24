import { User } from '../../src/entities/User';

const meQuery = `
query{
	me{
		id
		username
		email
	}
}`;

export const me = async (session: any): Promise<User> => {
	const meResponse = await session.post('/graphql').expect(200).send({
		query: meQuery,
	});
	return meResponse.body.data.me as User;
};
