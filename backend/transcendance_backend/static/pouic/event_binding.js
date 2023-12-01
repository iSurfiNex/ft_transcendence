import { get_prop, extractPathScope } from './utils.js'

export const attach_event_obs = (eventName, fnStr, node, scope, prefixes) => {
  if (fnStr.startsWith("this."))
    fnStr = fnStr.substring(5);
  else
    scope = window.state
  const regex = /^([a-zA-Z_$][a-zA-Z0-9_$]*)\(([^)]*)\)$/;
  const match = fnStr.match(regex);
  if (!match) {
    console.warn(fnStr + " is not a valid function call")
    return
  }
  const fnName = match[1];
  const argsStr = match[2];
  const args = argsStr.split(',').map(arg => arg.trim());
  const toto = []
  node.addEventListener(eventName, e => {
    if (typeof scope[fnName] !== 'function')
      console.warn(scope, " has no \"" + fnName + "\" function")
    else {
      args.forEach((val, i) => {
        if (val == "event") {
          toto[i] = e
          return
        }
        const path = val.split('.')
        const localScope = extractPathScope(path, scope, prefixes)
        const prop = get_prop(localScope, path)
        if (prop !== undefined)
            toto[i] = prop
        else
            toto[i] = args[i]
      })
      scope[fnName](...toto)
    }
  })
}
