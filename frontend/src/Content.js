import React from "react"
import { Routes, Route } from 'react-router-dom';

import Game from "./pages/Game/Game"
import Home from "./pages/Home"
import Login from "./pages/Login"
import OtherGame from "./pages/OtherGame/OtherGame"
import Profile from "./pages/Profile"
import Tournament from "./pages/Tournament/Tournament"
import WaitingRoom from "./pages/WaitingRoom"

export default function Content() {
	return (
		<Routes path="/">
			<Route index element={<Home />}/>
			<Route path="login/" element={<Login />}/>
			<Route path="profile/" element={<Profile />}/>
			<Route path="play/">
				<Route path="waiting-room/" element={<WaitingRoom />}/>
				<Route path="pong/" element={<Game />}/>
				<Route path="pong-powerup/" element={<OtherGame />}/>
				<Route path="tournament/" element={<Tournament />}/>
			</Route>
		</Routes>
	)
}
