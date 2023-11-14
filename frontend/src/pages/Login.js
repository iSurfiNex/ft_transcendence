import React, { useEffect, useState } from "react";

export default function Login() {
	const queryParameters = new URLSearchParams(window.location.search)
	const type = queryParameters.get("code")

	const handleClick = () => {
		const apiUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-fe7d42984dd6575235bba558210f67f242c7853d17282449450969f21d6f9080&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin%2F&response_type=code';

		window.location.href = apiUrl
	}
	const [postData, setPostData] = useState({
		grant_type: 'authorization_code',
		client_id: 'u-s4t2ud-fe7d42984dd6575235bba558210f67f242c7853d17282449450969f21d6f9080',
		client_secret: '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',
		code: '{type}',
		redirect_uri: 'https://localhost:3000/login/',
	});

	const handlePostRequest = async () => {
		try {
			const response = await fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify(postData),
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
			console.log(data);
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error);
		}
	};

	return (
		<div>
			<button onClick={handleClick}>Connect</button>
			<button onClick={handlePostRequest}>PostRequest</button>
			<p>{type}</p>
		</div>
	);
}
