import {get_prop, cbSymbol} from './utils.js'
import {observers} from './observer.js'
import {addPathObserver} from './utils.js'

const callObsCbRecurse = (obs, value, path) => {
  for (const [key, childObs] of Object.entries(obs)) {
    let subValue = value[key]
    if (subValue !== undefined)
      callObsCbRecurse(childObs, value[key], [...path, key])
  }
  let obsCb = obs[cbSymbol]
  if (!obsCb)
    return
  if (value === undefined)
    return
  for (const oCb of obsCb)
    oCb(value)
}

const handler = {
  path: [],
  get(target, key, receiver) {
    if (typeof target[key] !== 'object' || target[key] === null)
      return target[key];
    let next_handler = this == handler ? { ...handler, path: [] } : this
    next_handler.path.push(key)
    return new Proxy(target[key], next_handler)
  },
  set(target, key, value, receiver) {
    target[key] = value
    let path = [...this.path, key]
    let obs = get_prop(observers, path)
    if (!obs)
      return true
    callObsCbRecurse(obs, value, [...path])

    return true
  }
}

export const setup = (state_base) => {
  const state = new Proxy(state_base, handler)
  window.state = state
  return state
}

export const observe = (path, cb) => {
  addPathObserver(path.split('.'), cb);
}
