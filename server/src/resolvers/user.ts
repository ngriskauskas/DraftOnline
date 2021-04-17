import { User } from '../entities/User';
import { MyContext } from '../types';
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from 'type-graphql';
import { hash, verify } from 'argon2';
import { Length, IsEmail } from 'class-validator';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid';

@InputType()
export class UserLoginInput {
	@Field()
	@IsEmail()
	email: string;

	@Field()
	@Length(4)
	password: string;
}

@InputType()
export class UserRegisterInput {
	@Field()
	@Length(4)
	username: string;

	@Field()
	@IsEmail()
	email: string;

	@Field()
	@Length(4)
	password: string;
}

@InputType()
export class ChangePasswordInput {
	@Field()
	token: string;

	@Field()
	@Length(4)
	password: string;
}

@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: true })
	me(@Ctx() { req }: MyContext) {
		if (!req.session.userId) {
			return null;
		}
		return User.findOne(req.session.userId, { relations: ['upvotes'] });
	}

	@Mutation(() => User)
	async register(@Arg('input') input: UserRegisterInput, @Ctx() { req }: MyContext): Promise<User> {
		try {
			const user = await User.create({
				username: input.username,
				email: input.email,
				password: await hash(input.password),
			}).save();
			req.session.userId = user.id;
			return user;
		} catch (err) {
			if (err.message.includes('duplicate')) {
				throw new Error('User Already Exists');
			} else throw err;
		}
	}

	@Mutation(() => User)
	async login(@Arg('input') input: UserLoginInput, @Ctx() { req }: MyContext): Promise<User> {
		const user = await User.findOne({
			where: { email: input.email },
		});
		if (!user) {
			throw new Error('Incorrect Email or Password');
		}
		if (!(await verify(user.password, input.password))) throw new Error('Incorrect Email or Password');

		req.session.userId = user.id;
		return user;
	}

	@Mutation(() => Boolean)
	async logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
		return new Promise((resolve) =>
			req.session.destroy((err) => {
				if (err) resolve(false);
				else {
					res.clearCookie(COOKIE_NAME);
					resolve(true);
				}
			})
		);
	}

	@Mutation(() => Boolean)
	async forgotPassword(@Arg('email') email: string, @Ctx() { redis }: MyContext): Promise<Boolean> {
		const user = await User.findOne({
			where: { email },
		});
		if (!user) {
			return true;
		}
		const token = v4();

		await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60);
		await sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`);
		return true;
	}

	@Mutation(() => User)
	async changePassword(@Arg('input') input: ChangePasswordInput, @Ctx() { redis, req }: MyContext): Promise<User> {
		const userId = await redis.get(FORGET_PASSWORD_PREFIX + input.token);
		if (!userId) {
			throw new Error('Change Password Token Expired');
		}
		await User.update(userId, { password: await hash(input.password) });
		const user = await User.findOneOrFail(userId);
		redis.del(FORGET_PASSWORD_PREFIX + input.token);
		req.session.userId = user.id;
		return user;
	}
}
