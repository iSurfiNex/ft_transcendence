import { useContext } from 'react';
import share from '../../img/share.svg';
import GlobalContext from '../../index';
import { Link } from 'react-router-dom';

function TournamentList() {
	const { globalData, updateGlobal } = useContext(GlobalContext);

	const handleGameChange = (id) => {
		const newGlobal = { ...globalData, jsonMap: { ...globalData.jsonMap, currentGame: id } };
		updateGlobal(newGlobal);
	};

	return (
		<div className="tournament-game-list">
			{globalData.jsonMap.games.filter(game => game.type === "tournament").filter(game => game.status !== "done").map((game, index) => {

				return (
					<div key={index} className="tournament-game-desc">
						<div className="tournament-game-type">ID:{game.id}</div>
						<div className="tournament-game-players">
							{game.players.map((player, playerIndex) => (
								<div key={playerIndex} className="tournament-game-player">{player}</div>
							))}
						</div>
						<div className="tournament-game-player-count">{`${game.players.length}/${game.maxPlayer}`}</div>
						<Link to="/play/waiting-room/" className={`tournament-game-player-join btn btn-primary btn-lg ${game.players.length >= game.maxPlayer ? 'disabled' : ''}`} title="Join" disabled={game.players.length >= game.maxPlayer} onClick={() => handleGameChange(game.id)}>
							<img className="tournament-game-player-img" src={share} alt="join"/>
						</Link>
					</div>
				);
			})}
		</div>
	);
}

export default TournamentList;
