import 'regenerator-runtime/runtime.js';
import { fireEvent } from '@testing-library/dom';
import { useScroll } from '../../src/utils/useScroll';
import { renderHook } from '@testing-library/react-hooks';

let documentSpy: jest.SpyInstance;
const callBack = jest.fn();

beforeEach(() => {
	documentSpy = jest.spyOn(document, 'body', 'get');
});

afterEach(() => {
	documentSpy.mockRestore();
});

describe('useScroll', () => {
	describe('when scrolled to bottom of page', () => {
		it('calls function', () => {
			const { result } = renderHook(() => useScroll(callBack));
			fireEvent.scroll(window);
			expect(callBack).toHaveBeenCalledTimes(1);
		});
	});
	describe('when scrolled, but not bottom of page', () => {
		beforeEach(() => {
			documentSpy.mockImplementation(() => ({
				offsetHeight: 1000,
			}));
		});
		it('does nothing', async () => {
			const { result } = renderHook(() => useScroll(callBack));
			fireEvent.scroll(window);
			expect(callBack).toHaveBeenCalledTimes(0);
		});
	});
});
