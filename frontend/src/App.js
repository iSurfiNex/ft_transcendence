import {setup} from "./pouic/state.js"

var state_base = {
	isMobile: (window.innerWidth < 768 || window.innerHeight < 524),
	isChatBubbleChecked: true,
	isPlayerListChecked: true,
	users: [
		{ nickname: 'rsterin' , fullname: 'Remi Sterin', picture: 'img/list.svg' },
		{ nickname: 'fjullien' , fullname: 'Felix Jullien', picture: 'img/list.svg' },
		{ nickname: 'jtoulous' , fullname: 'Joshua Toulouse', picture: 'img/list.svg' },
		{ nickname: 'tlarraze' , fullname: 'Theo Larraze', picture: 'img/list.svg' },
	],
	whoAmI: 'rsterin',
	isLoggedIn: true,
	channels: [
		{ name: 'Global', id: 1},
		{ name: 'rsterin', id: 2},
		{ name: 'fjullien', id: 3},
		{ name: 'jtoulous', id: 4},
		{ name: 'tlarraze', id: 5},
	],
	activeChannel: 'Global',
	messages: [
		{ text: 'Hello', sender: 'rsterin', date: '16:03', channel: 'fjullien' },
		{ text: 'Hi there', sender: 'fjullien', date: '17:04', channel: 'Global' },
		{ text: 'Greetings', sender: 'jtoulous', date: '18:05', channel: 'Global' },
		{ text: 'Greetings', sender: 'tlarraze', date: '19:06', channel: 'Global' },
	],
	games: [
		{ type: 'normal', id: '1', status: 'done', creator: 'fjullien', players: ['fjullien', 'tlarraze'], maxPlayer: '2'},
		{ type: 'normal', id: '2', status: 'waiting', creator: 'fjullien', players: ['fjullien'], maxPlayer: '2'},
		{ type: 'normal', id: '3', status: 'waiting', creator: 'fjullien', players: ['fjullien', 'tlarraze'], maxPlayer: '2'},
		{ type: 'normal', id: '4', status: 'running', creator: 'fjullien', players: ['fjullien', 'tlarraze'], maxPlayer: '2'},
		{ type: 'powerup', id: '5', status: 'done', creator: 'fjullien', players: ['fjullien', 'tlarraze'], maxPlayer: '2'},
		{ type: 'powerup', id: '6', status: 'waiting', creator: 'fjullien', players: ['fjullien'], maxPlayer: '2'},
		{ type: 'powerup', id: '7', status: 'waiting', creator: 'fjullien', players: ['fjullien', 'tlarraze'], maxPlayer: '2'},
		{ type: 'powerup', id: '8', status: 'running', creator: 'fjullien', players: ['fjullien', 'tlarraze'], maxPlayer: '2'},
		{ type: 'tournament', id: '9', status: 'done', creator: 'rsterin', players: ['rsterin', 'jtoulous', 'fjullien', 'tlarraze'], maxPlayer: '4'},
		{ type: 'tournament', id: '10', status: 'waiting', creator: 'rsterin', players: ['rsterin', 'jtoulous', 'fjullien', 'tlarraze'], maxPlayer: '4'},
		{ type: 'tournament', id: '11', status: 'running', creator: 'rsterin', players: ['rsterin', 'jtoulous', 'fjullien', 'tlarraze'], maxPlayer: '8'},
		{ type: 'tournament', id: '12', status: 'waiting', creator: 'rsterin', players: ['rsterin', 'jtoulous', 'fjullien', 'tlarraze'], maxPlayer: '6'},
	],
	currentGame: '-1',
}

const state = setup(state_base)

function checkScreenWidth() {
	state.isMobile = (window.innerWidth < 768 || window.innerHeight < 524);
}

window.addEventListener('resize', checkScreenWidth);
