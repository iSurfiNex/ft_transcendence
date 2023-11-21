import {setup} from "./pouic/state.js"
import {evalRepeat} from './pouic/repeat_binding.js'

var state_base = {
  apibasepath: "/api/",
  updateUsers() { console.log('fetching user..') },
  fn(a, b) { console.log('state function', a, b) },
  player: {
    active: true,
    firstName: "toto",
    lastName: "yolo"
  },
  players: [{ name: "toto", scores: [1, 2, 3] }, { name: "tsdfoto", scores: [1, 2, 3] }, { name: "tata", scores: [4, 5, 6] }],
  firstName: "alfred",
  lastName: "john",
  inner: {
    salary: 8250,
    toto: {
      a: false,
      b: false
    },
    Proffesion: ".NET Developer"
  }
}

const state = setup(state_base)
console.log(state)
evalRepeat(document, window)

