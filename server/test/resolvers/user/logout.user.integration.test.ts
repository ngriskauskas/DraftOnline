import { hash } from 'argon2';
import { User } from '../../../src/entities/User';
import { closeTestServer, initTestServer } from '../../test-utils/testServer';
import { Express } from 'express';
import supertest from 'supertest';
import session from 'supertest-session';

let testSession: any;
let app: Express;
beforeAll(async () => {
	app = await initTestServer();
	testSession = session(app);
	await User.insert({
		username: 'username',
		email: 'email@test.com',
		password: await hash('1234'),
	});
});
afterAll(async () => {
	await closeTestServer();
});
const logoutMutation = `
	mutation Logout{
		logout
}`;
//TODO finish this after confirm user is logged out after, with me query?
describe('logout', () => {
	describe('when no user logged in', () => {
		it('returns false', async () => {
			const logoutResponse = await supertest(app)
				.post('/graphql')
				.send({ query: logoutMutation })
				.expect(200);

			expect(logoutResponse.body).toEqual({
				data: { logout: true },
			});
		});
	});
	describe('when user is logged in', () => {
		it('returns false', async () => {
			const logoutResponse = await supertest(app)
				.post('/graphql')
				.send({ query: logoutMutation })
				.expect(200);

			expect(logoutResponse.body).toEqual({
				data: { logout: true },
			});
		});
	});
});
