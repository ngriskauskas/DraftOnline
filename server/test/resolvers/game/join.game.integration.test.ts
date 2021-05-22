import { Express } from 'express';
import { Game, GameStatus } from '../../../src/entities/Game';
import { Team, TeamName } from '../../../src/entities/Team';
import { User } from '../../../src/entities/User';
import { createSession } from '../../test-utils/createSession';
import { closeTestServer, initTestServer } from '../../test-utils/testServer';

let app: Express;
beforeEach(async () => {
	app = await initTestServer();
});

afterEach(async () => {
	await closeTestServer();
});

const joinGameMutation = `
mutation JoinGame($id: Int!, $teamId: Int!) {
  joinGame(input: { id: $id, teamId: $teamId }) 
}`;

describe('Game Mutation: join', () => {
	describe('when user is not logged in', () => {
		it('returns error: Not Logged In', async () => {
			const { session } = await createSession(app);

			const joinGameResponse = await session
				.post('/graphql')
				.expect(200)
				.send({ query: joinGameMutation, variables: { id: 1, teamId: 1 } });

			expect(joinGameResponse.body.errors[0].message).toBe('Not Logged In');
		});
	});
	describe('when request is valid', () => {
		it('returns true', async () => {
			const { session, user } = await createSession(app, true);

			const game = await Game.create({
				creator: user,
				title: `Test`,
				teams: [
					Team.create({
						name: TeamName.Bears,
					}),
				],
			}).save();

			const joinGameResponse = await session
				.post('/graphql')
				.expect(200)
				.send({
					query: joinGameMutation,
					variables: { id: game.id, teamId: 1 },
				});
			expect(joinGameResponse.body.data.joinGame).toBe(true);
		});
	});
	describe('when game id does not exist', () => {
		it('returns error: Game Not Found', async () => {
			const { session } = await createSession(app, true);
			const joinGameResponse = await session
				.post('/graphql')
				.expect(200)
				.send({ query: joinGameMutation, variables: { id: 1, teamId: 1 } });
			expect(joinGameResponse.body.errors[0].message).toBe('Game not Found');
		});
	});
	describe('when team id does not exist', () => {
		it('returns error: Team Not Found', async () => {
			const { session, user } = await createSession(app, true);
			const game = await Game.create({
				creator: user,
				title: `Test`,
				status: GameStatus.Open,
			}).save();

			const joinGameResponse = await session
				.post('/graphql')
				.expect(200)
				.send({
					query: joinGameMutation,
					variables: { id: game.id, teamId: -1 },
				});
			expect(joinGameResponse.body.errors[0].message).toBe('Team not Found');
		});
	});
	describe('when game status is not open', () => {
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
				.send({
					query: joinGameMutation,
					variables: { id: game.id, teamId: 1 },
				});
			expect(joinGameResponse.body.errors[0].message).toBe('Game not Open');
		});
	});
	describe('when user has already joined', () => {
		it('returns error: User Already Joined', async () => {
			const { session, user } = await createSession(app, true);

			const game = await Game.create({
				creator: user,
				title: `Test`,
				teams: [
					Team.create({
						name: TeamName.Bears,
					}),
				],
			}).save();

			await session
				.post('/graphql')
				.expect(200)
				.send({
					query: joinGameMutation,
					variables: { id: game.id, teamId: 1 },
				});

			const joinGameResponse = await session
				.post('/graphql')
				.expect(200)
				.send({
					query: joinGameMutation,
					variables: { id: game.id, teamId: 1 },
				});

			expect(joinGameResponse.body.errors[0].message).toBe(
				'User Already Joined'
			);
		});
	});
	describe('when requested team is taken', () => {
		it('returns error: Team Already Taken', async () => {
			const { session, user } = await createSession(app, true);

			const anotherUser = await User.create({
				username: 'someone',
				email: 'test@email.com',
				password: '1234',
			}).save();

			const game = await Game.create({
				creator: user,
				title: `Test`,
				teams: [
					Team.create({
						name: TeamName.Bears,
						manager: {
							user: anotherUser,
						},
					}),
				],
			}).save();

			const joinGameResponse = await session
				.post('/graphql')
				.expect(200)
				.send({
					query: joinGameMutation,
					variables: { id: game.id, teamId: 1 },
				});
			expect(joinGameResponse.body.errors[0].message).toBe(
				'Team already Taken'
			);
		});
	});
});
