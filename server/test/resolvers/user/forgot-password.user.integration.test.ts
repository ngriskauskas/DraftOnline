import { closeTestServer, initTestServer } from '../../test-utils/testServer';
import { Express } from 'express';
import { createSession } from '../../test-utils/createSession';
import { sendEmail } from '../../../src/utils/sendEmail';

jest.mock('../../../src/utils/sendEmail');
const mockSendEmail = (sendEmail as unknown) as jest.Mock<typeof sendEmail>;

let app: Express;

beforeAll(async () => {
	app = await initTestServer();
});

afterAll(async () => {
	await closeTestServer();
});

const forgotPasswordMutation = `
mutation ForgotPassword($email: String!) {
	forgotPassword(email: $email) 
}`;

afterEach(() => {
	jest.clearAllMocks();
});
describe('User Mutation: Forgot Password', () => {
	describe('when email exists', () => {
		it('sends a reset password email', async () => {
			const { session, user } = await createSession(app, true);
			const forgotPasswordResponse = await session
				.post('/graphql')
				.expect(200)
				.send({
					query: forgotPasswordMutation,
					variables: { email: user!.email },
				});
			expect(mockSendEmail).toHaveBeenCalledWith(
				user!.email,
				expect.stringMatching(
					/<a href="http:\/\/localhost:3000\/change-password\/(.*)">Reset Password<\/a>/
				)
			);
			expect(forgotPasswordResponse.body.data.forgotPassword).toBe(true);
		});
	});
	describe('when email does not exist', () => {
		it('returns true and does not send an email', async () => {
			const { session } = await createSession(app);
			const forgotPasswordResponse = await session
				.post('/graphql')
				.expect(200)
				.send({
					query: forgotPasswordMutation,
					variables: { email: 'none@exists.not' },
				});
			expect(mockSendEmail).toHaveBeenCalledTimes(0);
			expect(forgotPasswordResponse.body.data.forgotPassword).toBe(true);
		});
	});
});
