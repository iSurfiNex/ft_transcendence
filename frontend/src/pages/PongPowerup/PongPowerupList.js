import { useContext } from 'react';
import share from '../../img/share.svg';
import GlobalContext from '../../index';
import { Link } from 'react-router-dom';

function PongPowerupList() {
	const { globalData, updateGlobal } = useContext(GlobalContext);

	const handleGameChange = (id) => {
		const newGlobal = { ...globalData, jsonMap: { ...globalData.jsonMap, currentGame: id } };
		updateGlobal(newGlobal);
		window.location.href = 'waiting-room';
	};

	return (
		<div className="pong-powerup-list">
			{globalData.jsonMap.games.filter(game => game.type === "powerup").filter(game => game.status !== "done").map((game, index) => {

				return (
					<div key={index} className="pong-powerup-desc">
						<div className="pong-powerup-type">ID:{game.id}</div>
						<div className="pong-powerup-players">
							{game.players.map((player, playerIndex) => (
								<div key={playerIndex} className="pong-powerup-player">{player}</div>
							))}
						</div>
						<div className="pong-powerup-player-count">{`${game.players.length}/${game.maxPlayer}`}</div>
						<Link to="/play/waiting-room/" className={`pong-powerup-player-join btn btn-primary btn-lg ${game.players.length >= game.maxPlayer ? 'disabled' : ''}`} title="Join" disabled={game.players.length >= game.maxPlayer} onClick={() => handleGameChange(game.id)}>
							<img className="pong-powerup-player-img" src={share} alt="join"/>
						</Link>
					</div>
				);
			})}
		</div>
	);
}

export default PongPowerupList;
