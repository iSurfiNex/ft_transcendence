import * as THREE from 'three';
import './node_modules/three/src/geometries/SphereGeometry.js';
import './node_modules/three/src/lights/Light.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';

	let i = 0.00;
	let ball;
	let paint_z = 1;
	let time = (new Date().getTime());
	
	// Set up scene
	const scene = new THREE.Scene();

	// Set up camera
	const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
	camera.position.set(0, 0, 600);

	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(800, 600);
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	document.body.appendChild(renderer.domElement);
	
	const light = new THREE.DirectionalLight(0xffffff, 1);
	const geometry_ligne = new THREE.BoxGeometry(2, 1000, 1);
	const geometry_paddle = new THREE.BoxGeometry(20, 100, 20, 5, 5, 5); 
	const material_paddleL = new THREE.MeshBasicMaterial( {color: 0xb50202} ); 
	const material_paddleR = new THREE.MeshBasicMaterial( {color: 0x00fff7} ); 
	const material_paint_L = new THREE.MeshBasicMaterial( {color: 0xb50202} ); 
	const material_paint_R = new THREE.MeshBasicMaterial( {color: 0x00fff7} ); 
	const material_ligne = new THREE.MeshBasicMaterial( {color: 0xffffff,opacity:0.1} );
	const ligne = new THREE.Mesh( geometry_ligne, material_ligne);
	const paddleL = new THREE.Mesh( geometry_paddle, material_paddleL ); 
	const paddleR = new THREE.Mesh( geometry_paddle, material_paddleR ); 
	const paint_geo = new THREE.CircleGeometry(15, 128);


	material_paddleL.depthTest = false;
	material_paddleR.depthTest = false;
	material_ligne.depthTest = false;

	paddleL.renderOrder = 2;
	paddleR.renderOrder = 1;
	ligne.renderOrder = 3;
		
	light.position.set(0, 0, 610);
	paddleL.position.set(-290, 0, 0);
	paddleR.position.set(290, 0, 0);
	ligne.position.set(0, 0, 0);
	ligne.position.set(0, 0, 0);

	// instantiate a loader
	const loader = new GLTFLoader();


// Load a glTF resource
	loader.load(
		'abstract_ball.glb',
		(gltf) => {
			ball = gltf.scene.children[0];
			if (ball) {
				ball.scale.multiplyScalar(16);
				ball.position.set(0, 0, 600);
				ball.renderOrder = 4;
				scene.add(ball);
			}
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		},
		(error) => {
			console.error('Error loading GLTF model', error);
		}
	);

	scene.add(paddleL);
	scene.add(paddleR);
	scene.add(ligne);
	scene.add(light);

renderer.render(scene, camera);

// load a resource
		const animate = () => {
			requestAnimationFrame(animate);
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
			const newHeight = 600;

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

		paddleR.position.set(390, jfile['paddleR']['y'], 0);
		//paddleR.position.y = jfile['paddleR']['y'];
		paddleL.position.set(-390, jfile['paddleL']['y'], 0);
		
		//paddleR.scale.set(jfile["paddleR"]["sizeX"], jfile["paddleR"]["sizeY"], 1);
		//paddleL.scale.set(jfile["paddleL"]["sizeX"], jfile["paddleL"]["sizeY"], 1);
		if (ball)
		{
			let actual_time = new Date();
			let paint;
			let	scale;

			if (ball.position.x != jfile["ball"]["x"] && actual_time.getTime() > time + 150)
			{
				scale = Math.random() * 100 % 1.5;
				time = actual_time.getTime();
				if (jfile["ball"]['color'] == 'l')
					paint = new THREE.Mesh( paint_geo, material_paint_L);
				if (jfile["ball"]['color'] == 'r' || ball.position.x > jfile['ball']['x'])
					paint = new THREE.Mesh( paint_geo, material_paint_R); 
				paint.position.x = ball.position.x + Math.round(Math.random() * 100 % 15);
				paint.position.y = ball.position.y + Math.round(Math.random() * 100 % 15);
				paint.position.z = paint_z;
				paint.scale.set(scale, scale, scale);
				paint_z += 0.01;
				//paint.scale(Math.round(Math.random() * 100 % 25) + 5, 128)
				paint.material.opacity = Math.random();
				scene.add(paint);
				console.log(scene.children.length)
			}
			actual_time = null;

			ball.position.set(jfile['ball']['x'], jfile['ball']['y'], 0);
			ball.rotation.x += 0.01;
			ball.rotation.y += 0.01;
		}

		renderer.render(scene, camera);

	}
		socket.onclose = (event) => {
			const message = event.data;
			console.log("DED");
		};w

animate();