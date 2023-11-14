import { useState, useEffect } from 'react';

import list from '../img/list.svg';
import bubble from '../img/bubble.svg';
import close from '../img/close.svg';
import send from '../img/send.svg';

import './Chat.css';
import Channels from './Channels'
import Messages from './Messages'
import PlayerList from './PlayerList'

function Chat() {
	const [isBubbleChecked, setIsBubbleChecked] = useState(true);
	const bubbleCheckHandler = () => {
		setIsBubbleChecked(!isBubbleChecked);
	}

	const [isPlayerListChecked, setIsPlayerListChecked] = useState(true);
	const playerListCheckHandler = () => {
		setIsPlayerListChecked(!isPlayerListChecked);
	}

	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768 || window.innerHeight < 768);
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div className="chat">
			<div className="chat-mobile">
				<div className="chat-bubble">
					<label className="btn btn-primary chat-bubble-label" htmlFor="btn-check">
						<input onChange={bubbleCheckHandler} checked={isBubbleChecked} type="checkbox" className="btn-check chat-bubble-check" id="btn-check" autoComplete="off"/>
						<img className="chat-bubble-unchecked" src={bubble} alt="bubble"/>
						<img className="chat-bubble-checked" src={close} alt="close"/>
					</label>
				</div>
			</div>

			{(!isBubbleChecked || !isMobile) && (<div className="chat-desktop">
				<Channels />
				<Messages />

				<div className="bottom-bar">
					<input placeholder="Ecrivez votre message ici" className="chat-input"/>
					<label className="btn btn-primary chat-send" htmlFor="btn-check">
						<div className="chat-send-button">
							<input className="chat-send-img" alt="send" type="image" src={send} name="submit"/>
						</div>
					</label>
					<div className="player-list">
						<label className="btn btn-primary player-list-label" htmlFor="btn-check-list">
							<input className="btn-check player-list-input" onChange={playerListCheckHandler} checked={isPlayerListChecked} type="checkbox" id="btn-check-list" autoComplete="off"/>
							<img className="player-list-unchecked" src={list} alt="list"/>
							<img className="player-list-checked" src={close} alt="close"/>
						</label>
					</div>
				</div>

				{!isPlayerListChecked && (<div className="chat-player-list">
					<span className="chat-player-list-header-text">Player list</span>
					<PlayerList />
				</div>)}
			</div>)}
		</div>
	);
}

export default Chat;
