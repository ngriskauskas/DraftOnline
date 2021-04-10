import React, { FC } from 'react';

interface ConditionalProps {
	showing: boolean;
}

const Conditional: FC<ConditionalProps> = ({ showing, children }) =>
	showing ? <> {children} </> : null;

export default Conditional;
