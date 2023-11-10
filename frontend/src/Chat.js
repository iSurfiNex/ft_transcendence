import list from './img/list.svg';
import bubble from './img/bubble.svg';
import close from './img/close.svg';
import send from './img/send.svg';
import plus from './img/plus.svg';
import message from './img/message.svg';
import block from './img/block.svg';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import './Chat.css';


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
		<div className="Chat">
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
				<div className="channels">
					<div className="btn-group" role="group" aria-label="Basic radio toggle button group">
						<input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked/>
						<label className="btn btn-secondary channels-bubble" htmlFor="btnradio1">G
							<div className ="channels-bubble-notif"></div>
						</label>

						<input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off"/>
						<label className="btn btn-secondary channels-bubble" htmlFor="btnradio2">T
							<div className ="channels-bubble-notif active">1</div>
						</label>

						<input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off"/>
						<label className="btn btn-secondary channels-bubble" htmlFor="btnradio3">
							<div className ="channels-bubble-notif"></div>
						</label>

						<input type="radio" className="btn-check" name="btnradio" id="btnradio4" autoComplete="off"/>
						<label className="btn btn-secondary channels-bubble" htmlFor="btnradio4">
							<div className ="channels-bubble-notif active">4</div>
						</label>

						<input type="radio" className="btn-check" name="btnradio" id="btnradio5" autoComplete="off"/>
						<label className="btn btn-secondary channels-bubble" htmlFor="btnradio5">
							<div className ="channels-bubble-notif active">1</div>
						</label>

						<input type="radio" className="btn-check" name="btnradio" id="btnradio6" autoComplete="off"/>
						<label className="btn btn-secondary channels-bubble" htmlFor="btnradio6">
							<div className ="channels-bubble-notif active">+9</div>
						</label>

						<input type="radio" className="btn-check" name="btnradio" id="btnradio7" autoComplete="off"/>
						<label className="btn btn-secondary channels-bubble" htmlFor="btnradio7">
							<div className ="channels-bubble-notif"></div>
						</label>
					</div>
				</div>

				<div className="messages">
					<div className="message">
						<a href="/">
							<img className="message-player-img" src={list} alt="profile"></img>
							<div className="message-player-date">18:05</div>
						</a>
						<div className="message-player-name">teeeeeeeeeeeeest</div>
						<div className="message-player-content">Saqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlut a tous</div>
					</div>
					<div className="message">
						<a href="/">
							<img className="message-player-img" src={list} alt="profile"></img>
							<div className="message-player-date">18:05</div>
						</a>
						<div className="message-player-name">teeeeeeeeeeeeest</div>
						<div className="message-player-content">Saqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlut a tous</div>
					</div>
					<div className="message">
						<a href="/">
							<img className="message-player-img" src={list} alt="profile"></img>
							<div className="message-player-name">teeeeeeeeeeeeest</div>
						</a>
						<div className="message-player-date">18:05</div>
						<div className="message-player-content">Salut a tous</div>
					</div>
				</div>

				<div className="bottom-bar">
					<input placeholder="Ecrivez votre message ici" className="htmlForm-control chat-input"/>
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
							<a className="chat-player-link" href="/">
								<img className="chat-player-img" src={list} alt="profile"></img>
								<div className="chat-player-name">teeeeeeeeeeeeeeeeeest</div>
							</a>
							<button className="chat-player-message btn btn-primary"><img className="chat-player-button-img" src={message} alt="send message"></img></button>
							<button className="chat-player-invite btn btn-success"><img className="chat-player-button-img" src={plus} alt="invite"></img></button>
							<button className="chat-player-block btn btn-danger"><img className="chat-player-button-img" src={block} alt="block"></img></button>
							<div className="chat-player-seperator"></div>
						</div>
						<div className="chat-player">
							<a className="chat-player-link" href="/">
								<img className="chat-player-img" src={list} alt="profile"></img>
								<span className="chat-player-name">test</span>
							</a>
							<button className="chat-player-message btn btn-primary"><img className="chat-player-button-img" src={message} alt="send message"></img></button>
							<button className="chat-player-invite btn btn-success"><img className="chat-player-button-img" src={plus} alt="invite"></img></button>
							<button className="chat-player-block btn btn-danger"><img className="chat-player-button-img" src={block} alt="block"></img></button>
						</div>
					</div>
				</div>)}
			</div>)}
		</div>
	);
}

export default Chat;
