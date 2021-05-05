import { closeTestServer, initTestServer } from '../../test-utils/testServer';
import { Express } from 'express';
import { createSession } from '../../test-utils/createSession';
import { me } from '../../test-utils/me';

let app: Express;

beforeAll(async () => {
	app = await initTestServer();
});
afterAll(async () => {
	await closeTestServer();
});

const logoutMutation = `
	mutation Logout{
		logout
}`;

describe('User Mutation: Logout', () => {
	describe('when no user logged in', () => {
		it('returns true', async () => {
			const { session } = await createSession(app);
			const logoutResponse = await session
				.post('/graphql')
				.send({ query: logoutMutation })
				.expect(200);

			expect(logoutResponse.body).toEqual({
				data: { logout: true },
			});
			expect(await me(session)).toEqual(null);
		});
	});

	describe('when user is logged in', () => {
		it('returns true and logs out the user', async () => {
			const { session } = await createSession(app, true);
			const logoutResponse = await session
				.post('/graphql')
				.send({ query: logoutMutation })
				.expect(200);

			expect(logoutResponse.body).toEqual({
				data: { logout: true },
			});
			expect(await me(session)).toEqual(null);
		});
	});
});
