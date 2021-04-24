import { closeTestServer, initTestServer } from '../../test-utils/testServer';
import { Express } from 'express';
import { me } from '../../test-utils/me';
import { createSession } from '../../test-utils/createSession';

let app: Express;

beforeAll(async () => {
	app = await initTestServer();
});

afterAll(async () => {
	await closeTestServer();
});

const registerMutation = `
mutation Register($username: String!, $email: String!, $password: String!) {
  register(input: { username: $username, email: $email, password: $password }) {
    id
    username
    email
  }
}`;

describe('User Mutation: Register', () => {
	describe('when register info is valid', () => {
		it('creates the user and logins in', async () => {
			const { session } = await createSession(app);
			const user = {
				email: '123@test.com',
				username: 'test',
			};
			const registerResponse = await session
				.post('/graphql')
				.expect(200)
				.send({
					query: registerMutation,
					variables: {
						...user,
						password: '1234',
					},
				});
			expect(registerResponse.body.data.register).toEqual({
				...user,
				id: 1,
			});
			expect(await me(session)).toEqual({
				...user,
				id: 1,
			});
		});
	});
	describe('when email is already taken', () => {
		it('returns error: User Already Exists', async () => {
			const { session, user } = await createSession(app, true);
			const registerResponse = await session
				.post('/graphql')
				.expect(200)
				.send({
					query: registerMutation,
					variables: {
						username: user!.username,
						email: user!.email,
						password: '1234',
					},
				});
			expect(registerResponse.body.errors[0].message).toEqual(
				'User Already Exists'
			);
		});
	});
	describe('when register info is invalid', () => {
		it('returns error: argument validation error', async () => {
			const { session } = await createSession(app);
			const registerResponse = await session
				.post('/graphql')
				.expect(200)
				.send({
					query: registerMutation,
					variables: {
						email: 'abc',
						username: 'xyz',
						password: '12',
					},
				});
			expect(registerResponse.body.errors[0].message).toEqual(
				'Argument Validation Error'
			);
			expect(await me(session)).toEqual(null);
		});
	});
});
