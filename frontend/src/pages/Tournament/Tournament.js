import React from "react";

import "./Tournament.css";
import TournamentList from './TournamentList'

function Tournament() {
	return (
		<div className="tournament-game">
			<div className="content">
				<div className="tournament-game-title">Tournament</div>
				<div className="tournament-game-content">
					<div className="tournament-game-create">
						<button id="pong-button" className="pushable">
							<span className="front">CREATE TOURNAMENT</span>
						</button>
					</div>
					<TournamentList />
				</div>
			</div>
		</div>
	);
}

export default Tournament;
