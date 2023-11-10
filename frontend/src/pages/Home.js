import React from "react";

import './Home.css';

function Home() {
	return (
		<div className="home">
			<div className="background"></div>
			<div className="pong">
				<div className="title">PONG</div>
			</div>

			<div className="other-game">
				<div className="title">OTHER-GAME</div>
			</div>

			<div className="tournament">
				<div className="title">TOURNAMENT</div>
			</div>
		</div>
	);
}

export default Home;
