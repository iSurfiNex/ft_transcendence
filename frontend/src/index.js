import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom"

import App from './App';

const GlobalContext = createContext();

const defaultGlobal = {
	jsonMap: { // Temporary, this is to see the dynamic rendering
		users: [
			{ nickname: 'rsterin' , fullname: 'Remi Sterin', picture: 'img/list.svg' },
			{ nickname: 'fjullien' , fullname: 'Felix Jullien', picture: 'img/list.svg' },
			{ nickname: 'jtoulous' , fullname: 'Joshua Toulouse', picture: 'img/list.svg' },
			{ nickname: 'tlarraze' , fullname: 'Theo Larraze', picture: 'img/list.svg' },
		],
		whoAmI: '',
		isLoggedIn: false,
		channels: [
			{ name: 'Global'},
			{ name: 'rsterin'},
			{ name: 'fjullien'},
			{ name: 'jtoulous'},
			{ name: 'tlarraze'},
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
	},
};

const GlobalProvider = ({ children }) => {
	const [globalData, setGlobalData] = useState(defaultGlobal);

	const updateGlobal= (newGlobal) => {
		setGlobalData(newGlobal);
	};

	return (
		<GlobalContext.Provider value={{ globalData, updateGlobal }}>
			{children}
		</GlobalContext.Provider>
	);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<GlobalProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</GlobalProvider>
	</React.StrictMode>
);

export default GlobalContext;
