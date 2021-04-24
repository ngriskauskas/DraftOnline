import supertestSession from 'supertest-session';
import { hash } from 'argon2';
import { Express } from 'express';
import { User } from '../../src/entities/User';

const loginMutation = `
mutation Login($email: String!, $password: String!){
	login(input: {email: $email, password: $password}) {
    id
    username
    email
  }
}`;

export const createSession = async (app: Express, isAuth = false) => {
	const session = supertestSession(app) as any;
	if (!isAuth) {
		return { session, user: undefined };
	}
	const user = await User.create({
		username: 'username',
		email: 'email@test.com',
		password: await hash('1234'),
	}).save();
	await session
		.post('/graphql')
		.expect(200)
		.send({
			query: loginMutation,
			variables: {
				email: 'email@test.com',
				password: '1234',
			},
		});
	return { session, user };
};
