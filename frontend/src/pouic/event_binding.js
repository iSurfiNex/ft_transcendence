
export const attach_event_obs = (eventName, fnStr, node, scope) => {
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
  node.addEventListener(eventName, () => {
    if (typeof scope[fnName] !== 'function')
      console.warn(scope, " has no \"" + fnName + "\" function")
    else
      scope[fnName](...args)
  })
}
