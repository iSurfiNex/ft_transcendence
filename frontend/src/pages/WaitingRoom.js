import React from "react";
import "./WaitingRoom.css";
import { Link } from "react-router-dom"

function WaitingRoom() {
	var toto = ["tonton_adolf6969", "oussama_sama", "miaKalifa", "augustAmes", "nikitaBelucci", "abellaDanger"]
	var truc = toto.map((item)=>(<Link to="/profile"><div className="player"> {item} </div> </Link>))

	return (
		<div className="background-waiting-room">
			<div className="rectangle">
				
				<div className="title">
					Waiting Room
				</div>

				<div className="players"> 
					{truc}
				</div>

			</div>
		</div>
	);
}

export default WaitingRoom;