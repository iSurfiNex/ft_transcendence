import { Component, register } from 'pouic'
import { initPopover } from '/src/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/src/bootstrap/bootstrap_css.js'

//<a class="link-wr" key={item} href="/profile"> 
//									<div class="player-waiting-room"> 
//										
//										<img class="profil-pic-wr" src={process.env.PUBLIC_URL + '/' + picture} alt="profil pic"/>
//										{item}
//
//									</div>
//							</a>);

//<div class="players-list-waiting-room" repeat="state.games[state.currentGame].players" as "player">
//<a class="link-player-profil" href="/profile" onClick="navigateTo('/profile')> player </a>
//</div>




class PongWaitingRoom extends Component {
	static sheets = [bootstrapSheet]
	static template = `
    <div class="background-waiting-room">
			<div class="rectangle-waiting-room">
				
				<div class="title-waiting-room"> Waiting Room </div>

            
			</div>
		</div>
    `

    static css = `
    @media only screen and (max-width: 768px) {
        .background-waiting-room {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
            height: calc(90% - 6px);
            background-color: rgba(255, 255, 255, 0.5);
        }
    
        .rectangle-waiting-room {
            position: absolute;
            bottom: 10%;
            width: 70%;
            height: 80%;
            left: 15%;
            background-color: rgb(54, 54, 54);
            box-shadow: rgba(0, 0, 0, 0.7) 0px 5px 15px;
        }
    
        .title-waiting-room {
            color: rgb(254, 254, 254);
            font-size: 22px;
            width: 90%;
            left: 5%;
            top: 10%;
            position: absolute;
        }
    }
    
    
    @media (hover: hover) {
        .background-waiting-room {
            position: absolute;
            right: 0;
            bottom: 0;
            width: calc(75% - 10px);
            height: calc(90% - 10px);
            background-color: rgba(255, 255, 255, 0.5);
        }
    
        .rectangle-waiting-room {
            position: absolute;
            bottom: 10%;
            width: 50%;
            height: 80%;
            left: 25%;
            background-color: rgb(54, 54, 54);
            box-shadow: rgba(0, 0, 0, 0.7) 0px 5px 15px;
            display: flex;
            align-items: center;
        }
    
        .title-waiting-room {
            position: absolute;
            color: rgb(254, 254, 254);
            font-size: 250%;
            width: 70%;
            left: 15%;
            right: 15%;
            top: 5%;
            overflow: hidden;
        }
    
 
        }
    }
    `    

    observers = {
		'player.active': active => console.log("active?: ", active)
	}

	connectedCallback() {
		initPopover(this)
	}
}

register(PongWaitingRoom)