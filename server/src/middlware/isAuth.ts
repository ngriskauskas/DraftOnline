import { Context } from 'src/types';
import { MiddlewareFn } from 'type-graphql';

export const isAuth: MiddlewareFn<Context> = ({ context: { req } }, next) => {
	if (!req.session.userId) {
		throw new Error('Not Logged In');
	} else {
		return next();
	}
};
