import React from "react";

import "./Game.css";
import GameList from './GameList'

function Game() {
	return (
		<div className="game">
			<div className="content">
				<div className="game-title">Pong</div>
				<div className="game-content">
					<div className="game-create">
						<button id="pong-button" className="pushable">
							<span className="front">CREATE GAME</span>
						</button>
					</div>
					<GameList />
				</div>
			</div>
		</div>
	);
}

export default Game;
