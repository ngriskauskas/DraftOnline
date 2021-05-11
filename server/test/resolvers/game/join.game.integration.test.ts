import { initTestServer, closeTestServer } from '../../test-utils/testServer';
import { Express } from 'express';
import { createSession } from '../../test-utils/createSession';
import { Game, GameStatus } from '../../../src/entities/Game';
import { User } from '../../../src/entities/User';

let app: Express;
beforeAll(async () => {
	app = await initTestServer();
});

afterAll(async () => {
	await closeTestServer();
});

const joinGameMutation = `
mutation JoinGame($id: Int!) {
  joinGame(input: { id: $id }) 
}`;

afterEach(async () => {
	User.delete({ username: 'username' });
	Game.delete(1);
});

describe('Game Mutation: join', () => {
	describe('when user is not logged in', () => {
		it('returns error: Not Logged In', async () => {
			const { session } = await createSession(app);

			const joinGameResponse = await session
				.post('/graphql')
				.expect(200)
				.send({ query: joinGameMutation, variables: { id: 1 } });

			expect(joinGameResponse.body.errors[0].message).toBe('Not Logged In');
		});
	});
	describe('when user is logged in and request is valid', () => {
		it('returns true', async () => {
			const { session, user } = await createSession(app, true);

			await Game.insert({
				creator: user,
				title: `Test`,
			});
			const joinGameResponse = await session
				.post('/graphql')
				.expect(200)
				.send({ query: joinGameMutation, variables: { id: 1 } });
			expect(joinGameResponse.body.data.joinGame).toBe(true);
		});
	});
	describe('when user is logged in and game id does not exist', () => {
		it('returns error: Game Not Found', async () => {
			const { session } = await createSession(app, true);
			const joinGameResponse = await session
				.post('/graphql')
				.expect(200)
				.send({ query: joinGameMutation, variables: { id: 1 } });
			expect(joinGameResponse.body.errors[0].message).toBe('Game not Found');
		});
	});
	describe('when user is logged in and game status is not open', () => {
		it('returns error: Game Not Open', async () => {
			const { session, user } = await createSession(app, true);

			const game = await Game.create({
				creator: user,
				title: `Test`,
				status: GameStatus.Active,
			}).save();

			const joinGameResponse = await session
				.post('/graphql')
				.expect(200)
				.send({ query: joinGameMutation, variables: { id: game.id } });
			expect(joinGameResponse.body.errors[0].message).toBe('Game not Open');
		});
	});
	describe('when user has already joined', () => {
		it('returns error: User Already Joined', async () => {
			const { session, user } = await createSession(app, true);

			const game = await Game.create({
				creator: user,
				title: `Test`,
			}).save();

			await session
				.post('/graphql')
				.expect(200)
				.send({ query: joinGameMutation, variables: { id: game.id } });

			const joinGameResponse = await session
				.post('/graphql')
				.expect(200)
				.send({ query: joinGameMutation, variables: { id: game.id } });

			expect(joinGameResponse.body.errors[0].message).toBe(
				'User Already Joined'
			);
		});
	});
	describe('when user is logged in and requested team is taken', () => {
		it('returns error: Team Already Taken', async () => {});
	});
});
