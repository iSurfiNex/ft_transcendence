import * as THREE from 'three';
//import * as TEXT from './node_modules/three-text2d'
import * as UNIFORMS from '/uniforms.js';
import './node_modules/three/src/geometries/SphereGeometry.js';
import './node_modules/three/src/lights/Light.js';
import './node_modules/three/src/materials/ShaderMaterial.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
//import	'./node_modules/three-text2d/src/index.js'
//import { MeshText2D, textAlign } from './node_modules/three-text2d/dist/three-text2d.js';
//////////////si on part sur un match avec un temps definis, se serai cool d'avoir une prolongation en cas d'egaliter et de mettre la ball couleur gold ?
	let paint_z = 0;
	let ball;
	let bonus;
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
	
//	const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//	const textMesh = new  TEXT.MeshText2D();
//	scene.add(textMesh);
	console.log("Three js version is r"+ THREE.REVISION);

	const light = new THREE.DirectionalLight(0xffffff, 10);
	const geometry_line = new THREE.BoxGeometry(2, 1000, 1);
	const geometry_paddle = new THREE.BoxGeometry(10, 150, 20, 5, 5, 5); 
	const material_paddleL = new THREE.MeshBasicMaterial( {color: 0xb50202} ); 
	const material_paddleR = new THREE.MeshBasicMaterial( {color: 0x00fff7} ); 
	const material_paint_L = new THREE.MeshBasicMaterial( {color: 0xb50202} ); 
	const material_paint_R = new THREE.MeshBasicMaterial( {color: 0x00fff7} ); 
	const material_line = new THREE.MeshBasicMaterial( {color: 0xffffff,opacity:0.1} );
	const line = new THREE.Mesh( geometry_line, material_line);
	const paddleL = new THREE.Mesh( geometry_paddle, UNIFORMS.uniform_red ); 
	const paddleR = new THREE.Mesh( geometry_paddle, UNIFORMS.uniform_blue ); 
	const paint_geo = new THREE.CircleGeometry(15, 128);


	material_paint_L.depthTest = false;
	material_paint_R.depthTest = false;
	material_paddleL.depthTest = false;
	material_paddleR.depthTest = false;
	material_line.depthTest = false;

	paddleL.renderOrder = 5002;
	paddleR.renderOrder = 5001;
	line.renderOrder = 5003;
		
	light.position.set(0, 0, 610);
	paddleL.position.set(-290, 0, 0);
	paddleR.position.set(290, 0, 0);
	line.position.set(0, 0, 0);

	// instantiate a loader
	const loader = new GLTFLoader();


// Load a glTF resource
loader.load(
	'abstract_ball.glb', //or abstract_2.glb   need to choose
	(gltf) => {
		ball = gltf.scene;
		if (ball) {
			ball.traverse((child) => {
				if (child.isMesh) {
					child.material.depthTest = false;
				}
			});
			ball.scale.multiplyScalar(15);
			ball.position.set(0, 0, 0);
			ball.renderOrder = 5011;
			scene.add(ball);
		}
	},
	(xhr) => {
		console.log((xhr.loaded / xhr.total) * 100 + '% loaded of Ball');
	},
	(error) => {
		console.error('Error loading GLTF model', error);
	}
);

	loader.load(
		'power_up_box.glb',
		(gltf) => {
			bonus = gltf.scene.children[0];
			if (bonus) {
				// Make the model ignore lights by setting MeshBasicMaterial
				bonus.traverse((child) => {
					if (child.isMesh) {
						const basicMaterial = new THREE.MeshBasicMaterial({
							map: child.material.map, // You can copy other properties if needed
							color: 0xffffff, // Set the desired color
						});
						child.material = basicMaterial;
						child.material.transparent = true;
					}
				});
				ball.renderOrder = 5010;
				bonus.scale.multiplyScalar(25);
				bonus.position.set(0, 500, 0);
				scene.add(bonus);
			}
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + '% loaded of Bonus');
		},
		(error) => {
			console.error('Error loading GLTF model', error);
		}
	);

	scene.add(paddleL);
	scene.add(paddleR);
	scene.add(line);
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
			if (event.key == "p" && bonus) {
				bonus.traverse((child) => {
					if (child.isMesh && child.material) {
						Opacity_fade_out(child.material);
					}
				});
			}
		});
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

		paddleR.position.set(390, jfile['paddleR']['y'], 10);
		//paddleR.position.y = jfile['paddleR']['y'];
		paddleL.position.set(-390, jfile['paddleL']['y'], 10);
		
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
				if (jfile["ball"]['color'] == 'l' || ball.position.x < jfile['ball']['x'])
				{
					light.color.set(0xb50202);
					light.intensity = 10;
					paint = new THREE.Mesh( paint_geo, material_paint_L);
				}
				if (jfile["ball"]['color'] == 'r' || ball.position.x > jfile['ball']['x'])
				{
					light.color.set(0x00fff7);
					light.intensity = 10;
					paint = new THREE.Mesh( paint_geo, material_paint_R); 
				}
				paint.position.copy(ball.position);
				paint.position.x = ball.position.x + Math.round(Math.random() * 100 % 15);
				paint.position.y = ball.position.y + Math.round(Math.random() * 100 % 15);
				paint.scale.set(scale, scale, 1);
				paint.renderOrder = paint_z;
				paint_z += 1;
				scene.add(paint);
				console.log(scene.children.length)
			}
			actual_time = null;

			if (ball)
			{
				ball.position.set(jfile['ball']['x'], jfile['ball']['y'], jfile['ball']['z']);
				ball.rotation.x += 0.01;
				ball.rotation.y += 0.01;
			}			
		}
		if (bonus)
		{
			bonus.position.set(0, jfile['bonus']['y'], 50);
			bonus.rotation.z += 0.01;
		}

		renderer.render(scene, camera);

	}
		socket.onclose = (event) => {
			console.log("DED");
		};

animate();

function Opacity_fade_out(material) {
	let opacity = material.opacity;
	const reduceOpacityInterval = setInterval(() => {
		if (opacity > 0.001) {
			console.log(opacity);
			opacity -= 0.01;
			material.opacity = opacity;
			renderer.render(scene, camera);
			console.log("END: " + opacity);
		} else {
			clearInterval(reduceOpacityInterval); // Stop the interval when opacity reaches 0.01
		}
	}, 1); // Reduce opacity every second
}