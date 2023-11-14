import { useContext } from 'react';
import share from '../../img/share.svg';
import GlobalContext from '../../index';
import { Link } from 'react-router-dom';

function PongList() {
	const { globalData, updateGlobal } = useContext(GlobalContext);

	const handleGameChange = (id) => {
		const newGlobal = { ...globalData, jsonMap: { ...globalData.jsonMap, currentGame: id } };
		updateGlobal(newGlobal);
	};

	return (
		<div className="pong-list">
			{globalData.jsonMap.games.filter(game => game.type === "normal").filter(game => game.status !== "done").map((game, index) => {

				return (
					<div key={index} className="pong-desc">
						<div className="pong-type">ID:{game.id}</div>
						<div className="pong-players">
							{game.players.map((player, playerIndex) => (
								<div key={playerIndex} className="pong-player">{player}</div>
							))}
						</div>
						<div className="pong-player-count">{`${game.players.length}/${game.maxPlayer}`}</div>
						<Link to="/play/waiting-room/" className={`pong-player-join btn btn-primary btn-lg ${game.players.length >= game.maxPlayer ? 'disabled' : ''}`} title="Join" disabled={game.players.length >= game.maxPlayer} onClick={() => handleGameChange(game.id)}>
							<img className="pong-player-img" src={share} alt="join"/>
						</Link>
					</div>
				);
			})}
		</div>
	);
}

export default PongList;
