import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom"

import Chat from './Chat/Chat';
import Topbar from './Topbar';
import Layout from './Layout';

import Content from './Content';

const GlobalContext = createContext();

const defaultGlobal = {
	jsonMap: {
		users: [
			{ nickname: 'rsterin' , fullname: 'Remi Sterin', picture: 'img/list.svg' }, // Temporary, this is to see the dynamic rendering
			{ nickname: 'fjullien' , fullname: 'Felix Jullien', picture: 'img/list.svg' }, // Temporary, this is to see the dynamic rendering
			{ nickname: 'jtoulous' , fullname: 'Joshua Toulouse', picture: 'img/list.svg' }, // Temporary, this is to see the dynamic rendering
			{ nickname: 'tlarraze' , fullname: 'Theo Larraze', picture: 'img/list.svg' }, // Temporary, this is to see the dynamic rendering
		],
		whoAmI: 'rsterin',
		channels: [
			{ name: 'Global', picture: '' },
			{ name: 'rsterin', picture: 'img/list.svg' }, // Temporary, this is to see the dynamic rendering
			{ name: 'fjullien', picture: 'img/list.svg' }, // Temporary, this is to see the dynamic rendering
			{ name: 'jtoulous', picture: 'img/list.svg' }, // Temporary, this is to see the dynamic rendering
			{ name: 'tlarraze', picture: 'img/list.svg' }, // Temporary, this is to see the dynamic rendering
		],
		activeChannel: 'Global',
		messages: [
			{ text: 'Hello', sender: 'rsterin', date: '16:03', channel: 'fjullien' }, // Temporary, this is to see the dynamic rendering
			{ text: 'Hi there', sender: 'fjullien', date: '17:04', channel: 'Global' }, // Temporary, this is to see the dynamic rendering
			{ text: 'Greetings', sender: 'jtoulous', date: '18:05', channel: 'Global' }, // Temporary, this is to see the dynamic rendering
			{ text: 'Greetings', sender: 'tlarraze', date: '19:06', channel: 'Global' }, // Temporary, this is to see the dynamic rendering
		],
		Games: [
			{ type: 'normal', id: '1', creator: 'rsterin', },
			{ type: 'othergame', id: '2', creator: 'fjullien', },
		],
		Tournament: [
			{ type: 'tournament', id: '1', creator: 'rsterin', players: ['rsterin', 'jtoulous', 'fjullien', 'tlarraze']},
		],
		currentGame: { type: 'normal', id: '3'},
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
				<Topbar />
				<Layout />
				<Chat />
				<Content />
			</BrowserRouter>
		</GlobalProvider>
	</React.StrictMode>
);

export default GlobalContext;
