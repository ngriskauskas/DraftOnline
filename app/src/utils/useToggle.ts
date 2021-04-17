import { useState } from 'react';

export function useToggle<D, A, B>(initial: D, a: A, b: B): [D | A | B, (value: A | B) => void] {
	const [state, setState] = useState<D | A | B>(initial);

	const toggle = (value: A | B) => {
		setState((current) => (current === value ? initial : value));
	};
	return [state, toggle];
}
