import { useContext } from 'react';
import share from '../../img/share.svg';
import GlobalContext from '../../index';
import { Link } from 'react-router-dom';

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
						<Link to="/play/waiting-room/" className={`othergame-player-join btn btn-primary btn-lg ${game.players.length >= game.maxPlayer ? 'disabled' : ''}`} title="Join" disabled={game.players.length >= game.maxPlayer} onClick={() => handleGameChange(game.id)}>
							<img className="othergame-player-img" src={share} alt="join"/>
						</Link>
					</div>
				);
			})}
		</div>
	);
}

export default OtherGameList;
