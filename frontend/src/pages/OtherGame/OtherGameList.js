import { useContext } from 'react';
import share from '../../img/share.svg';
import GlobalContext from '../../index';

function OtherGameList() {
	const { globalData, updateGlobal } = useContext(GlobalContext);

	const handleGameChange = (id) => {
		const newGlobal = { ...globalData, jsonMap: { ...globalData.jsonMap, currentGame: id } };
		updateGlobal(newGlobal);
		window.location.href = 'waiting-room';
	};

	return (
		<div className="othergame-game-list">
			{globalData.jsonMap.games.filter(game => game.type === "othergame").filter(game => game.status !== "done").map((game, index) => {

				return (
					<div key={index} className="othergame-game-desc">
						<div className="othergame-game-type">ID:{game.id}</div>
						<div className="othergame-game-players">
							{game.players.map((player, playerIndex) => (
								<div key={playerIndex} className="othergame-game-player">{player}</div>
							))}
						</div>
						<div className="othergame-game-player-count">{`${game.players.length}/${game.maxPlayer}`}</div>
						<button className="othergame-game-player-join btn btn-primary btn-lg" title="Join" disabled={game.players.length >= game.maxPlayer} onClick={() => handleGameChange(game.id)}>
							<img className="othergame-game-player-img" src={share} alt="join"/>
						</button>
					</div>
				);
			})}
		</div>
	);
}

export default OtherGameList;
