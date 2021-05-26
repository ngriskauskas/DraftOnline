import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React, { FC } from 'react';
import { Player } from '../generated/graphql';

interface PlayerTableProps {
	players:
		| ({
				__typename?: 'Player' | undefined;
		  } & Pick<Player, 'id' | 'position'>)[]
		| undefined;
}

const PlayerTable: FC<PlayerTableProps> = ({ players }) => {
	return (
		<Table size='sm'>
			<Thead>
				<Tr>
					<Th>Id</Th>
					<Th>Pos</Th>
				</Tr>
			</Thead>
			<Tbody>
				{players &&
					players.map((player) => {
						return (
							<Tr key={player.id}>
								<Td>{player.id}</Td>
								<Td>{player.position}</Td>
							</Tr>
						);
					})}
			</Tbody>
		</Table>
	);
};

export default PlayerTable;
