import { useContext } from 'react';
import GlobalContext from '../index';

function Channels() {
	const { globalData, updateGlobal } = useContext(GlobalContext);

	let idCounter = 1;

	const handleChannelChange = (channelName) => {
		const newGlobal = { ...globalData, jsonMap: { ...globalData.jsonMap, activeChannel: channelName } };
		updateGlobal(newGlobal);
	};

	return (
		<div className="channels">
			{globalData.jsonMap.channels.map((channel, index) => {
				const uniqueId = `btnradio${idCounter++}`;
				const channelUser = globalData.jsonMap.users.find(user => user.nickname === channel.name);
				console.log(channelUser);

				return (
					<div key={index} className="btn-group" role="group" aria-label="Basic radio toggle button group">
						<input type="radio" className="btn-check" name="btnradio" id={uniqueId} autoComplete="off" defaultChecked={channel.name === globalData.jsonMap.activeChannel} onChange={() => handleChannelChange(channel.name)}/>
						<label className="btn btn-secondary channels-bubble" htmlFor={uniqueId} style={channelUser ? { backgroundImage: `url(${require(`../${channelUser.picture}`)})`, backgroundSize: 'cover' } : {}}>{channel.name.charAt(0)}
							<div className ="channels-bubble-notif"></div>
						</label>
					</div>
				);
			})}
		</div>
	);
}

export default Channels;
