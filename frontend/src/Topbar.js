import { useContext } from 'react';
import { Link } from "react-router-dom"

import close from './img/close-white.svg';
import plus from './img/plus.svg';

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

			<div className="notifications">
				<div className="toast-container position-relative notifications-container">
					<div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
						<div className="toast-body">
							Hello, world! This is a toast message.
							<div className="mt-2 pt-2 border-top">
								<button type="button" className="btn btn-primary btn-sm">Take action</button>
								<button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="toast">Close</button>
								</div>
						</div>
					</div>
					<div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
						<div className="toast-body">
							Hello, world! This is a toast message.
							<div className="mt-2 pt-2 border-top">
								<button type="button" className="btn btn-primary btn-sm">Take action</button>
								<button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="toast">Close</button>
								</div>
						</div>
					</div>
					<div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
						<div className="toast-body">
							Hello, world! This is a toast message.
							<div className="mt-2 pt-2 border-top">
								<button type="button" className="btn btn-primary btn-sm">Take action</button>
								<button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="toast">Close</button>
								</div>
						</div>
					</div>
					<div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
						<div className="toast-body">
							Hello, world! This is a toast message.
							<div className="mt-2 pt-2 border-top">
								<button type="button" className="btn btn-primary btn-sm">Take action</button>
								<button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="toast">Close</button>
								</div>
						</div>
					</div>
					<div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
						<div className="toast-body">
							Hello, world! This is a toast message.
							<div className="mt-2 pt-2 border-top">
								<button type="button" className="btn btn-primary btn-sm">Take action</button>
								<button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="toast">Close</button>
								</div>
						</div>
					</div>
					<div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
						<div className="toast-body">
							Hello, world! This is a toast message.
							<div className="mt-2 pt-2 border-top">
								<button type="button" className="btn btn-primary btn-sm">Take action</button>
								<button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="toast">Close</button>
								</div>
						</div>
					</div>
					<div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
						<div className="toast-body">
							Hello, world! This is a toast message.
							<div className="mt-2 pt-2 border-top">
								<button type="button" className="btn btn-primary btn-sm">Take action</button>
								<button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="toast">Close</button>
								</div>
						</div>
					</div>
				</div>
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
