import React, { FC, ReactNode } from 'react';

interface ConditionalProps {
	showing: boolean;
	children: ReactNode;
}

const Conditional: FC<ConditionalProps> = ({ showing, children }) =>
	showing ? <> {children} </> : null;

export default Conditional;
