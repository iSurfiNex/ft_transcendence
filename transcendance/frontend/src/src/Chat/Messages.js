import { useContext } from 'react';
import { Link } from "react-router-dom"

import GlobalContext from '../index';

function Messages() {
	const { globalData } = useContext(GlobalContext);

	return (
		<div className="messages">
			{globalData.jsonMap.messages.filter(message => message.channel === globalData.jsonMap.activeChannel).reverse().map((message, index) => {
				const senderUser = globalData.jsonMap.users.find(user => user.nickname === message.sender);

				return (
					<div key={index} className="message">
						<Link to="/profile/" className='test'>
							<img className="message-player-img" src={require(`../${senderUser?.picture}`)} alt="profile"/>
							<div className="message-player-name">{senderUser?.fullname || message.sender}</div>
						</Link>
						<div className="message-player-date">{message.date}</div>
						<div className="message-player-content">{message.text}</div>
					</div>
				);
			})}
		</div>
	);
}

export default Messages;
