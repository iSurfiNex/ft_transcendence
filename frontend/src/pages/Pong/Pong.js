import React from "react";

import "./Pong.css";
import PongList from './PongList'

function Pong() {
	return (
		<div className="pong">
			<div className="content">
				<div className="pong-title">Pong</div>
				<div className="pong-content">
					<div className="pong-create">
						<button id="pong-button" className="pushable">
							<span className="front">CREATE GAME</span>
						</button>
					</div>
					<PongList />
				</div>
			</div>
		</div>
	);
}

export default Pong;
