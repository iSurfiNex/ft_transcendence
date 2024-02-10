import { Component, register, html, css } from "pouic";
import { observe } from "pouic";
import { PongGameCanvas } from "pong_game";

class PongGame extends Component {
  static template = html`
    <div id="gameContainer"></div>
    <div id="gameOverlay">
      <div id="startIn" hidden="{!runningGame.startIn}">
        <div class="bg"></div>
        <h2>{language.Start} {runningGame.startIn}</h2>
      </div>
      <div id="points" hidden="{runningGame.startIn}">
        <span id="pLPoints" class="points">{runningGame.pLPoints}</span>
        <span id="pRPoints" class="points">{runningGame.pRPoints}</span>
      </div>
      <div id="gameOverLayer" hidden="{!runningGame.gameOverState}">
        <div class="bg"></div>
        <span id="gameOverTxt">{language.gameOver}</span>
        <span id="gameOverState" class="blinking"
          >{lang(runningGame.gameOverState)}</span
        >
      </div>
    </div>
    <span id="info">Score to win: {game.goal_objective}</span>
    <button class="btn btn-giveUp" @click="this.giveUp()">
      {language.ByeButton} LOSER
    </button>
  `;

  static css = css`
    #info {
      position: absolute;
      bottom: 100px;
    }

    .btn-giveUp {
      cursor: pointer;
      font-size: 25px;
      font-family: "Press Start 2P", sans-serif;
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
      transition:
        background-color 0.3s,
        color 0.3s;
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
      font-family: "Press Start 2P", sans-serif;
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

    #gameOverlay,
    #startIn,
    .bg,
    #gameOverLayer {
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

    #pLPoints {
      top: 40px;
      right: 50%;
      padding-right: 40px;
    }

    #pRPoints {
      top: 40px;
      left: 50%;
      padding-left: 40px;
    }

    #gameOverLayer {
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: white;
      text-align: center;
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
  `;

  constructor() {
    super();
    observe("runningGame.startedAt", this.updatedStartIn.bind(this));
  }

  giveUp() {
    get("/api/giveup/");
  }

  updatedStartIn(startedAt) {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    const remainingTime = startedAt - Date.now();
    if (remainingTime < 0) state.runningGame.startIn = null;
    else {
      state.runningGame.startIn = Math.round(remainingTime / 1000);
      const nextSecDelay = Math.round(remainingTime % 1000);
      this.timeoutId = setTimeout(
        this.updatedStartIn.bind(this, startedAt),
        nextSecDelay,
      );
    }
  }

  connectedCallback() {
    Promise.all(PongGame.sheets).then(() => this.initGame());
    window.addEventListener("resize", this.setCanvasSize.bind(this));
  }

  initGame() {
    this.gameContainer = this.shadowRoot.getElementById("gameContainer");
    this.canvasRatio = 600 / 800;
    this.game = new PongGameCanvas(this.gameContainer);
    this.setCanvasSize();
  }

  setCanvasSize() {
    let w = this.gameContainer.clientWidth;
    let h = this.gameContainer.clientWidth * this.canvasRatio;

    if (h > this.gameContainer.clientHeight) {
      h = this.gameContainer.clientHeight;
      w = h / this.canvasRatio;
    }

    this.game?.renderer?.setSize(w, h);
    const overlayNode = this.shadowRoot.getElementById("gameOverlay");
    overlayNode.style.width = w + "px";
    overlayNode.style.height = h + "px";
  }
}

register(PongGame);
