import { Resolver } from '@urql/exchange-graphcache';
import { stringifyVariables } from 'urql';

export const cursorPagination = (): Resolver => {
	return (parent, fieldArgs, cache, info) => {
		const { parentKey, fieldName } = info;
		const fieldInfos = cache
			.inspectFields(parentKey)
			.filter((info) => info.fieldName === fieldName);

		if (fieldInfos.length === 0) {
			return undefined;
		}
		info.partial = !cache.resolve(
			parentKey,
			`${fieldName}(${stringifyVariables(fieldArgs)})`
		);

		return fieldInfos.flatMap((info) =>
			cache.resolve(parentKey, info.fieldKey)
		);
	};
};
