import React from "react";
import "./WaitingRoom.css";
import { Link } from "react-router-dom"

function WaitingRoom() {
	var players = ["tonton_adolf6969", "oussama_sama", "miaKalifa", "augustAmes", "nikitaBelucci", "abellaDanger"]
	var linkPlayers = players.map((item)=>(<Link to="/profile"><div className="player-waiting-room"> {item} </div> </Link>))

	return (
		<div className="background-waiting-room">
			<div className="rectangle-waiting-room">
				
				<div className="title-waiting-room">
					Waiting Room
				</div>

				<div className="players-list-waiting-room"> 
					{linkPlayers}
				</div>

			</div>
		</div>
	);
}

export default WaitingRoom;