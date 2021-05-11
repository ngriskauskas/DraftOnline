import { invalidateAll } from './invalidateAll';

export const joinGame = (_result: any, args: any, cache: any, info: any) => {
	invalidateAll(cache, 'games');
};
