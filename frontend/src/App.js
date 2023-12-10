import {setup} from "./pouic/state.js"

var state_base = {
	isMobile: (window.innerWidth < 768 || window.innerHeight < 524),
	isChatBubbleChecked: true,
	isPlayerListChecked: true,
	users: [
		{ nickname: 'rsterin' , fullname: 'Remi Sterin', picture: 'img/list.svg' },
		{ nickname: 'fjullien' , fullname: 'Felix Jullien', picture: 'img/list.svg' },
		{ nickname: 'jtoulous' , fullname: 'Joshua Toulouse', picture: 'img/mia.svg' },
		{ nickname: 'tlarraze' , fullname: 'Theo Larraze', picture: 'img/list.svg' },
	],
	whoAmI: 'rsterin',
	isLoggedIn: true,
	profiles: [
		{ name: 'rsterin', win: 8, lose: 64, ballHit: 32, goal: 8, tournamentWin: 2 },
		{ name: 'fjullien', win: 16, lose: 32, ballHit: 64, goal: 16, tournamentWin: 20 },
		{ name: 'jtoulous', win: 32, lose: 16, ballHit: 128, goal: 32, tournamentWin: 200 },
		{ name: 'tlarraze', win: 64, lose: 8, ballHit: 512, goal: 64, tournamentWin: 2000 },
	],
	profileLooking: 'rsterin',
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
		{ type: 'normal', id: 1, status: 'done', creator: 'rsterin', players: ['rsterin', 'tlarraze'], maxPlayer: '2', score: [{ name: 'rsterin', points: 2 }, { name: 'tlarraze', points: 3 }], date: '11/11/2023 04:38' },
		{ type: 'normal', id: 2, status: 'waiting', creator: 'fjullien', players: ['fjullien'], maxPlayer: '2', score: [], date: '' },
		{ type: 'normal', id: 3, status: 'waiting', creator: 'jtoulous', players: ['jtoulous', 'rsterin'], maxPlayer: '2', score: [], date: '' },
		{ type: 'normal', id: 4, status: 'running', creator: 'fjullien', players: ['fjullien', 'tlarraze'], maxPlayer: '2', score: [{ name: 'fjullien', points: 2 }, { name: 'tlarraze', points: 3 }], date: '11/11/2023 04:38' },

		{ type: 'powerup', id: 5, status: 'done', creator: 'fjullien', players: ['fjullien', 'rsterin'], maxPlayer: '2', score: [{ name: 'fjullien', points: 2 }, { name: 'rsterin', points: 3 }], date: '11/11/2023 04:38' },
		{ type: 'powerup', id: 6, status: 'waiting', creator: 'jtoulous', players: ['jtoulous'], maxPlayer: '2', score: [], date: '' },
		{ type: 'powerup', id: 7, status: 'waiting', creator: 'fjullien', players: ['fjullien', 'tlarraze'], maxPlayer: '2', score: [], date: '' },
		{ type: 'powerup', id: 8, status: 'running', creator: 'fjullien', players: ['fjullien', 'rsterin'], maxPlayer: '2', score: [{ name: 'fjullien', points: 2 }, { name: 'rsterin', points: 3 }], date: '11/11/2023 04:38' },

		{ type: 'tournament', id: 9, status: 'running', creator: 'rsterin', players: ['rsterin', 'jtoulous', 'fjullien', 'tlarraze'], maxPlayer: '4', gamesId: [10, 11, 12], date: '11/11/2023 04:38', countdown: 5},
		{ type: 'normal', id: 10, status: 'done', creator: 'tournament', players: ['rsterin', 'jtoulous'], maxPlayer: '2', score: [{ name: 'rsterin', points: 2 }, { name: 'jtoulous', points: 3 }], date: '11/11/2023 04:38'},
		{ type: 'normal', id: 11, status: 'done', creator: 'tournament', players: ['fjullien', 'tlarraze'], maxPlayer: '2', score: [{ name: 'fjullien', points: 2 }, { name: 'tlarraze', points: 3 }], date: '11/11/2023 04:38' },
		{ type: 'normal', id: 12, status: 'done', creator: 'tournament', players: ['jtoulous', 'tlarraze'], maxPlayer: '2', score: [{ name: 'jtoulous', points: 2 }, { name: 'tlarraze', points: 3 }], date: '11/11/2023 04:38' },

		{ type: 'tournament', id: 13, status: 'running', creator: 'jtoulous', players: ['rsterin', 'jtoulous', 'fjullien', 'tlarraze'], maxPlayer: '8', gamesId: [14, 15, 16], date: '11/11/2023 04:38' },
		{ type: 'normal', id: 14, status: 'done', creator: 'tournament', players: ['rsterin', 'jtoulous'], maxPlayer: '2', score: [{ name: 'rsterin', points: 2 }, { name: 'jtoulous', points: 3 }], date: '11/11/2023 04:38' },
		{ type: 'normal', id: 15, status: 'done', creator: 'tournament', players: ['fjullien', 'tlarraze'], maxPlayer: '2', score: [{ name: 'fjullien', points: 2 }, { name: 'tlarraze', points: 3 }], date: '11/11/2023 04:38' },
		{ type: 'normal', id: 16, status: 'running', creator: 'tournament', players: ['jtoulous', 'tlarraze'], maxPlayer: '2', score: [{ name: 'jtoulous', points: 2 }, { name: 'tlarraze', points: 3 }], date: '11/11/2023 04:38' },

		{ type: 'tournament', id: 10, status: 'waiting', creator: 'rsterin', players: ['rsterin', 'jtoulous', 'fjullien', 'tlarraze'], maxPlayer: '4', gamesId: [], date: '' },
		{ type: 'tournament', id: 12, status: 'waiting', creator: 'tlarraze', players: ['rsterin', 'jtoulous', 'fjullien', 'tlarraze'], maxPlayer: '6', gamesId: [], date: '' },
	],
	currentGame: 9,
}

const state = setup(state_base)

function checkScreenWidth() {
	state.isMobile = (window.innerWidth < 768 || window.innerHeight < 524);
}

window.addEventListener('resize', checkScreenWidth);
