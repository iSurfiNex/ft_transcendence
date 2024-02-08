import {observers} from './observer.js'

export const cbSymbol = Symbol('callback');
export const invalidPathSymbol = Symbol('key_error');

export const setState = (path, value) => {
  let pathArr;
  if (Array.isArray(path))
    pathArr = [...path]
  else if (typeof path === "string")
    pathArr = path.split('.')
  else {
    console.warn(`path must be array or dot separated string, found: \"${typeof path}\"`)
    return false
  }
  const lastKey = pathArr.pop()
  let obj = window.state
  for (const key of pathArr) {
    if (obj == null || !(key in obj)) {
      console.warn(`Cannot set state value at path ${path} => error at key ${key}.`)
      return false
    }
    obj = obj[key]
  }
  if (obj == null) {
    console.warn(`Cannot set state value at path ${path}`)
    return false
  }
  obj[lastKey] = value
  return true
}

export const get_fn = (obj, path) => {
  if (!(path[0] in obj))
    {
    return invalidPathSymbol
    }
  for (const prop of path) {
    if (obj == null || !(prop in obj))
      return undefined
    obj = obj[prop]
  }
  return obj
}
export const get_prop = (obj, path) => {
  if (!path.length)
    return obj
  if (!(path[0] in obj))
    {
    return invalidPathSymbol
    }
  for (const prop of path) {
    if (obj == null || !(prop in obj))
      return undefined
    obj = obj[prop]
  }
  return obj
}

const getScopedProp = (path, scope, prefixes) => {
  const argLocalScope = extractPathScope(path, scope, prefixes)
  return get_prop(argLocalScope, path)
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
  const regexPattern = /^\{(!{0,2}[a-zA-Z0-9_.?:;\-\ ]+)(?:\(([^)]*)\))?\}$/;
  const matches = str.split(regexPattern);
  if (matches.length < 3)
    return []
  // items 0 and n-1 contains empty string
  // if one element is return, it's a variable path, otherwise, first item is a function name, and the rest are the arguments
  return matches.slice(1, -1)
}

/**
 * Parses a primitive variable.
 *
 * @param {string} val - The input value to parse.
 * @returns {number|string|undefined} - Parsed result:
 *   - If `val` is a valid number, returns the parsed number.
 *   - If `val` is wrapped in single quotes ('), returns the unwrapped string.
 *   - If `val` doesn't match any condition, returns undefined.
 */
const parsePrimitiveVar = val => {
  if (val ==="undefined")
    return undefined
  if (val ==="null")
    return null

   const nb = Number(val)
   if (!isNaN(nb)) {
     // Pure number
     return nb
   }

  if (val.length > 1 && val[0] === "'" && val.at(-1) === "'") {
     // Wrapped into single quote
     const inner =  val.slice(1, -1)
    return inner
   }
  return undefined
}

export const evalBindVar = (val, scope, prefixes) => {
  const primitiveValue = parsePrimitiveVar(val)
  if (primitiveValue !== undefined)
    return primitiveValue
  const varPath = val.split('.')
  return getScopedProp(varPath, scope, prefixes)
}

/* This method is used during computed property initialization */
export const autoFn = (fn,argsPath, scope, prefixes) => {
  if (!(typeof fn === "function")){
      console.warn(`Not a function`)
      return false;
    }
  if (!Array.isArray(argsPath)) {
      console.warn(`Observed path must be an array`)
      return false;
  }

    fn = fn.bind(scope)
    const args = []
    for (let [i,pathStr] of Object.entries(argsPath)) { // TODO foreach ?
      const primitiveVar = parsePrimitiveVar(pathStr)
      if (primitiveVar != undefined){ // null OR undefined this is important
        args[i] = primitiveVar
        continue
      }
      const varPath = pathStr.split('.')
      const evalVar = getScopedProp(varPath, scope, prefixes)
      if (evalVar === invalidPathSymbol)
        return false
      args[i] = evalVar
      const onArgChange = newArg => {
        args[i] = newArg
        fn(...args)
      }
      addPathObserver(varPath, onArgChange)
    }
  fn(...args)
      return true
}


const fnEval = (bindName,bindArgsStr, scope, prefixes, transform, onChange) => {

  let argsPath = []
    //function evaluation
    if (bindArgsStr == "") {
      // no argument
    } else {
      argsPath = bindArgsStr.split(',').map(str => str.trim())
    }

    const fnPath = bindName.split('.')
    const fnLocalScope = extractPathScope(fnPath, scope, prefixes)
    let fn = get_prop(fnLocalScope, fnPath)
    if (!fn || fn === invalidPathSymbol) {
      console.warn(`Function at path ${fnPath} does not exist in scope`, fnLocalScope)
      return;
    }
    fn = fn.bind(fnLocalScope)
    const args = []
  const callFn = () => onChange(fn(...args), transform, true, undefined)

    let onFnChange = newFn => {
      fn = newFn
      callFn()
    }
    for (let [i,pathStr] of Object.entries(argsPath)) { // TODO foreach ?
      const primitiveVar = parsePrimitiveVar(pathStr)
      if (primitiveVar != undefined){ // null OR undefined this is important
        args[i] = primitiveVar
        continue
      }
      const varPath = pathStr.split('.')
      const evalVar = getScopedProp(varPath, scope, prefixes)
      if (evalVar === invalidPathSymbol)
        return false
      args[i] = evalVar
      const onArgChange = newArg => {
        // HACK ignore undefined values
        //if (newArg === undefined)
        //  return
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
  let transform

  if (bindName[0]==='!'){
    bindName = bindName.substring(1);
    if (bindName[0]==='!'){
      bindName = bindName.substring(1);
      transform = val => !!val
    }
    else {
      transform = val => !val
    }
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
    if (initialUseAttr === invalidPathSymbol)
      return false
    onChange(initialUseAttr, transform, useValue, forwardVal)
    let handleChange = (newVal) => onChange(newVal, transform, useValue, forwardVal)
    addPathObserver(path, handleChange)
  } else {
    return fnEval(bindName, bindArgsStr, scope, prefixes, transform, onChange)
  }
  return true
}
