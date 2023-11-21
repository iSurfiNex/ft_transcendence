import {observers} from './observer.js'

export const cbSymbol = Symbol('callback');

export const get_prop = (obj, path) => {
  for (const prop of path) {
    if (!(prop in obj))
      return undefined
    obj = obj[prop]
  }
  return obj
}

export const getPathObserver = (path, observers) => {
  let obs = path.reduce((nestedObj, key, index) => {
    if (!(key in nestedObj))
      nestedObj[key] = { [cbSymbol]: [] };
    return nestedObj[key];
  }, observers);
  return obs
}

export const addPathObserver = (path, onChange) => {
  let obs = getPathObserver(path, observers)
  obs[cbSymbol].push(onChange)
}

export const extractPathScope = (path, scope, prefixes = {}) => {
  for (const [key, value] of Object.entries(prefixes)) {
    if (path[0] != key)
      continue
    path.shift()
    path.unshift(...value)
  }
  if (path[0] != "this")
    return window.state
  path.shift()
  return scope
}

export const isIterable = (obj) =>{
  return obj != null && typeof obj[Symbol.iterator] === 'function';
}

export const matchVariable = str => {
  const regexPattern = /^\{(!?[a-zA-Z0-9_.?]+)\}$/;
  const matches = str.split(regexPattern);
  if (matches.length != 3)
    return
  return matches[1]
}

export const bracketEval = (query, scope) => {
  let attrVal = matchVariable(query)

  if (!attrVal)
    return[]
  let negate

  if (attrVal[0]==='!'){
    negate = true
    attrVal = attrVal.substring(1);
  } else {
    negate = false
  }

  if (attrVal.startsWith("this."))
    attrVal = attrVal.substring(5);
  else
    scope = window.state

  let res = attrVal.split('?');
  let useValue = false

  if (res.length === 1){
    if (res[0] == "")
      return[]
    else
      useValue = true
  }
  else if (res.length !== 2  || res[1] == "")
    return[]
  var [path, forwardVal] = res
  path = path.split('.')
  return [path, negate, useValue, forwardVal, scope]
}
