import React from "react";

import "./OtherGame.css";
import OtherGameList from './OtherGameList'

function OtherGame() {
	return (
		<div className="othergame-game">
			<div className="content">
				<div className="othergame-game-title">PONG POWERUPS</div>
				<div className="othergame-game-content">
					<div className="othergame-game-create">
						<button id="pong-button" className="pushable">
							<span className="front">CREATE GAME</span>
						</button>
					</div>
					<OtherGameList />
				</div>
			</div>
		</div>
	);
}

export default OtherGame;
