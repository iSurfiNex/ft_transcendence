import { useContext } from 'react';
import message from '../../img/message.svg';
import plus from '../../img/plus.svg';
import block from '../../img/block.svg';
import GlobalContext from '../../index';

function ProfileTop() {
	const { globalData, updateGlobal } = useContext(GlobalContext);

	const user = globalData.jsonMap.users.find(user => user.nickname === globalData.jsonMap.whoAmI);

	return (
		<div className="profile-topbar">
			<div className="profile-topbar-picture">
				<img src={require(`../../${user?.picture}`)} alt="profile"/>
			</div>
			<div className="profile-topbar-fullname">
				<span className="profile-topbar-name">{user?.fullname}</span>
				<span className="profile-topbar-nickname">({user?.nickname})</span>
			</div>
			<div className="profile-topbar-button">
				<button className="profile-topbar-button-message btn btn-primary btn-lg" title="Send message"><img className="profile-topbar-img" src={message} alt="send message"></img></button>
				<button className="profile-topbar-button-invite btn btn-success btn-lg" title="Invite"><img className="profile-topbar-img" src={plus} alt="invite"></img></button>
				<button className="profile-topbar-button-block btn btn-danger btn-lg" title="Block"><img className="profile-topbar-img" src={block} alt="block"></img></button>
			</div>
		</div>
	);
}

export default ProfileTop;
