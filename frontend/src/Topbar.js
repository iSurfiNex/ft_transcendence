import { useContext } from 'react';
import { Link } from "react-router-dom"

import './Topbar.css';

import GlobalContext from './index';

function Topbar() {
	const { globalData, updateGlobal } = useContext(GlobalContext);

	const userAmI = globalData.jsonMap.users.find(user => user.nickname === globalData.jsonMap.whoAmI);

	return (
		<div className="topbar">
			<Link to="/" className="logo">
				<div className="logo-text">PONG</div>
			</Link>

			<div className="notification">
				<div className="separator"></div>
			</div>

			<div className="profile-picture">
				<Link className="profile-picture-div" to="/profile/">
					<img src={require(`./${userAmI?.picture}`)} alt="profile"/>
				</Link>
			</div>
		</div>
	);
}

export default Topbar;
