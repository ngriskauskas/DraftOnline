import { invalidateAll } from './invalidateAll';

export const createGame = (_result: any, args: any, cache: any, info: any) => {
	invalidateAll(cache, 'games');
};
