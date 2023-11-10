import { Link } from "react-router-dom"

import logo from './img/block.svg';
import list from './img/list.svg';
import './Topbar.css';

function Topbar() {
	return (
		<div className="topbar">
			<Link to="/" className="logo">
				<img src={logo} alt="logo"/>
			</Link>

			<div className="notification">
				<div className="separator"></div>
			</div>

			<div className="profile-picture">
				<Link className="profile-picture-div" to="/profile">
					<img src={list} alt="profile"/>
				</Link>
			</div>
		</div>
	);
}

export default Topbar;
