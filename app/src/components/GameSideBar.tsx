import {
	Box,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Link,
	VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

interface GameSideBarProps {
	sideNavWidth: number;
	isOpen: boolean;
	variant: string | undefined;
	onClose: () => void;
}

const GameSideBar: FC<GameSideBarProps> = ({
	sideNavWidth,
	variant,
	isOpen,
	onClose,
}) => {
	const router = useRouter();

	const sideBarContent = (
		<VStack>
			<Box>
				<NextLink href='/game/[id]' as={`/game/${router.query.id}`}>
					<Link>Overview</Link>
				</NextLink>
			</Box>
			<Box>
				<NextLink
					href='/game/[id]/roster'
					as={`/game/${router.query.id}/roster`}>
					<Link>Roster</Link>
				</NextLink>
			</Box>
			<Box>
				<NextLink href='/game/[id]/teams' as={`/game/${router.query.id}/teams`}>
					<Link>Teams</Link>
				</NextLink>
			</Box>
			<Box>
				<NextLink href='/game/[id]/draft' as={`/game/${router.query.id}/draft`}>
					<Link>Draft</Link>
				</NextLink>
			</Box>
			<Box>
				<NextLink
					href='/game/[id]/players'
					as={`/game/${router.query.id}/players`}>
					<Link>Players</Link>
				</NextLink>
			</Box>
		</VStack>
	);

	return variant === 'sidebar' ? (
		<Box bg='lightgrey' position='fixed' p={3} w={sideNavWidth} h='100%'>
			{sideBarContent}
		</Box>
	) : (
		<Drawer isOpen={isOpen} placement='left' onClose={onClose}>
			<DrawerOverlay>
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Draft Online</DrawerHeader>
					<DrawerBody>{sideBarContent}</DrawerBody>
				</DrawerContent>
			</DrawerOverlay>
		</Drawer>
	);
};

export default GameSideBar;
