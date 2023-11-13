import { useContext } from 'react';
import share from '../../img/share.svg';
import GlobalContext from '../../index';

function GameList() {
	const { globalData, updateGlobal } = useContext(GlobalContext);

	return (
		<div className="game-list">
			{globalData.jsonMap.games.map((game, index) => {
				const roomText = "ID: ";
				const gameTypeWidth = `${(game.type.length + roomText.length) * 20}px`;
				const gamePlayersWidth = `calc(100% - ${gameTypeWidth} - 190000px - 15px)`;

				console.log(100% - {gameTypeWidth} - 190000 - 15);

				return (
					<div key={index} className="game-desc">
						<div className="game-type">ID:{game.id}</div>
						<div className="game-players" style={{ gamePlayersWidth }}>
							{game.players.map((player, playerIndex) => (
								<div key={playerIndex} className="game-player">{player}</div>
							))}
						</div>
						<div className="game-player-count">{`${game.players.length}/${game.maxPlayer}`}</div>
						<button className="game-player-join btn btn-primary btn-lg" title="Join">
							<img className="game-player-img" src={share} alt="join"/>
						</button>
					</div>
				);
			})}
		</div>
	);
}

export default GameList;
