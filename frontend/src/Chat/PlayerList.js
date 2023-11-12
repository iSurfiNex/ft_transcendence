import { useContext } from 'react';
import { Link } from "react-router-dom"
import GlobalContext from '../index';

import plus from '../img/plus.svg';
import message from '../img/message.svg';
import block from '../img/block.svg';

function PlayerList() {
	const { globalData, updateGlobal } = useContext(GlobalContext);

	return (
		<div className="chat-list-player">
			{globalData.jsonMap.users.map((user, index) => {

				return (
					<div key={index} className="chat-player">
						<Link className="chat-player-link" to="/profile">
								<img className="chat-player-img" src={require(`../${user?.picture}`)} alt="profile"/>
								<div className="chat-player-name">{user?.fullname || user.nickname}</div>
						</Link>
						<button className="chat-player-message btn btn-primary" title="Send message"><img className="chat-player-button-img" src={message} alt="send message"/></button>
						<button className="chat-player-invite btn btn-success" title="Invite"><img className="chat-player-button-img" src={plus} alt="invite"/></button>
						<button className="chat-player-block btn btn-danger" title="Block"><img className="chat-player-button-img" src={block} alt="block"/></button>
						<div className="chat-player-seperator"></div>
					</div>
				);
			})}
		</div>
	);
}

export default PlayerList;
