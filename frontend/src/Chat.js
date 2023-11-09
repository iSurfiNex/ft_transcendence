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
		<div class="Chat">
			<div class="chat-mobile">
				<div class="chat-bubble">
					<label class="btn btn-primary chat-bubble-label" for="btn-check">
						<input onChange={bubbleCheckHandler} checked={isBubbleChecked} type="checkbox" class="btn-check chat-bubble-check" id="btn-check" autocomplete="off"/>
						<img class="chat-bubble-unchecked" src={bubble} alt="bubble"/>
						<img class="chat-bubble-checked" src={close} alt="close"/>
					</label>
				</div>
			</div>

			{(!isBubbleChecked || !isMobile) && (<div class="chat-desktop">
				<div class="channels">
					<div class="btn-group" role="group" aria-label="Basic radio toggle button group">
						<input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" defaultChecked/>
						<label class="btn btn-secondary channels-bubble" for="btnradio1">G
							<div class ="channels-bubble-notif"></div>
						</label>

						<input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off"/>
						<label class="btn btn-secondary channels-bubble" for="btnradio2">T
							<div class ="channels-bubble-notif active">1</div>
						</label>

						<input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off"/>
						<label class="btn btn-secondary channels-bubble" for="btnradio3">
							<div class ="channels-bubble-notif"></div>
						</label>

						<input type="radio" class="btn-check" name="btnradio" id="btnradio4" autocomplete="off"/>
						<label class="btn btn-secondary channels-bubble" for="btnradio4">
							<div class ="channels-bubble-notif active">4</div>
						</label>

						<input type="radio" class="btn-check" name="btnradio" id="btnradio5" autocomplete="off"/>
						<label class="btn btn-secondary channels-bubble" for="btnradio5">
							<div class ="channels-bubble-notif active">1</div>
						</label>

						<input type="radio" class="btn-check" name="btnradio" id="btnradio6" autocomplete="off"/>
						<label class="btn btn-secondary channels-bubble" for="btnradio6">
							<div class ="channels-bubble-notif active">+9</div>
						</label>

						<input type="radio" class="btn-check" name="btnradio" id="btnradio7" autocomplete="off"/>
						<label class="btn btn-secondary channels-bubble" for="btnradio7">
							<div class ="channels-bubble-notif"></div>
						</label>
					</div>
				</div>

				<div class="messages">
					<div class="message">
						<a href="/">
							<img class="message-player-img" src={list} alt="profile"></img>
							<div class="message-player-date">18:05</div>
						</a>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-content">Saqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlut a tous</div>
					</div>
					<div class="message">
						<a href="/">
							<img class="message-player-img" src={list} alt="profile"></img>
							<div class="message-player-date">18:05</div>
						</a>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-content">Saqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlut a tous</div>
					</div>
					<div class="message">
						<a href="/">
							<img class="message-player-img" src={list} alt="profile"></img>
							<div class="message-player-name">teeeeeeeeeeeeest</div>
						</a>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
				</div>

				<div class="bottom-bar">
					<input placeholder="Ecrivez votre message ici" class="form-control chat-input"/>
					<label class="btn btn-primary chat-send" for="btn-check">
						<div class="chat-send-button">
							<input class="chat-send-img" alt="send" type="image" src={send} name="submit"/>
						</div>
					</label>
					<div class="player-list">
						<label class="btn btn-primary player-list-label" for="btn-check-list">
							<input class="btn-check player-list-input" onChange={playerListCheckHandler} checked={isPlayerListChecked} type="checkbox" id="btn-check-list" autocomplete="off"/>
							<img class="player-list-unchecked" src={list} alt="list"/>
							<img class="player-list-checked" src={close} alt="close"/>
						</label>
					</div>
				</div>

				{!isPlayerListChecked && (<div class="chat-player-list">
					<span class="chat-player-list-header-text">Player list</span>
					<div class="chat-list-player">
						<div class="chat-player">
							<a class="chat-player-link" href="/">
								<img class="chat-player-img" src={list} alt="profile"></img>
								<div class="chat-player-name">teeeeeeeeeeeeeeeeeest</div>
							</a>
							<button class="chat-player-message btn btn-primary"><img class="chat-player-button-img" src={message} alt="send message"></img></button>
							<button class="chat-player-invite btn btn-success"><img class="chat-player-button-img" src={plus} alt="invite"></img></button>
							<button class="chat-player-block btn btn-danger"><img class="chat-player-button-img" src={block} alt="block"></img></button>
							<div class="chat-player-seperator"></div>
						</div>
						<div class="chat-player">
							<a class="chat-player-link" href="/">
								<img class="chat-player-img" src={list} alt="profile"></img>
								<span class="chat-player-name">test</span>
							</a>
							<button class="chat-player-message btn btn-primary"><img class="chat-player-button-img" src={message} alt="send message"></img></button>
							<button class="chat-player-invite btn btn-success"><img class="chat-player-button-img" src={plus} alt="invite"></img></button>
							<button class="chat-player-block btn btn-danger"><img class="chat-player-button-img" src={block} alt="block"></img></button>
						</div>
					</div>
				</div>)}
			</div>)}
		</div>
	);
}

export default Chat;
