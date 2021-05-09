import { isServer } from '../../src/utils/isServer';

let windowSpy: jest.SpyInstance;
beforeEach(() => {
	windowSpy = jest.spyOn(window, 'window', 'get');
});

afterEach(() => {
	windowSpy.mockRestore();
});

describe('isServer', () => {
	describe('when window is defined', () => {
		it('returns false', () => {
			windowSpy.mockImplementation(() => ({}));
			expect(isServer()).toBe(false);
		});
	});
	describe('when window is undefined', () => {
		it('returns true', () => {
			windowSpy.mockImplementation(() => undefined);
			expect(isServer()).toBe(true);
		});
	});
});
