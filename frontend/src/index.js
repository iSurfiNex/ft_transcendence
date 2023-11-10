import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom"

import Chat from './Chat';
import Topbar from './Topbar';
import Layout from './Layout';

import Content from './Content';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Topbar />
			<Layout />
			<Chat />
			<Content />
		</BrowserRouter>
	</React.StrictMode>
);
