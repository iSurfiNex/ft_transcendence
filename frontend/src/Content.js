import React from "react"
import { Routes, Route } from 'react-router-dom';

import Pong from "./pages/Pong/Pong"
import Home from "./pages/Home"
import Login from "./pages/Login"
import PongPowerup from "./pages/PongPowerup/PongPowerup"
import Profile from "./pages/Profile/Profile"
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
				<Route path="pong/" element={<Pong />}/>
				<Route path="pong-powerup/" element={<PongPowerup />}/>
				<Route path="tournament/" element={<Tournament />}/>
			</Route>
		</Routes>
	)
}
