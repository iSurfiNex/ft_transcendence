import React from "react";

import "./PongPowerup.css";
import PongPowerupList from './PongPowerupList'

function PongPowerup() {
	return (
		<div className="pong-powerup">
			<div className="content">
				<div className="pong-powerup-title">PONG POWERUPS</div>
				<div className="pong-powerup-content">
					<div className="pong-powerup-create">
						<button id="pong-button" className="pushable">
							<span className="front">CREATE GAME</span>
						</button>
					</div>
					<PongPowerupList />
				</div>
			</div>
		</div>
	);
}

export default PongPowerup;
