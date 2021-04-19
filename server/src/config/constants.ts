import dotenv from 'dotenv';
import { BuildSchemaOptions } from 'type-graphql';
import { PostResolver } from '../resolvers/post';
import { ChangePasswordResolver } from '../resolvers/user/change-password.user';
import { ForgotPasswordResolver } from '../resolvers/user/forgot-password.user';
import { LoginResolver } from '../resolvers/user/login.user';
import { LogoutResolver } from '../resolvers/user/logout.user';
import { MeResolver } from '../resolvers/user/me.user';
import { RegisterResolver } from '../resolvers/user/register.user';
dotenv.config();

export const __prod__ = process.env.NODE_ENV === 'production';
export const __session__ = process.env.SESSION_SECRET;
export const __dbPassword__ = process.env.DB_PASSWORD;
export const COOKIE_NAME = 'qid';
export const FORGET_PASSWORD_PREFIX = 'forgot-password:';
export const Resolvers: BuildSchemaOptions['resolvers'] = [
	PostResolver,
	MeResolver,
	RegisterResolver,
	LogoutResolver,
	LoginResolver,
	ChangePasswordResolver,
	ForgotPasswordResolver,
];
