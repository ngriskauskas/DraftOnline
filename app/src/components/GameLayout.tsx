import { Box } from '@chakra-ui/layout';
import { useBreakpointValue } from '@chakra-ui/media-query';
import React, { FC, useState } from 'react';
import GameSideBar from './GameSideBar';
import NavBar from './NavBar';

interface GameLayoutProps {}

const sideNavWidth = 100;

const smVariant = { navigation: 'drawer', navButton: true };
const mdVariant = { navigation: 'sidebar', navButton: false };

const GameLayout: FC<GameLayoutProps> = ({ children }) => {
	const [isSidebarOpen, setSidebarOpen] = useState(false);
	const variants = useBreakpointValue({ base: smVariant, md: mdVariant });

	const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

	return (
		<>
			<NavBar
				onShowSideBar={toggleSidebar}
				showNavButton={variants?.navButton ?? false}
			/>
			<Box>
				<GameSideBar
					sideNavWidth={sideNavWidth}
					variant={variants?.navigation}
					isOpen={isSidebarOpen}
					onClose={toggleSidebar}
				/>
				<Box
					ml={variants?.navigation === 'sidebar' ? sideNavWidth : 0}
					pt={5}
					px={8}>
					{children}
				</Box>
			</Box>
		</>
	);
};

export default GameLayout;
