import { useContext } from 'react';
import GlobalContext from '../index';

function Channels() {
	const { globalData } = useContext(GlobalContext);

	let idCounter = 1;
	let isFirstElement = true;

	return (
		<div className="channels">
			{globalData.jsonMap.channels.map((channel, index) => {
				const uniqueId = `btnradio${idCounter++}`;

				const inputDefaultChecked = (
					<input type="radio" className="btn-check" name="btnradio" id={uniqueId} autoComplete="off" defaultChecked={isFirstElement}/>
				);
				isFirstElement = false;

				return (
					<div key={index} className="btn-group" role="group" aria-label="Basic radio toggle button group">
						{inputDefaultChecked}
						<label className="btn btn-secondary channels-bubble" htmlFor={uniqueId} style={{ backgroundImage: `url(${require(`../${channel.picture}`)})`, backgroundSize: 'cover' }}>{channel.name.charAt(0)}
							<div className ="channels-bubble-notif"></div>
						</label>
					</div>
				);
			})}
		</div>
	);
}

export default Channels;
