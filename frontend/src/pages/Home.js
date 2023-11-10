import { React } from 'react';
import { useNavigate } from "react-router-dom";

import './Home.css';

function Home() {
    const navigate = useNavigate();

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async function pongHandler() {
		document.getElementById("pong").style.zIndex=50;
		document.getElementById("pong-content").classList.add("hidden");
		document.getElementById("other-game").classList.add("hidden");
		document.getElementById("tournament").classList.add("hidden");
		document.getElementById("pong").style.borderRadius=0;
		document.getElementById("pong").style.left=0;
		document.getElementById("pong").style.top=0;
		document.getElementById("pong").style.width="100%";
		document.getElementById("pong").style.height="100%";
		await sleep(400);
		navigate("game");
	}
	async function othergameHandler() {
		document.getElementById("other-game").style.zIndex=50;
		document.getElementById("other-game-content").classList.add("hidden");
		document.getElementById("pong").classList.add("hidden");
		document.getElementById("tournament").classList.add("hidden");
		document.getElementById("other-game").style.borderRadius=0;
		document.getElementById("other-game").style.left=0;
		document.getElementById("other-game").style.top=0;
		document.getElementById("other-game").style.width="100%";
		document.getElementById("other-game").style.height="100%";
		await sleep(400);
		navigate("othergame");
	}
	async function tournamentHandler() {
		document.getElementById("tournament").style.zIndex=50;
		document.getElementById("tournament-content").classList.add("hidden");
		document.getElementById("pong").classList.add("hidden");
		document.getElementById("other-game").classList.add("hidden");
		document.getElementById("tournament").style.borderRadius=0;
		document.getElementById("tournament").style.left=0;
		document.getElementById("tournament").style.top=0;
		document.getElementById("tournament").style.width="100%";
		document.getElementById("tournament").style.height="100%";
		await sleep(400);
		navigate("tournament");
	}

	return (
		<div className="home">
			<div id="pong" className="pong">
				<div id="pong-content" className="content">
					<div id="pong-title" className="title">PONG</div>
					<div className="button">
						<button id="pong-button" onClick={pongHandler} class="pushable">
							<span class="front">PLAY</span>
						</button>
					</div>
					<div className="queue">
						<span className="player-nb">7</span><span className="player-text"> player(s) currently in game and/or in waiting-room.</span>
					</div>
				</div>
			</div>

			<div id="other-game" className="other-game">
				<div id="other-game-content" className="content">
					<div id="other-game-title" className="title">OTHER-GAME</div>
					<div className="button">
						<button id="other-game-button" onClick={othergameHandler} class="pushable">
							<span class="front">PLAY</span>
						</button>
					</div>
					<div className="queue">
						<span className="player-nb">0</span><span className="player-text"> player(s) currently in game and/or in waiting-room.</span>
					</div>
				</div>
			</div>

			<div id="tournament" className="tournament">
				<div id="tournament-content" className="content">
					<div id="tournament-title" className="title">TOURNAMENT</div>
					<div className="button">
						<button id="tournament-button" onClick={tournamentHandler} class="pushable">
							<span class="front">PLAY</span>
						</button>
					</div>
					<div className="queue">
						<span className="player-nb">8.462</span><span className="player-text"> player(s) currently in game and/or in waiting-room.</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
