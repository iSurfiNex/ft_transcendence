import { Component, register } from 'pouic'
import { initPopover } from './init_bootstrap_plugins.js'

import {bootstrapSheet} from 'bootstrap_css'

//const templateString = `
//  <style>
//    /* Add styles here */
//  </style>
//<h1 hidden="{player.active?yolo}">hjjhghjg<h1/>
//<button type="button" class="btn btn-lg btn-danger" data-bs-toggle="popover" data-bs-title="Popover title" data-bs-content="And here's some amazing content. It's very engaging. Right?">Click to toggle popover</button>        <div repeat="players" as="item">
//            <span>SCOPE {item.name}!<span>
//        </div>
//  <div @click="this.fn(o, f)" class="this.playr.active?hey" a="=this.player.active?yop">Player</div>
//<div class="toast">dsfsfd<div/>
//        <div repeat="players" as="player">
//            <span>THIS {player.name}!<span>
//        </div>
//<!--
//
//  <div @click="this.fn(o, f)" class="this.playr.active?hey" a="this.player.active?yop">Player</div>
//
//
//
//  <div id="myDiv">Hello I'm {this.player.firstName}, <span>{player.lastName}</span></div>
//        <div repeat="this.players" as="player">
//            <span>THIS {player.name}!<span>
//        </div>
//
//            <span>SCOPE {player.active}!<span>
//<div>NAME{players.0.name}<div>
//<div>FNAME{firstName}<div>
//<div>---------{player.active}<div>
//-->
//
//`;


class MyParagraph extends Component {
  static sheets = [bootstrapSheet]
  static template= `
<div>
  <div repeat="players" as="item">
    <h1> hello from {item.name}!</h1>
  </div>
</div>

<button type="button" class="btn btn-lg btn-danger" data-bs-toggle="popover" data-bs-title="Popover title" data-bs-content="And here's some amazing content. It's very engaging. Right?">Click to toggle popover</button>        <div repeat="players" as="item">
            <span>SCOPE {item.name}!<span>
        </div>
`

  static css= `
    .hey, span {
background: red;
}
    [a="yop"] {
color: blue;
}
`
  observers= {
    'player.active': active => console.log("active?: ", active)
  }

  connectedCallback(){
    initPopover(this)
  }
  fn(a, b){
    window.state.player.active = !window.state.player.active
    console.log("method function: ",a,b)
  }
}

register(MyParagraph)


//  <div @click="this.fn(o, f)" class="{this.playr.active?hey}" a="{this.player.active?yop}">Player</div>
//<div class="toast">dsfsfd<div/>
//        <div repeat="players" as="player">
//            <span>THIS {player.name}!<span>
//        </div>`
