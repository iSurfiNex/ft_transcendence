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
  let prefixValue = prefixes[path[0]]
  while (prefixValue !== undefined) {
    path.shift()
    path.unshift(...prefixValue)
    prefixValue = prefixes[path[0]]
  }
  if (path[0] != "this")
    return window.state
  path.shift()
  return scope
}

export const isIterable = (obj) =>{
  return obj != null && typeof obj[Symbol.iterator] === 'function';
}

// TODO rename extractBinding
export const matchVariable = str => {
  const regexPattern = /^\{(!?[a-zA-Z0-9_.?]+)(?:\(([^)]*)\))?\}$/;
  const matches = str.split(regexPattern);
  if (matches.length < 3)
    return []
  // items 0 and n-1 contains empty string
  // if one element is return, it's a variable path, otherwise, first item is a function name, and the rest are the arguments
  return matches.slice(1, -1)
}

const fnEval = (bindName,bindArgsStr, scope, prefixes, negate, onChange) => {

  let argsPath = []
    //function evaluation
    if (bindArgsStr == "") {
      // no argument
    } else {
      argsPath = bindArgsStr.split(',').map(str => str.trim())
    }

    const fnPath = bindName.split('.')
    const fnLocalScope = extractPathScope(fnPath, scope, prefixes)
    let fn = get_prop(fnLocalScope,  fnPath)
    const args = []
    const callFn = () => onChange(fn(...args), negate, true, undefined)

    let onFnChange = newFn => {
      fn = newFn
      callFn()
    }

    for (let [i,pathStr] of Object.entries(argsPath)) {
      const varPath = pathStr.split('.')
      const argLocalScope = extractPathScope(varPath, scope, prefixes)
      args[i] = get_prop(argLocalScope, varPath)
      if (args[i] ==undefined)
        return false
      const onArgChange = newArg => {
        args[i] = newArg
        callFn()
      }
      addPathObserver(varPath, onArgChange)
    }
    addPathObserver(fnPath, onFnChange)
      callFn()
      return true
}

export const bracketEval = (query, scope, prefixes, onChange) => {
  let [bindName, bindArgsStr] = matchVariable(query)

  if (!bindName)
    return false
  let negate

  if (bindName[0]==='!'){
    negate = true
    bindName = bindName.substring(1);
  } else {
    negate = false
  }

  if (bindArgsStr == undefined){
    //variable evaluation

    let res = bindName.split('?');
    let useValue = false

    if (res.length === 1){
      if (res[0] == "")
        return false
      else
        useValue = true
    }
    else if (res.length !== 2  || res[1] == "")
      return false
    var [path, forwardVal] = res
    path = path.split('.')

    let localScope = extractPathScope(path, scope, prefixes)

    let initialUseAttr = get_prop(localScope, path)
    if (initialUseAttr === undefined)
      return false
    onChange(initialUseAttr, negate, useValue, forwardVal)
    let handleChange = (newVal) => onChange(newVal, negate, useValue, forwardVal)
    addPathObserver(path, handleChange)
  } else {
    return fnEval(bindName, bindArgsStr, scope, prefixes, negate, onChange)
  }
  return true
}