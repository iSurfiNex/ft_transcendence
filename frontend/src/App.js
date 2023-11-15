import { useLocation } from "react-router-dom"

import Chat from './Chat/Chat';
import Topbar from './Topbar';
import Layout from './Layout';
import Content from './Content';

export default function App() {
    const { pathname } = useLocation();

	return (
		<>
			{ pathname === "/login/" ? null : <Topbar />  }
			{ pathname === "/login/" ? null : <Layout />  }
			{ pathname === "/login/" ? null : <Chat />  }
			<Content />
		</>
	)
}
