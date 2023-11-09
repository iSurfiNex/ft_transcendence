import list from './img/list.svg';
import bubble from './img/bubble.svg';
import close from './img/close.svg';
import send from './img/send.svg';
import { useState, useEffect} from 'react';
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


	const [mobile, setMobile] = useState(window.innerWidth <= 500);

	const handleWindowSizeChange = () => {
		setMobile(window.innerWidth <= 500);
	}

	useEffect(() => {
		window.addEventListener('resize', handleWindowSizeChange);
		return () => {
			window.removeEventListener('resize', handleWindowSizeChange);
		}
	}, []);


	const [mobileDefault, setMobileDefault] = useState(true);

	if (!mobile && isBubbleChecked) {
		setIsBubbleChecked(false);
		setMobileDefault(true);
	}
	if (!mobile && !isBubbleChecked && !mobileDefault) {
		setIsBubbleChecked(true);
		setMobileDefault(false);
	}
	if (mobile && !isBubbleChecked && mobileDefault) {
		setIsBubbleChecked(true);
		setMobileDefault(false);
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

			{!isBubbleChecked && (<div class="chat-desktop">
				<div class="channels">
					<div class="btn-group btn-group-toggle" data-toggle="buttons">
						<label class="btn btn-secondary channels-bubble active">
							<input type="radio" name="options" id="option1" autocomplete="off" checked/>G
						</label>
						<label class="btn btn-secondary channels-bubble">
							<input type="radio" name="options" id="option2" autocomplete="off"/>T
						</label>
						<label class="btn btn-secondary channels-bubble">
							<input type="radio" name="options" id="option2" autocomplete="off"/>
						</label>
						<label class="btn btn-secondary channels-bubble">
							<input type="radio" name="options" id="option2" autocomplete="off"/>
						</label>
						<label class="btn btn-secondary channels-bubble">
							<input type="radio" name="options" id="option2" autocomplete="off"/>
						</label>
						<label class="btn btn-secondary channels-bubble">
							<input type="radio" name="options" id="option2" autocomplete="off"/>
						</label>
						<label class="btn btn-secondary channels-bubble">
							<input type="radio" name="options" id="option2" autocomplete="off"/>
						</label>
						<label class="btn btn-secondary channels-bubble">
							<input type="radio" name="options" id="option2" autocomplete="off"/>
						</label>
					</div>
				</div>

				<div class="messages">
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-date">18:05</div>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-content">Saqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-date">18:05</div>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-content">Saqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
						<div class="message-player-date">18:05</div>
						<div class="message-player-content">Salut a tous</div>
					</div>
					<div class="message">
						<img class="message-player-img" src={list} alt="profile"></img>
						<div class="message-player-name">teeeeeeeeeeeeest</div>
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
								<div class="chat-player-name">teeeeeeeeeeeeest</div>
							</a>
							<button class="chat-player-invite btn btn-success btn-sm">Inviter</button>
							<button class="chat-player-block btn btn-danger btn-sm">Bloquer</button>
							<div class="chat-player-seperator"></div>
						</div>
						<div class="chat-player">
							<a class="chat-player-link" href="/">
								<img class="chat-player-img" src={list} alt="profile"></img>
								<span class="chat-player-name">test</span>
							</a>
							<button class="chat-player-invite btn btn-success btn-sm">Inviter</button>
							<button class="chat-player-block btn btn-danger btn-sm">Bloquer</button>
						</div>
						<div class="chat-player">
							<a class="chat-player-link" href="/">
								<img class="chat-player-img" src={list} alt="profile"></img>
								<span class="chat-player-name">test</span>
							</a>
							<button class="chat-player-invite btn btn-success btn-sm">Inviter</button>
							<button class="chat-player-block btn btn-danger btn-sm">Bloquer</button>
						</div>
						<div class="chat-player">
							<a class="chat-player-link" href="/">
								<img class="chat-player-img" src={list} alt="profile"></img>
								<span class="chat-player-name">test</span>
							</a>
							<button class="chat-player-invite btn btn-success btn-sm">Inviter</button>
							<button class="chat-player-block btn btn-danger btn-sm">Bloquer</button>
						</div>
						<div class="chat-player">
							<a class="chat-player-link" href="/">
								<img class="chat-player-img" src={list} alt="profile"></img>
								<span class="chat-player-name">test</span>
							</a>
							<button class="chat-player-invite btn btn-success btn-sm">Inviter</button>
							<button class="chat-player-block btn btn-danger btn-sm">Bloquer</button>
						</div>
						<div class="chat-player">
							<a class="chat-player-link" href="/">
								<img class="chat-player-img" src={list} alt="profile"></img>
								<span class="chat-player-name">test</span>
							</a>
							<button class="chat-player-invite btn btn-success btn-sm">Inviter</button>
							<button class="chat-player-block btn btn-danger btn-sm">Bloquer</button>
						</div>
						<div class="chat-player">
							<a class="chat-player-link" href="/">
								<img class="chat-player-img" src={list} alt="profile"></img>
								<span class="chat-player-name">test</span>
							</a>
							<button class="chat-player-invite btn btn-success btn-sm">Inviter</button>
							<button class="chat-player-block btn btn-danger btn-sm">Bloquer</button>
						</div>
						<div class="chat-player">
							<a class="chat-player-link" href="/">
								<img class="chat-player-img" src={list} alt="profile"></img>
								<span class="chat-player-name">test</span>
							</a>
							<button class="chat-player-invite btn btn-success btn-sm">Inviter</button>
							<button class="chat-player-block btn btn-danger btn-sm">Bloquer</button>
						</div>
						<div class="chat-player">
							<a class="chat-player-link" href="/">
								<img class="chat-player-img" src={list} alt="profile"></img>
								<span class="chat-player-name">test</span>
							</a>
							<button class="chat-player-invite btn btn-success btn-sm">Inviter</button>
							<button class="chat-player-block btn btn-danger btn-sm">Bloquer</button>
						</div>
						<div class="chat-player">
							<a class="chat-player-link" href="/">
								<img class="chat-player-img" src={list} alt="profile"></img>
								<span class="chat-player-name">test</span>
							</a>
							<button class="chat-player-invite btn btn-success btn-sm">Inviter</button>
							<button class="chat-player-block btn btn-danger btn-sm">Bloquer</button>
						</div>
					</div>
				</div>)}
			</div>)}
		</div>
	);
}

export default Chat;
