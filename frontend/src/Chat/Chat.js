import { useState, useContext } from 'react';
import { isMobile } from 'react-device-detect';
import { Link } from "react-router-dom"

import list from '../img/list.svg';
import bubble from '../img/bubble.svg';
import close from '../img/close.svg';
import send from '../img/send.svg';
import plus from '../img/plus.svg';
import message from '../img/message.svg';
import block from '../img/block.svg';

import './Chat.css';
import Channels from './Channels'

function Chat() {

	const [isBubbleChecked, setIsBubbleChecked] = useState(true);

	const bubbleCheckHandler = () => {
		setIsBubbleChecked(!isBubbleChecked);
	}

	const [isPlayerListChecked, setIsPlayerListChecked] = useState(true);

	const playerListCheckHandler = () => {
		setIsPlayerListChecked(!isPlayerListChecked);
	}

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

				<div className="messages">
					<div className="message">
						<Link to="/profile" className='test'>
							<img className="message-player-img" src={list} alt="profile"></img>
							<div className="message-player-name">teeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeest</div>
						</Link>
						<div className="message-player-date">18:05</div>
						<div className="message-player-content">Saqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlut a tous</div>
					</div>
					<div className="message">
						<Link to="/profile">
							<img className="message-player-img" src={list} alt="profile"></img>
							<div className="message-player-name">teeeeeeeeeeeeest</div>
						</Link>
						<div className="message-player-date">18:05</div>
						<div className="message-player-content">Saqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlut a tous</div>
					</div>
					<div className="message">
						<Link to="/profile">
							<img className="message-player-img" src={list} alt="profile"></img>
							<div className="message-player-name">teeeeeeeeeeeeest</div>
						</Link>
						<div className="message-player-date">18:05</div>
						<div className="message-player-content">Salut a tous</div>
					</div>
				</div>

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
					<div className="chat-list-player">
						<div className="chat-player">
							<Link className="chat-player-link" to="/profile">
								<img className="chat-player-img" src={list} alt="profile"></img>
								<div className="chat-player-name">teeeeeeeeeeeeeeeeeest</div>
							</Link>
							<button className="chat-player-message btn btn-primary" title="Send message"><img className="chat-player-button-img" src={message} alt="send message"></img></button>
							<button className="chat-player-invite btn btn-success" title="Invite"><img className="chat-player-button-img" src={plus} alt="invite"></img></button>
							<button className="chat-player-block btn btn-danger" title="Block"><img className="chat-player-button-img" src={block} alt="block"></img></button>
							<div className="chat-player-seperator"></div>
						</div>
						<div className="chat-player">
							<Link className="chat-player-link" to="/profile">
								<img className="chat-player-img" src={list} alt="profile"></img>
								<span className="chat-player-name">test</span>
							</Link>
							<button className="chat-player-message btn btn-primary" title="Send message"><img className="chat-player-button-img" src={message} alt="send message"></img></button>
							<button className="chat-player-invite btn btn-success" title="Invite"><img className="chat-player-button-img" src={plus} alt="invite"></img></button>
							<button className="chat-player-block btn btn-danger" title="Block"><img className="chat-player-button-img" src={block} alt="block"></img></button>
						</div>
					</div>
				</div>)}
			</div>)}
		</div>
	);
}

export default Chat;
