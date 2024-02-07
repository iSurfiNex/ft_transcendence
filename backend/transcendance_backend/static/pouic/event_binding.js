import {evalBindVar, extractPathScope, get_prop } from './utils.js'

export const attach_event_obs = (eventName, fnStr, node, scope, prefixes) => {
  const regex = /^([a-zA-Z0-9_\.]*)\(([^)]*)\)$/;
  const match = fnStr.match(regex);
  if (!match) {
    console.warn(fnStr + " is not a valid function call")
    return
  }
  const fnPathStr = match[1];
  const fnPathArr = fnPathStr.split('.')
  const fnLocalScope = extractPathScope(fnPathArr, scope, prefixes)
  const argsStr = match[2];
  const args = argsStr.split(',').map(arg => arg.trim());
  const evaledArgs = []
  const fnName = fnPathArr.pop()
  const onEvent = e => {
    /* Get the fn parent in order to keep the correct this binded when calling the function. */
    let fnHolder = get_prop(fnLocalScope, fnPathArr)
    if (typeof fnHolder[fnName] !== 'function') {
      console.warn("No function "+fnName+" at path \"" + fnPathStr + "\" in scope", fnLocalScope,  fnPathArr, fnHolder, fnName)
      return;
    }

    //fn = fn.bind(fnLocalScope)
    args.forEach((val, i) => {
      if (val === "event") {
        evaledArgs[i] = e
        return
      }
      else if (val === "node") {
        evaledArgs[i] = node
        return
      }
      const prop = evalBindVar(val, scope, prefixes)

      if (prop !== undefined)
          evaledArgs[i] = prop
      else
          evaledArgs[i] = args[i]
      })
      fnHolder[fnName](...evaledArgs)
  }
  if (eventName === "@attached")
    onEvent()
  else
    node.addEventListener(eventName, onEvent)
}
