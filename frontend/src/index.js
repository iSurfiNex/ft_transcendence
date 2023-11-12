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
			{ nickname: 'rsterin' , fullname: 'Remi Sterin', picture: 'img/list.svg' },
			{ nickname: 'fjullien' , fullname: 'Felix Jullien', picture: 'img/list.svg' },
			{ nickname: 'jtoulous' , fullname: 'Joshua Toulouse', picture: 'img/list.svg' },
			{ nickname: 'tlarraze' , fullname: 'Theo Larraze', picture: 'img/list.svg' },
		],
		channels: [
			{ name: 'Global', picture: 'img/empty.svg' },
			{ name: 'rsterin', picture: 'img/list.svg' },
			{ name: 'fjullien', picture: 'img/list.svg' },
			{ name: 'jtoulous', picture: 'img/list.svg' },
			{ name: 'tlarraze', picture: 'img/list.svg' },
		],
		messages: [
			{ text: 'Hello', sender: 'rsterin', date: '16:03', channels: 'Global' },
			{ text: 'Hi there', sender: 'fjullien', date: '17:04', channels: 'Global' },
			{ text: 'Greetings', sender: 'jtoulous', date: '18:05', channels: 'Global' },
			{ text: 'Greetings', sender: 'tlarraze', date: '19:06', channels: 'Global' },
		],
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
