import { useContext } from 'react';
import share from '../../img/share.svg';
import GlobalContext from '../../index';

function GameList() {
	const { globalData, updateGlobal } = useContext(GlobalContext);

	const handleGameChange = (id) => {
		const newGlobal = { ...globalData, jsonMap: { ...globalData.jsonMap, currentGame: id } };
		updateGlobal(newGlobal);
		window.location.href = 'waiting-room';
	};

	return (
		<div className="game-list">
			{globalData.jsonMap.games.filter(game => game.type === "normal").filter(game => game.status !== "done").map((game, index) => {

				return (
					<div key={index} className="game-desc">
						<div className="game-type">ID:{game.id}</div>
						<div className="game-players">
							{game.players.map((player, playerIndex) => (
								<div key={playerIndex} className="game-player">{player}</div>
							))}
						</div>
						<div className="game-player-count">{`${game.players.length}/${game.maxPlayer}`}</div>
						<button className="game-player-join btn btn-primary btn-lg" title="Join" disabled={game.players.length >= game.maxPlayer} onClick={() => handleGameChange(game.id)}>
							<img className="game-player-img" src={share} alt="join"/>
						</button>
					</div>
				);
			})}
		</div>
	);
}

export default GameList;
