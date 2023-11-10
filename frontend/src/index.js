import React from 'react';
import ReactDOM from 'react-dom/client';
import Chat from './Chat';
import Topbar from './Topbar';
import Layout from './Layout';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Topbar />
    <Layout />
    <Chat />
  </React.StrictMode>
);
