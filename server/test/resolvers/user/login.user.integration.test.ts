import { hash } from 'argon2';
import { User } from '../../../src/entities/User';
import { Express } from 'express';
import { closeTestServer, initTestServer } from '../../test-utils/testServer';
import supertest from 'supertest';

let app: Express;
let user: User;
beforeAll(async () => {
	app = await initTestServer();
	user = await User.create({
		username: 'username',
		email: 'email@test.com',
		password: await hash('1234'),
	}).save();
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
//TODO Confirm user is actuall logged in afterwords, use me query?
describe('login', () => {
	describe('when login info is valid', () => {
		it('returns user', async () => {
			const loginResponse = await supertest(app)
				.post('/graphql')
				.send({
					query: loginMutation,
					variables: {
						email: 'email@test.com',
						password: '1234',
					},
				})
				.expect(200);

			expect(loginResponse.body).toEqual({
				data: {
					login: { id: user.id, username: user.username, email: user.email },
				},
			});
		});
	});
	describe('when email does not exist', () => {
		it('returns error: incorrect email or password', async () => {
			const loginResponse = await supertest(app)
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
		});
	});
	describe('when password is wrong', () => {
		it('returns error: incorrect email or password', async () => {
			const loginResponse = await supertest(app)
				.post('/graphql')
				.send({
					query: loginMutation,
					variables: {
						email: 'email@missing.com',
						password: 'abcd',
					},
				})
				.expect(200);
			expect(loginResponse.body.errors!.length).toBe(1);
			expect(loginResponse.body.errors![0].message).toEqual(
				'Incorrect Email or Password'
			);
		});
	});
});
