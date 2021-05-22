import { closeTestServer, initTestServer } from '../../test-utils/testServer';
import { Express } from 'express';
import { createSession } from '../../test-utils/createSession';
import { Game } from '../../../src/entities/Game';
import { Team, TeamName } from '../../../src/entities/Team';
import { User } from '../../../src/entities/User';
import { Manager } from '../../../src/entities/Manager';

let app: Express;
let session: any;
let user: User | undefined;
beforeAll(async () => {
	app = await initTestServer();
});

afterAll(async () => {
	await closeTestServer();
});

const teamsQuery = `
query Teams($gameId: Int!) {
	teams(input: {gameId: $gameId}) {
		id
    name
		manager {
			id
			username
		}
  }
}`;

beforeAll(async () => {
	({ session, user } = await createSession(app, true));
});

describe('Team Query: teams', () => {
	describe('when game exists', () => {
		it('returns teams', async () => {
			const game = await Game.create({
				title: 'Test',
				teams: [
					Team.create({
						name: TeamName.Bears,
					}),
					Team.create({
						name: TeamName.Cardinals,
						manager: Manager.create({
							user,
						}),
					}),
				],
			}).save();
			const teamsResponse = await session.post('/graphql').send({
				query: teamsQuery,
				variables: {
					gameId: game.id,
				},
			});
			expect(teamsResponse.body.data.teams).toHaveLength(2);
		});
	});
	describe('when game does not exist', () => {
		it('returns empty array', async () => {
			const teamsResponse = await session.post('/graphql').send({
				query: teamsQuery,
				variables: {
					gameId: -1,
				},
			});
			expect(teamsResponse.body.data.teams).toHaveLength(0);
		});
	});
});
