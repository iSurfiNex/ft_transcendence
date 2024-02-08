import { Component, register, html, css } from 'pouic'
import * as THREE from 'three';
import * as UNIFORMS from 'uniforms';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {observe} from 'pouic'

class PongGame extends Component {
	static template = html`
<div id="gameContainer">
</div>
<div id="gameOverlay">
  <div id="startIn" hidden={!runningGame.startIn}>
	<div class="bg"></div>
	<h2>{language.Start} {runningGame.startIn}</h2>
  </div>
  <div id="points" hidden={runningGame.startIn}>
  	<span id="p1Points" class="points">{runningGame.p1Points}</span>
  	<span id="p2Points" class="points">{runningGame.p2Points}</span>
  </div>
  <div id="gameOverLayer" hidden="{!runningGame.gameOverState}">
	<div class="bg"></div>
  	<span id="gameOverTxt">{language.gameOver}</span>
	<span id="gameOverState" class="blinking">{lang(runningGame.gameOverState)}</span>
  </div>

</div>
  <button class="btn btn-giveUp" @click="this.giveUp()">{language.ByeButton} LOSER</button>
`

	static css = css`

        .btn-giveUp {
            cursor: pointer;
            font-size: 25px;
		    font-family: 'Press Start 2P', sans-serif;
			position: fixed;
			bottom: 40px;
			right: 40px;
            justify-content: center;
            align-items: center;
            display: flex;
            white-space: nowrap;
            overflow: hidden;

            background-color: rgba(42, 42, 42, 0.2);
            color: #ff0000;
            border: 1px solid #ff0000;
            transition: background-color 0.3s, color 0.3s;
            opacity: 0.6;
        }

        .btn-giveUp:hover {
            background-color: #ff0000;
            color: #2a2a2a;
            opacity: 1;
        }

	:host {
		position: absolute;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.5);
		height: calc(90% - 6px);
		width: 100%;
  		font-family: 'Press Start 2P', sans-serif;
		font-weight: bold;
	}

	@media only screen and (min-width: 769px) and (min-height: 525px) {
		:host {
			width: calc(75% - 10px);
			height: calc(90% - 10px);
		}
	}

	#gameContainer {
		width: 100%;
		height: 100%;
		color: white;
	}

	canvas {
		width: 100%;
	}

	#gameOverlay, #startIn, .bg, #gameOverLayer {
		position: absolute;
  		width: 100%;
  		height: 100%;
  		top: 0;
	}

	.bg {
		background: black;
		opacity: 0.8;
	}

	#startIn {
		display: flex;
		justify-content: center;
	}

	#startIn > h2 {
		position: relative;
		margin-top: 80px;
		color: white;
	}

	[hidden] {
		display: none !important;
	}

	.points {
		position: absolute;
  		font-size: 44px;
		color: white;
		opacity: 0.4;
	}

	#p1Points {
		top: 40px;
		right: 50%;
		padding-right: 40px;
	}

	#p2Points {
		top: 40px;
		left: 50%;
		padding-left: 40px;
	}

	#gameOverLayer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: white;
		text-align: center
	}

	#gameOverTxt {
		font-size: 40px;
	}

	#gameOverState {
		font-size: 60px;
		margin-top: 20px;
	}

	@keyframes blink {
      0% {
        opacity: 1;
      }
      80% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }

    .blinking {
      animation: blink 1.5s infinite;
    }

	@media (max-width: 500px) {
		#gameOverTxt {
			font-size: 20px;
		}

		#gameOverState {
			font-size: 30px;
		}

	}
`

    constructor() {
        super()
        observe('runningGame.startedAt', this.updatedStartIn.bind(this))
    }

    giveUp() {
        get('/api/giveup/')
    }

    updatedStartIn(startedAt) {
        if (this.timeoutId)
            clearTimeout(this.timeoutId)
        const remainingTime = startedAt - Date.now()
        if (remainingTime < 0)
            state.runningGame.startIn = null
        else {
            state.runningGame.startIn = Math.round(remainingTime / 1000)
            const nextSecDelay = Math.round(remainingTime % 1000)
           this.timeoutId = setTimeout(this.updatedStartIn.bind(this, startedAt), nextSecDelay)
        }
    }

    connectedCallback() {
        Promise.all(PongGame.sheets).then(() => this.initGame());
    }

    initGame() {
        this.gameContainer = this.shadowRoot.getElementById('gameContainer')
        this.canvasRatio = 600/800
        this.setupThreeJS();
    }

    setCanvasSize(renderer) {
        let w = this.gameContainer.clientWidth
        let h = this.gameContainer.clientWidth*this.canvasRatio

        if (h > this.gameContainer.clientHeight)  {
            h = this.gameContainer.clientHeight
            w = h / this.canvasRatio
        }

	    renderer.setSize(w, h)
        const overlayNode = this.shadowRoot.getElementById('gameOverlay');
        overlayNode.style.width = w+'px';
        overlayNode.style.height = h+'px';
    }

    setupThreeJS() {
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
    this.setCanvasSize(renderer)
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	this.gameContainer.appendChild(renderer.domElement);

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

    const baseURL = '/static/pong/'; // Set your base URL here
	// instantiate a loader
	const loader = new GLTFLoader();

    loader.setPath(baseURL);


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
						paddleR.scale.set(1, 1.5);
						paddleL.scale.set(1, 0.5);

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
			console.log(obj);
			if (event.key) {
					socket.send(JSON.stringify(obj)); // Send the typed message to the server
			}
		}
		const handleResize = ()=>{
            this.setCanvasSize(renderer)
		}
		window.addEventListener('resize', handleResize);

		const onmessage = (event) => {
            console.log("RECEIVED: ", event.data)
            return;

		var jfile
		const message = event.data;
		jfile = JSON.parse(event.data)

		// if (jfile['bonus']['size_minus'] == 'r')
		// 	paddleR.scale.set(1, 2);
		// else
		//paddleR.setSize(jfile["paddleR"]["sizeY"], jfile["paddleR"]["sizeX"], 20);
		//au pire il faut mettre la size des paddle a 1 et les scale a fond
		paddleR.position.set(390, jfile['paddleR']['y'], 10);

		// if (jfile['bonus']['size_minus'] == 'l')
		// 	paddleL.scale.set(1, 2);
		// else
		// 	paddleL.scale.set(1, 1);
		paddleL.position.set(-390, jfile['paddleL']['y'], 10);

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
				//console.log(scene.children.length)
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


    const connectWsGame = () => {
        this.socket = ws(`game-running/${state.currentGame}/`)

			this.socket.onmessage = onmessage

            this.socket.onclose = (event) => {
                console.log('Game webSocket connection closed, autoreconnect in 2 sec.');
                setTimeout(() => connectWsGame(), 2000);
            };
        }

    // TODO
    //connectWsGame()

animate();

function Opacity_fade_out(material) {
	let opacity = material.opacity;
	const reduceOpacityInterval = setInterval(() => {
		if (opacity > 0.001) {
			opacity -= 0.01;
			material.opacity = opacity;
			renderer.render(scene, camera);
		} else {
			clearInterval(reduceOpacityInterval); // Stop the interval when opacity reaches 0.01
		}
	}, 1); // Reduce opacity every second
}
    }
}

register(PongGame);
