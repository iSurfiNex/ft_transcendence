import logo from './img/block.svg';
import list from './img/list.svg';
import './Topbar.css';

function Topbar() {
	return (
		<div className="topbar">
			<div className="logo">
				<img src={logo} alt="logo"/>
			</div>

			<div className="notification">
				<div className="separator"></div>
			</div>

			<div className="profile-picture">
				<a className="profile-picture-div" href="/">
					<img src={list} alt="profile"/>
				</a>
			</div>
		</div>
	);
}

export default Topbar;
