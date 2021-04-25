import 'regenerator-runtime/runtime.js';
import React from 'react';
import Login from '../../src/pages/login';
import { render } from '@testing-library/react';

describe('login page', () => {
	it('does stuff', () => {
		const { getByText } = render(<Login pageProps={null} />);
		expect(1).toBe(2);
	});
});
