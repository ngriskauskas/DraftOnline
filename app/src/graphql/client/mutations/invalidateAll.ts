export const invalidateAll = (cache: any, fieldName: string) => {
	cache
		.inspectFields('Query')
		.filter((info: any) => info.fieldName === fieldName)
		.forEach((info: any) => {
			cache.invalidate('Query', fieldName, info.arguments ?? {});
		});
};
