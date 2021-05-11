import { toErrorMap } from '../../src/utils/toErrorMap';
import { mockErrorResponse } from '../test-utils/mockQuery';

describe('toErrorMap', () => {
	describe('when Argument Validation Error', () => {
		it('returns object of validation properties and messages', () => {
			const error = mockErrorResponse({
				message: 'Argument Validation Error',
				validationErrors: [
					{ property: 'a', message: 'a' },
					{ property: 'b', message: 'b' },
				],
			});
			expect(toErrorMap(error, 'a')).toStrictEqual({ a: 'a', b: 'b' });
		});
	});
	describe('when other error', () => {
		it('returns default key with error', () => {
			const error = mockErrorResponse({
				message: 'Error',
			});
			expect(toErrorMap(error, 'a')).toStrictEqual({ a: 'Error' });
		});
	});
});
