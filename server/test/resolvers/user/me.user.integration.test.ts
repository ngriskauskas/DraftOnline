import { hash } from 'argon2';
import { User } from '../../../src/entities/User';
import { closeTestServer, initTestServer } from '../../test-utils/testServer';
import session from 'supertest-session';
import { Express } from 'express';
import supertest from 'supertest';

let app: Express;
let testSession: any;
let user: User;
beforeAll(async () => {
	app = await initTestServer();
	testSession = session(app);
	user = await User.create({
		username: 'username',
		email: 'email@test.com',
		password: await hash('1234'),
	}).save();
});
afterAll(async () => {
	await closeTestServer();
});

const meQuery = `
query{
	me{
		id
		username
		email
	}
}`;

const loginMutation = `
mutation Login($email: String!, $password: String!){
	login(input: {email: $email, password: $password}) {
    id
    username
    email
  }
}`;

describe('User Query: me', () => {
	describe('when user is logged in', () => {
		it('returns user', async () => {
			await testSession
				.post('/graphql')
				.expect(200)
				.send({
					query: loginMutation,
					variables: {
						email: 'email@test.com',
						password: '1234',
					},
				});
			const meResponse = await testSession.post('/graphql').expect(200).send({
				query: meQuery,
			});
			expect(meResponse.body).toEqual({
				data: {
					me: { id: user.id, username: user.username, email: user.email },
				},
			});
		});
	});
	describe('when no user session exists', () => {
		it('returns null', async () => {
			const meResponse = await supertest(app)
				.post('/graphql')
				.expect(200)
				.send({
					query: meQuery,
				});
			expect(meResponse.body).toEqual({ data: { me: null } });
		});
	});
});
