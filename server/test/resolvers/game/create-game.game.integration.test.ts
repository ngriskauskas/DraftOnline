import { initTestServer, closeTestServer } from '../../test-utils/testServer';
import { Express } from 'express';
import { createSession } from '../../test-utils/createSession';
import { User } from '../../../src/entities/User';

let app: Express;

beforeAll(async () => {
	app = await initTestServer();
});

afterAll(async () => {
	await closeTestServer();
});

afterEach(async () => {
	User.delete(1);
});

const createGameMutation = `
mutation CreateGame($title: String!) {
  createGame(input: {title: $title}) {
		id
    title
    creator {
      id
      username
    }
  }
}`;

describe('Game Mutation: create-game', () => {
	describe('when not logged in', () => {
		it('returns error', async () => {
			const { session } = await createSession(app);
			const createGameResponse = await session
				.post('/graphql')
				.expect(200)
				.send({
					query: createGameMutation,
					variables: {
						title: 'Test',
					},
				});
			expect(createGameResponse.body.errors[0].message).toEqual(
				'Not Logged In'
			);
		});
	});
	describe('when input is valid', () => {
		it('returns game', async () => {
			const { session, user } = await createSession(app, true);
			const createGameResponse = await session
				.post('/graphql')
				.expect(200)
				.send({
					query: createGameMutation,
					variables: {
						title: 'Test',
					},
				});
			expect(createGameResponse.body.data.createGame).toEqual({
				creator: {
					id: user!.id,
					username: user!.username,
				},
				id: 1,
				title: 'Test',
			});
		});
	});
	describe('when input is invalid', () => {
		it('returns error: argument validation error', async () => {
			const { session } = await createSession(app, true);
			const createGameResponse = await session
				.post('/graphql')
				.expect(200)
				.send({
					query: createGameMutation,
					variables: {
						title: '',
					},
				});
			expect(createGameResponse.body.errors[0].message).toEqual(
				'Argument Validation Error'
			);
		});
	});
});
