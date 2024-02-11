import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import * as UNIFORMS from "uniforms";

export class PongGameCanvas {
  pLScore = undefined
  pRScore = undefined

  light = new THREE.DirectionalLight(0xffffff, 10);
  geometry_line = new THREE.BoxGeometry(2, 1000, 1);
  geometry_paddle = new THREE.BoxGeometry(10, 1, 20, 5, 5, 5);
  material_paddleL = new THREE.MeshBasicMaterial({
    color: 0xb50202,
    depthTest: false,
  });
  material_paddleR = new THREE.MeshBasicMaterial({
    color: 0x00fff7,
    depthTest: false,
  });
  material_paint_L = new THREE.MeshBasicMaterial({
    color: 0xb50202,
    depthTest: false,
  });
  material_paint_R = new THREE.MeshBasicMaterial({
    color: 0x00fff7,
    depthTest: false,
  });
  material_line = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    opacity: 0.1,
    depthTest: false,
  });
  material_line_green = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  material_line_yellow = new THREE.LineBasicMaterial({ color: 0xffff00 });
  line = new THREE.Mesh(this.geometry_line, this.material_line);
  paddleL = new THREE.Mesh(this.geometry_paddle, UNIFORMS.uniform_red);
  paddleR = new THREE.Mesh(this.geometry_paddle, UNIFORMS.uniform_blue);
  paint_geo = new THREE.CircleGeometry(15, 128);
  scene = new THREE.Scene();
  paint_z = 0;
  ball;
  bonus;
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  loader = new GLTFLoader().setPath("/static/pong/");

  obstacleLinesContainer = new THREE.Object3D();
  goalLinesContainer = new THREE.Object3D();
  clampLinesContainer = new THREE.Object3D();

  constructor(gameContainerNode) {
    this.gameContainerNode = gameContainerNode;
    this.time = new Date().getTime();
    this.init();
    this.setupKeyListener();
    this.connectWebsocket();
    this.animate();
  }

  init() {
    this.paddleL.renderOrder = 5002;
    this.paddleR.renderOrder = 5001;
    this.line.renderOrder = 5003;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    //this.setCanvasSize(this.renderer);
    this.gameContainerNode.appendChild(this.renderer.domElement);
    console.log("Three js version is r" + THREE.REVISION);

    this.camera.position.set(0, 0, 600);

    this.light.position.set(0, 0, 610);
    this.paddleL.position.set(-450, 0, 0);
    this.paddleR.position.set(450, 0, 0);
    this.line.position.set(0, 0, 0);
    this.loadAssets();

    this.scene.add(this.paddleL);
    this.scene.add(this.paddleR);
    this.scene.add(this.line);
    this.scene.add(this.light);
    this.scene.add(this.obstacleLinesContainer);
    this.scene.add(this.goalLinesContainer);
    this.scene.add(this.clampLinesContainer);
  }

  connectWebsocket() {
    if (state.currentGame < 0) {
      console.warn("Game webSocket connection canceled because current game id is " + state.currentGame)
      setTimeout(() => this.connectWebsocket(), 2000);
    }

    this.socket = ws(`game-running/${state.currentGame}/`);

    this.socket.onmessage = this.onmessage.bind(this);

    this.socket.onclose = (event) => {
      console.log("Game webSocket connection closed, autoreconnect in 2 sec.");
      setTimeout(() => this.connectWebsocket(), 2000);
    };
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    // Render the scene
    this.render();
  }

  setupKeyListener() {
    // NOTE plus besoin ça doit être controlé par le serveur
    //document.addEventListener('keydown', function(event) {
    //	if (event.key == "p" && this.bonus) {
    //		this.bonus.traverse((child) => {
    //			if (child.isMesh && child.material) {
    //  				this.opacityFadeOut(child.material);
    //			  this.paddleR.scale.set(1, 1.5);
    //			  this.paddleL.scale.set(1, 0.5);

    //			}
    //		});
    //	}
    //});

    const inputs = { up: false, down: false };
    const send_inputs = () => this.socket.send(JSON.stringify(inputs)); // Send the typed message to the server
    // return false if the key was ignored
    const handleInput = (keyList, inputKey, key, value) => {
      // key not pressed or held down
      if (!keyList.includes(key) || value === inputs[inputKey]) return false;
      inputs[inputKey] = value;
      return true;
    };
    const updateInputs = (key, value) => {
      if (
        handleInput(["ArrowUp", "w"], "up", key, value) ||
        handleInput(["ArrowDown", "s"], "down", key, value)
      )
        send_inputs();
    };
    document.addEventListener("keydown", ({ key }) => updateInputs(key, true));
    document.addEventListener("keyup", ({ key }) => updateInputs(key, false));
  }

  updateBallPaint(data) {
    let actual_time = new Date();
    let paint;
    let scale;

    if (
      this.ball.position.x != data.ball.x &&
      actual_time.getTime() > this.time + 150
    ) {
      scale = (Math.random() * 100) % 1.5;
      this.time = actual_time.getTime();
      if (data.ball.color == "l" || this.ball.position.x < data.ball.x) {
        this.light.color.set(0xb50202);
        this.light.intensity = 10;
        paint = new THREE.Mesh(this.paint_geo, this.material_paint_L);
      }
      if (data.ball.color == "r" || this.ball.position.x > data.ball.x) {
        this.light.color.set(0x00fff7);
        this.light.intensity = 10;
        paint = new THREE.Mesh(this.paint_geo, this.material_paint_R);
      }
      paint.position.copy(this.ball.position);
      paint.position.x =
        this.ball.position.x + Math.round((Math.random() * 100) % 15);
      paint.position.y =
        this.ball.position.y + Math.round((Math.random() * 100) % 15);
      paint.scale.set(scale, scale, 1);
      paint.renderOrder = this.paint_z;
      this.paint_z += 1;
      this.scene.add(paint);
      //console.log(this.scene.children.length)
    }
    actual_time = null;
  }

  updateBall(data) {
    if (!this.ball) return;
    this.updateBallPaint(data);
    this.ball.position.set(data.ball.x, data.ball.y, 0);
    this.ball.rotation.x += 0.01;
    this.ball.rotation.y += 0.01;
  }

  updateBonus(data) {
    if (!this.bonus) return;
    this.bonus.position.set(0, data.bonus.y, 50);
    this.bonus.rotation.z += 0.01;
  }

  updateLinesContainer(data, linesContainer, color, opacity = 1) {
    linesContainer.children.forEach((line, index) => {
      const lineData = data[index];
      if (lineData) {
        const points = [
          new THREE.Vector3(lineData.x1, lineData.y1, 0),
          new THREE.Vector3(lineData.x2, lineData.y2, 0),
        ];
        line.geometry.setFromPoints(points);
      } else {
        linesContainer.remove(line);
      }
    });

    for (let i = linesContainer.children.length; i < data.length; i++) {
      const lineData = data[i];
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(lineData.x1, lineData.y1, 0),
        new THREE.Vector3(lineData.x2, lineData.y2, 0),
      ]);
      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
      });
      const line = new THREE.Line(geometry, material);
      linesContainer.add(line);
    }
  }

  drawDebugLines(data) {
    this.updateLinesContainer(
      data.obstacles,
      this.obstacleLinesContainer,
      0x00ff00,
    );
    this.updateLinesContainer(
      [data.pL.goal, data.pR.goal],
      this.goalLinesContainer,
      0xffff00,
    );
    this.updateLinesContainer(
      [data.pL.clamp, data.pR.clamp],
      this.clampLinesContainer,
      0x0000ff,
      0.4,
    );
  }

  onmessage(event) {
    const message = event.data;
    const data = JSON.parse(message).message;
    if (this.pLScore !== data.pL.score) {
      console.log(data.pL.score)
      state.runningGame.pLPoints = data.pL.score
      this.pLScore = data.pL.score
    }
    if (this.pRScore !== data.pR.score) {
      state.runningGame.pRPoints = data.pR.score
      this.pRScore = data.pR.score
    }
    // if (data.bonus.size_minus == 'r')
    // 	paddleR.scale.set(1, 2);
    // else
    //paddleR.setSize(data["paddleR"]["sizeY"], data["paddleR"]["sizeX"], 20);
    //au pire il faut mettre la size des paddle a 1 et les scale a fond

    // if (data.bonus.size_minus == 'l')
    // 	paddleL.scale.set(1, 2);
    // else
    // 	paddleL.scale.set(1, 1);

    this.paddleR.scale.set(1, data.pR.paddle.h, 1);
    this.paddleL.scale.set(1, data.pR.paddle.h, 1);

    this.paddleR.position.set(data.pR.paddle.x, data.pR.paddle.y, 10);
    this.paddleL.position.set(data.pL.paddle.x, data.pL.paddle.y, 10);

    this.updateBall(data);
    this.updateBonus(data);

    this.drawDebugLines(data);
  }

  opacityFadeOut(material) {
    let opacity = material.opacity;
    const reduceOpacityInterval = setInterval(() => {
      if (opacity > 0.001) {
        opacity -= 0.01;
        material.opacity = opacity;
      } else {
        clearInterval(reduceOpacityInterval); // Stop the interval when opacity reaches 0.01
      }
    }, 1); // Reduce opacity every second
  }

  loadAssets() {
    // Load a glTF resource
    this.loader.load(
      "abstract_ball.glb", //or abstract_2.glb   need to choose
      (gltf) => {
        this.ball = gltf.scene;
        if (this.ball) {
          this.ball.traverse((child) => {
            if (child.isMesh) {
              child.material.depthTest = false;
            }
          });
          this.ball.scale.multiplyScalar(15);
          this.ball.position.set(0, 0, 0);
          this.ball.renderOrder = 5011;
          this.scene.add(this.ball);
        }
      },
      (xhr) => {
        // console.log((xhr.loaded / xhr.total) * 100 + "% loaded of Ball");
      },
      (error) => {
        console.error("Error loading GLTF model", error);
      },
    );

    this.loader.load(
      "power_up_box.glb",
      (gltf) => {
        this.bonus = gltf.scene.children[0];
        if (this.bonus) {
          // Make the model ignore lights by setting MeshBasicMaterial
          this.bonus.traverse((child) => {
            if (child.isMesh) {
              const basicMaterial = new THREE.MeshBasicMaterial({
                map: child.material.map, // You can copy other properties if needed
                color: 0xffffff, // Set the desired color
              });
              child.material = basicMaterial;
              child.material.transparent = true;
            }
          });
          this.ball.renderOrder = 5010;
          this.bonus.scale.multiplyScalar(25);
          this.bonus.position.set(0, 500, 0);
          this.scene.add(this.bonus);
        }
      },
      (xhr) => {
        // console.log((xhr.loaded / xhr.total) * 100 + "% loaded of Bonus");
      },
      (error) => {
        console.error("Error loading GLTF model", error);
      },
    );
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
