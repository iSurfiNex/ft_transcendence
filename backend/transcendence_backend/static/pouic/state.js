import {get_prop, cbSymbol, autoFn, setState} from './utils.js'
import {observers} from './observer.js'
import {addPathObserver} from './utils.js'

const callObsCbRecurse = (obs, newValue, oldValue) => {
  for (const [key, childObs] of Object.entries(obs)) {
    let newSubValue = newValue ==undefined ? newValue: newValue[key]
    let oldSubValue = oldValue ==undefined ? oldValue: oldValue[key]
    callObsCbRecurse(childObs, newSubValue, oldSubValue)
  }
  let obsCb = obs[cbSymbol]
  if (!obsCb)
    return
  for (const oCb of obsCb)
    oCb(newValue, oldValue)
}

const buildPaths = (item) => {
   const entries = Object.entries(item.nodes)
   if (entries.length === 0){
     return [[]];
   }
   return entries.map( ([key, prevHandler]) => buildPaths(prevHandler).map(paths => [ ...paths, key])).flat()
 }

const getHandler = (nodes = {}) => ({
  nextProxies: {},
  nodes,
  get paths() {return buildPaths(this)},
  pathsTo(key) {return this.paths.map(path => [...path, key])},
  get(target, key, receiver) {
    if (key === "__handler"){
      return this
    }
    const value = Reflect.get(target,key)
    if (typeof value !== 'object' || value === null)
      return value;
    /*TODO Better let the target predefine a custom proxy handler rather than cheking this for every access*/
    if (("__proxyFilter" in target) && !target['__proxyFilter'](key))
        return value
    let nextProxy = this.nextProxies[key]
    if (nextProxy) {
      return nextProxy
    }

    /*This detects and prepare computed property at initialization*/
    if ('__computedProperty' in value) {
      const fullpath = [...this.paths[0], key]
      declareComputedProperty(fullpath, value.__computedProperty.observedPaths, value.__computedProperty.fn)
      return Reflect.get(target,key) // the target has been modify by the previous line, recall the getter to get the new value
    }
    if ('__observedProperty' in value) {
      const fullpath = [...this.paths[0], key]
      addPathObserver(fullpath, value.__observedProperty.callback);
      Reflect.set(target,key, value.__observedProperty.initialValue)
      return value.__observedProperty.initialValue // the target has been modify by the previous line, recall the getter to get the new value
    }
    let nextHandler = getHandler({[key]:this})
    nextProxy = new Proxy(Reflect.get(target,key), nextHandler)
    this.nextProxies[key] = nextProxy
    return nextProxy
  },
  //deleteProperty(target, property) {
  //},
  set(target, key, value, receiver) {
    let paths;
    const oldValue = Reflect.get(target, key)
    if (value == undefined) {
      if (key in this.nextProxies)
      {
        delete this.nextProxies[key].__handler.nodes[key]
        delete this.nextProxies[key]
      }
      paths = this.pathsTo(key)
      Reflect.set(target, key, value)
      target[key] = value // TODO use Reflect.set(target, 'key', value) ?
    } else if (value.__handler) {
      delete this.nextProxies[key]?.__handler.nodes[key] // delete any previous link
      paths = this.pathsTo(key)
      target[key] = value
      value.__handler.nodes[key] = (this)
      this.nextProxies[key] = value
    } else {
        delete this.nextProxies[key] // TODO do it also when value == undefined ?
      /*TODO deep copy, be awre of desynchronisation of variable with subproperties*/
      if (target[key] != null && typeof target[key] === 'object')
        {

         if ('__observedProperty' in target[key]) // override the initial value if it is observed
           {
           target[key] = value
            return
           }
//         if ('__computedProperty' in target[key]) // override the initial value if it is computed
//           target[key] = value
//         else
           target[key] = value
           // Object.assign(target[key], value)

      }
      else {
          target[key] = value // TODO find if any difference with Reflect.set(target, key, value)
        }

      paths = this.pathsTo(key)
    }

    paths.map(path => {
      let obs = get_prop(observers, path)
      if (obs)
        callObsCbRecurse(obs, value, oldValue)
      })


    return true
  }
})

export const setup = (state_base) => {
  const state = new Proxy(state_base, getHandler())
  window.state = state
  return state
}

export const observe = (path, cb) => {
  addPathObserver(path.split('.'), cb);
}

export function declareComputedProperty(varPath,observedPaths, fn) {
  const fnCb = (...args) => {
    const syncValue = fn.bind(window.state)(...args)
    setState(varPath, syncValue)
  }
  if (!autoFn(fnCb, observedPaths, window.state, {})) // TODO better state referencing
  {
    console.warn("Computed property could not be initialized.\npath: \""+varPath+"\"\nobserved: ["+observedPaths.join(', ')+"]") // TODO better error system and explanation
  }
}

function computedProperty(observedPaths, fn, prefixStr)
{
  if (prefixStr){
    observedPaths = observedPaths.map(part => prefixStr + "." + part)
    }
  return {__computedProperty: {observedPaths, fn}}
}
computedProperty.basePath = (prefix) => (observedPaths, fn) => computedProperty(observedPaths, fn, prefix)
export {computedProperty}

export function withObserver(initialValue, callback) {
  return {__observedProperty: {initialValue, callback}}
}
