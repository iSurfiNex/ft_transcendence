import * as THREE from './node_modules/three/src/Three.js';
import  './node_modules/three/src/geometries/SphereGeometry.js';

		let i = 0.00;
		// Set up scene
		const scene = new THREE.Scene();

		// Set up camera
		const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
		camera.position.z = 600;

		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(800, 800);
		document.body.appendChild(renderer.domElement);
	
		const geometry_ligne = new THREE.BoxGeometry(800, 800, 1);
		const geometry_paddle = new THREE.BoxGeometry(1, 1, 2, 5, 5, 5); 
		const geometry_ball = new THREE.SphereGeometry(25, 6, 6); 
		const material_ball = new THREE.MeshBasicMaterial( {color: 0x000000} ); 
		const material_paddleL = new THREE.MeshBasicMaterial( {color: 0xb50202} ); 
		const material_paddleR = new THREE.MeshBasicMaterial( {color: 0x00fff7} ); 
		const material_ligne = new THREE.MeshBasicMaterial( {color: 0xFFFFFF,opacity:0.1} ); 
		const ligne = new THREE.Mesh( geometry_ligne, material_ligne); 
		const paddleL = new THREE.Mesh( geometry_paddle, material_paddleL ); 
		const paddleR = new THREE.Mesh( geometry_paddle, material_paddleR ); 
		const ball = new THREE.Mesh( geometry_ball, material_ball ); 
		paddleL.position.x = -290;
		paddleR.position.x = 290;
		ligne.position.x = 0;
		ligne.position.y = 0;
		scene.add(paddleL);
		scene.add(paddleR);
		scene.add(ball);
		scene.add(ligne);
		renderer.render(scene, camera);

		const animate = () => {
			requestAnimationFrame(animate);

			// // // Rotate the paddleL
			// paddleL.rotation.x += 0.01;
			// // paddleL.rotation.y += 0.01;

			// // paddleR.rotation.x += 0.01;
			// paddleR.rotation.y += 0.01;

			ball.rotation.x += 0.01;
			ball.rotation.y += 0.01;
			// Render the scene
			renderer.render(scene, camera);
		};
		var	up = -1;
		var	down = -1;
		var	w = -1;
		var	s = -1;
		document.addEventListener('keydown', function(event) {
			if (event.key == "ArrowUp" && up == -1)
			{
				up = 1
				send_json(event)
			}
			else if (event.key == "ArrowDown" && down == -1)
			{
				down = 1
				send_json(event)
			}
			else if (event.key == "w" && w == -1)
			{
				w = 1
				send_json(event)
			}
			else if (event.key == "s" && s == -1)
			{
				s = 1
				send_json(event)
			}
		});
		document.addEventListener('keyup', function(event) {
			console.log(event.key);
			if (event.key == "ArrowUp")
			{
				up = -1
				send_json(event)
			}
			else if (event.key == "ArrowDown")
			{
				down = -1
				send_json(event)
			}
			else if (event.key == "w")
			{
				w = -1
				send_json(event)
			}
			else if (event.key == "s")
			{
				s = -1
				send_json(event)
			}
		});
		function send_json(event){
			console.log(event.key);
			if (event.key != "s" && event.key != "w" && event.key != "t" && event.key != "ArrowUp" && event.key != "ArrowDown")
				return
			if (event.key == "f12")
				handleResize()
			if (event.key == "ArrowDown" || event.key == "ArrowUp")
			{
				var obj = {
					"key": event.key,
					"user": "Paddle Right"
			};
		}
			else
			{
				var obj = {
					"key": event.key,
					"user": "Paddle Left"	
				}
			};
			if (event.key) {
					socket.send(JSON.stringify(obj)); // Send the typed message to the server
			}
		}
		function handleResize(){
			const newWidth =  800;
			const newHeight = 800;

			// camera.aspect = newWidth / newHeight;
			// camera.updateProjectionMatrix();

			renderer.setSize(newWidth, newHeight);
		}
		window.addEventListener('resize', handleResize);

		// Declare a global variable for the WebSocket connection
		var socket = new WebSocket("ws://" + window.location.hostname + ":8080");

		// Function to create or ensure the WebSocket connection is open
		socket.onopen = (event) => {
			console.log("WebSocket connection opened");
		};
		socket.onmessage = (event) => {
		var jfile
		const message = event.data;
		jfile = JSON.parse(event.data)
		paddleR.position.y = jfile['paddleR']['y'];
		paddleR.scale.x = jfile["paddleR"]["sizeX"];
		paddleR.scale.y = jfile["paddleR"]["sizeY"];

		paddleL.scale.x = jfile["paddleL"]["sizeX"];
		paddleL.scale.y = jfile["paddleL"]["sizeY"];
		paddleL.position.y = jfile['paddleL']['y'];
		ball.position.x = jfile['ball']['x'];
		ball.position.y = -jfile['ball']['y'];
//		paddleR.position.z = jfile['position']['z'];
		renderer.render(scene, camera);

	}

		//console.log(jfile['msg'] + "from " + jfile['user']);
		socket.onclose = (event) => {
			const message = event.data;
			console.log("DED");
		};
		// Function to send a message to the server
//					const message = activeSocket.event.data;
//					console.log(`Received: ${message}`)		
animate()


