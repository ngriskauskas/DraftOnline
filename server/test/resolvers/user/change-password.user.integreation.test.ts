import { closeTestServer, initTestServer } from '../../test-utils/testServer';
import { Express } from 'express';
import { createSession } from '../../test-utils/createSession';
import { User } from '../../../src/entities/User';
import { hash } from 'argon2';
import { sendEmail } from '../../../src/utils/sendEmail';

let app: Express;

jest.mock('../../../src/utils/sendEmail');
const mockSendEmail = (sendEmail as unknown) as jest.Mock<typeof sendEmail>;

beforeAll(async () => {
	app = await initTestServer();
});

afterAll(async () => {
	await closeTestServer();
});

const changePasswordMutation = `
mutation ChangePassword($token: String!, $password: String!) {
  changePassword(input: { token: $token, password: $password }) {
    id
    username
    email
  }
}`;

const forgotPasswordMutation = `
mutation ForgotPassword($email: String!) {
	forgotPassword(email: $email) 
}`;

describe('User Mutation: Change Password', () => {
	describe('when forgot password token is valid', () => {
		beforeEach(async () => {
			await User.create({
				username: 'username',
				email: 'email@test.com',
				password: await hash('1234'),
			}).save();
		});
		it('returns user and changes password', async () => {
			const { session } = await createSession(app);
			await session
				.post('/graphql')
				.expect(200)
				.send({
					query: forgotPasswordMutation,
					variables: { email: 'email@test.com' },
				});
			const token = mockSendEmail.mock.calls[0][1].split('/')[4].split('"')[0];
			const changePasswordResonse = await session
				.post('/graphql')
				.expect(200)
				.send({
					query: changePasswordMutation,
					variables: {
						token,
						password: 'abcd',
					},
				});
			expect(changePasswordResonse.body.data.changePassword).toEqual({
				id: 1,
				username: 'username',
				email: 'email@test.com',
			});
		});
	});
	describe('when forgot password token is invalid', () => {
		it('returns error: Change Password Token Expired', async () => {
			const { session } = await createSession(app);
			const changePasswordResonse = await session
				.post('/graphql')
				.expect(200)
				.send({
					query: changePasswordMutation,
					variables: { token: '', password: 'abcd' },
				});
			expect(changePasswordResonse.body.errors[0].message).toEqual(
				'Change Password Token Expired'
			);
		});
	});
});
