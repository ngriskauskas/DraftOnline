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

describe('User Query: me', () => {
	describe('when user is logged in', () => {
		it('returns user', async () => {
			const { session, user } = await createSession(app, true);
			expect(await me(session)).toEqual({
				id: user!.id,
				username: user!.username,
				email: user!.email,
			});
		});
	});
	describe('when no user session exists', () => {
		it('returns null', async () => {
			const { session } = await createSession(app);
			expect(await me(session)).toEqual(null);
		});
	});
});
