import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { GameUser } from '../entities/GameUser';
export const createGameUserLoader = () =>
	new DataLoader<number, GameUser[]>(async (gameIds) => {
		const gameUsers = await GameUser.find({
			where: { gameId: In(gameIds as number[]) },
			relations: ['user'],
		});

		const gameIdToGameUsers: Record<number, GameUser[]> = {};

		gameIds.forEach((gameId) => {
			gameIdToGameUsers[gameId] = [];
		});
		gameUsers.forEach((gameUser) => {
			gameIdToGameUsers[gameUser.gameId].push(gameUser);
		});

		return gameIds.map((gameId) => gameIdToGameUsers[gameId]);
	});
