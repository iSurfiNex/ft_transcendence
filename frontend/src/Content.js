import React, { useContext } from "react"
import { Routes, Route, Navigate } from 'react-router-dom';

import Pong from "./pages/Pong/Pong"
import Home from "./pages/Home"
import Login from "./pages/Login"
import PongPowerup from "./pages/PongPowerup/PongPowerup"
import Profile from "./pages/Profile/Profile"
import Tournament from "./pages/Tournament/Tournament"
import WaitingRoom from "./pages/WaitingRoom"
import GlobalContext from './index';

export default function Content() {
	const { globalData } = useContext(GlobalContext);

	return (
		<Routes path="/">
			<Route index element={globalData.jsonMap.isLoggedIn ? <Home /> : <Navigate to="/login/"/>}/>
			<Route path="login/" element={!globalData.jsonMap.isLoggedIn ? <Login /> : <Navigate to="/home/"/>}/>
			<Route path="profile/" element={globalData.jsonMap.isLoggedIn ? <Profile /> : <Navigate to="/login/"/>}/>
			<Route path="play/">
				<Route path="waiting-room/" element={globalData.jsonMap.isLoggedIn ? <WaitingRoom /> : <Navigate to="/login/"/>}/>
				<Route path="pong/" element={globalData.jsonMap.isLoggedIn ? <Pong /> : <Navigate to="/login/"/>}/>
				<Route path="pong-powerup/" element={globalData.jsonMap.isLoggedIn ? <PongPowerup /> : <Navigate to="/login/"/>}/>
				<Route path="tournament/" element={globalData.jsonMap.isLoggedIn ? <Tournament /> : <Navigate to="/login/"/>}/>
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}
