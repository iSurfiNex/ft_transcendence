import { Component, register, html, css } from 'pouic'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongEndGame extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
    
    <div class="available-space">
        <div class="rectangle-stats">
            <div class="title">Resume</div>
            <div class="stats">
                <div class="">
            </div>
        </div>
    </div>

    `
    static css = css`
        @media only screen and (max-height: 524px) {
        .available-space {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
            height: calc(90% - 6px);
            background-color: rgba(255, 255, 255, 0.5);
            font-family: 'Press Start 2P', sans-serif;
        }

        .rectangle-stats {
            position: absolute;
        }

        .title {
            position: absolute;
        }

        .stats {
            position: absolute;
        }
    }
    `

//    connectedCallback() {
//        sleep (5)//le tps que les joueurs restent sur la page de fin de game avant redirection automatique 
//        
//        if (state.currentTournament != -1)
//            endTournament();
//        else if (state.currentGame != -1)
//            endGame();
//    }
//
//    endTournament() {
//        var url = "/api/manage-tournament/" + state.currentTournament + "/";
//        var tournament = state.tournaments.find(tournament => tournament.id == state.currentTournament);
//        
//        if (tournament)
//        {
//            var dataToSend = {
//                'action': 'end-round',
//                'p1_score':,//le score en int
//                'p2_score': ,
//                'winner':,
//                'loser':,
//            };
//            put2(url, dataToSend).catch(error => console.error(error));
//        }
//    }
//
//    endGame() {
//        var url = "/api/manage-game/" + state.currentGame + "/";
//        var game = state.games.find(game => game.id == state.currentGame);
//        
//        if (game)
//        {
//            var dataToSend = {
//                'action': 'end-game',
//                'p1_score': ,
//                'p2_score':,
//                'winner': ,
//            };
//            put2(url, dataToSend).catch(error => console.error(error));
//        }
//    }
}

register(PongEndGame)