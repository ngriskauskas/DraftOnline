import { Express } from 'express';
import { closeTestServer, initTestServer } from '../../test-utils/testServer';
import { createSession } from '../../test-utils/createSession';
import { me } from '../../test-utils/me';

let app: Express;
beforeAll(async () => {
	app = await initTestServer();
});

afterAll(async () => {
	await closeTestServer();
});

const loginMutation = `
mutation Login($email: String!, $password: String!){
	login(input: {email: $email, password: $password}) {
    id
    username
    email
  }
}`;

describe('User Mutation: Login', () => {
	describe('when login info is valid', () => {
		it('returns user', async () => {
			const { session, user } = await createSession(app, true);
			const { id, email, username } = user!;
			expect(await me(session)).toEqual({ id, email, username });
		});
	});

	describe('when email does not exist', () => {
		it('returns error: incorrect email or password', async () => {
			const { session } = await createSession(app);
			const loginResponse = await session
				.post('/graphql')
				.send({
					query: loginMutation,
					variables: {
						email: 'email@missing.com',
						password: '1234',
					},
				})
				.expect(200);
			expect(loginResponse.body.errors!.length).toBe(1);
			expect(loginResponse.body.errors![0].message).toEqual(
				'Incorrect Email or Password'
			);
			expect(await me(session)).toEqual(null);
		});
	});

	describe('when password is wrong', () => {
		it('returns error: incorrect email or password', async () => {
			const { session } = await createSession(app);
			const loginResponse = await session
				.post('/graphql')
				.send({
					query: loginMutation,
					variables: {
						email: 'email@test.com',
						password: 'abcd',
					},
				})
				.expect(200);
			expect(loginResponse.body.errors!.length).toBe(1);
			expect(loginResponse.body.errors![0].message).toEqual(
				'Incorrect Email or Password'
			);
			expect(await me(session)).toEqual(null);
		});
	});
});
