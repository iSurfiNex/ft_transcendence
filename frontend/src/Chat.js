import list from './img/list.svg';
import bubble from './img/bubble.svg';
import close from './img/close.svg';
import send from './img/send.svg';
import { useState, useEffect} from 'react';
import './Chat.css';


function Chat() {
	const [isChecked, setIsChecked] = useState(true);

	const checkHandler = () => {
		setIsChecked(!isChecked)
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

	if (!mobile && isChecked) {
		setIsChecked(false);
		setMobileDefault(true);
	}
	if (!mobile && !isChecked && !mobileDefault) {
		setIsChecked(true)
		setMobileDefault(false);
	}
	if (mobile && !isChecked && mobileDefault) {
		setIsChecked(true)
		setMobileDefault(false);
	}

	return (
		<div class="Chat">
			<div class="chat-mobile">
				<div class="chat-bubble">
					<label class="btn btn-primary chat-bubble-label" for="btn-check">
						<input onChange={checkHandler} checked={isChecked} type="checkbox" class="btn-check chat-bubble-check" id="btn-check" autocomplete="off"/>
						<img class="chat-bubble-unchecked" src={bubble} alt="bubble"/>
						<img class="chat-bubble-checked" src={close} alt="close"/>
					</label>
				</div>
			</div>

			{!isChecked && (<div class="chat-desktop">
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
				<div class="channels-separator"></div>

				<form action="">
					<input placeholder="Ecrivez votre message ici" class="form-control chat-input"/>
					<label class="btn btn-primary chat-send" for="btn-check">
						<div class="chat-send-button">
							<input class="chat-send-img" alt="send" type="image" src={send} name="submit"/>
						</div>
					</label>
				</form>
				<div class="btn-group-toggle player-list" data-toggle="buttons">
					<label class="btn btn-secondary active player-list-label">
						<input type="checkbox" checked autocomplete="off" onClick=""/>
						<img class="player-list-unchecked" src={list} alt="list"/>
						<img class="player-list-checked" src={close} alt="close"/>
					</label>
				</div>
			</div>)}
		</div>
	);
}

function App() {
	return (
		<div class="App">
			<Chat />
		</div>
	);
}

export default App;
