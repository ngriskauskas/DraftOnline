// import DataLoader from 'dataloader';
// import { In } from 'typeorm';
// import { Manager } from '../entities/Manager';
// import { User } from '../entities/User';
// export const createGameUserLoader = () =>
// 	new DataLoader<number, Manager[]>(async (gameIds) => {
// 		const gameUsers = await Manager.find({
// 			where: { gameId: In(gameIds as number[]) },
// 			relations: ['user'],
// 		});

// 		const gameIdToGameUsers: Record<number, Manager[]> = {};

// 		gameIds.forEach((gameId) => {
// 			gameIdToGameUsers[gameId] = [];
// 		});
// 		gameUsers.forEach((gameUser) => {
// 			gameIdToGameUsers[gameUser.gameId].push(gameUser);
// 		});

// 		return gameIds.map((gameId) => gameIdToGameUsers[gameId]);
// 	});

// export const createManangerLoader = () =>
// 	new DataLoader<number, User>(async (teamIds) => {
// 		const gameUsers = await Manager.find({
// 			where: { teamId: In(teamIds as number[]) },
// 			relations: ['user'],
// 		});
// 		const teamIdToUser: Record<number, User> = {};

// 		gameUsers.forEach((gameUser) => {
// 			teamIdToUser[gameUser.teamId] = gameUser.user;
// 		});
// 		return teamIds.map((teamId) => teamIdToUser[teamId]);
// 	});
