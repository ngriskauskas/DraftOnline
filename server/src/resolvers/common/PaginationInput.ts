import { Max, Min } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class PaginationInput {
	@Field(() => Int)
	@Min(1)
	@Max(25)
	limit: number;

	@Field(() => String, { nullable: true })
	cursor?: string;
}
