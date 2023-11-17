import React, { useContext, useState } from "react";
import "./WaitingRoom.css";
import { Link } from "react-router-dom"
import GlobalContext from "../index";

function WaitingRoom() {
	const { globalData, updateGlobal } = useContext(GlobalContext);
	
	//var gameType = globalData.jsonMap.currentGame.type

	//var gameId = globalData.jsonMap.currentGame.id
	var gameId = 10
	var players = globalData.jsonMap.games[gameId].players.map( (item) =>
						{
							const user = globalData.jsonMap.users.find(user => user.nickname === item);
							const picture = (user ? user.picture : null);
							
							return (
							<Link className="link-wr" key={item} to="/profile"> 
									<div className="player-waiting-room"> 
										
										<img className="profil-pic-wr" src={process.env.PUBLIC_URL + '/' + picture} alt="profil pic"/>
										{item}

									</div>
							</Link>);
						} );

	
	return (
		<div className="background-waiting-room">
			<div className="rectangle-waiting-room">
				
				<div className="title-waiting-room"> Waiting Room </div>

				<div className="players-list-waiting-room"> {players} </div>

			</div>
		</div>
	);
}

export default WaitingRoom;