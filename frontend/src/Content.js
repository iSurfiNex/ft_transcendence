import React from "react"
import { Routes ,Route } from 'react-router-dom';

import Game from "./pages/Game"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import WaitingRoom from "./pages/WaitingRoom"

export default function Content() {
	return (
		<Routes path="/">
			<Route index element={<Home/>}/>
			<Route path="game" element={<Game/>}/>
			<Route path="login" element={<Login/>}/>
			<Route path="profile" element={<Profile/>}/>
			<Route path="game/waiting-room" element={<WaitingRoom/>}/>
		</Routes>
	)
}
