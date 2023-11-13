import React from "react";

import share from '../img/share.svg';
import "./Game.css";

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
					<div className="game-list">
						<div className="game-desc">
							<div className="game-type">Normal</div>
							<div className="game-players">
								<div className="game-player">rsterin</div>
								<div className="game-player">rsterin</div>
							</div>
							<div className="game-player-count">2/8</div>
							<button className="game-player-join btn btn-primary btn-lg" title="Join">
								<img className="game-player-img" src={share} alt="join"/>
							</button>
						</div><div className="game-desc">
							<div className="game-type">Normal</div>
							<div className="game-players">
								<div className="game-player">rsterin</div>
								<div className="game-player">rsterin</div>
							</div>
							<div className="game-player-count">2/8</div>
							<button className="game-player-join btn btn-primary btn-lg" title="Join">
								<img className="game-player-img" src={share} alt="join"/>
							</button>
						</div><div className="game-desc">
							<div className="game-type">Normal</div>
							<div className="game-players">
								<div className="game-player">rsterin</div>
								<div className="game-player">rsterin</div>
							</div>
							<div className="game-player-count">2/8</div>
							<button className="game-player-join btn btn-primary btn-lg" title="Join">
								<img className="game-player-img" src={share} alt="join"/>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Game;
