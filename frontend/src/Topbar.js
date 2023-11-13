import { Link } from "react-router-dom"

import logo from './img/block.svg';
import list from './img/list.svg';
import './Topbar.css';

import { useContext } from 'react';
import GlobalContext from './index';

function Topbar() {
	const { globalData, updateGlobal } = useContext(GlobalContext);

	return (
		<div className="topbar">
			<Link to="/" className="logo">
				<img src={logo} alt="logo"/>
			</Link>
			<h1>{globalData.jsonMap.currentGame}</h1>
			<div className="notification">
				<div className="separator"></div>
			</div>

			<div className="profile-picture">
				<Link className="profile-picture-div" to="/profile/">
					<img src={list} alt="profile"/>
				</Link>
			</div>
		</div>
	);
}

export default Topbar;
