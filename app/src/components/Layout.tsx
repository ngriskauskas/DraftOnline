import React, { FC } from 'react';
import NavBar from './NavBar';
import Wrapper, { WrapperVariant } from './Wrapper';

interface LayoutProps {
	variant?: WrapperVariant;
}

const Layout: FC<LayoutProps> = ({ children, variant }) => {
	return (
		<>
			<NavBar />
			<Wrapper variant={variant}>{children}</Wrapper>
		</>
	);
};

export default Layout;
