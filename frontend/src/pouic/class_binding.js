import {bracketEval, get_prop, addPathObserver} from './utils.js'

const attach_class_obs = (scope, query, i, classList) => {
  let [path, negate, useValue, forwardVal, localScope] = bracketEval(query, scope)
  if (path === undefined)
    return

  classList.toggle(query, false)
  let onchange = (newVal) => {
    if (negate)
      val = !val
    if (useValue) {
      const oldVal = get_prop(localScope, path)
      if (oldVal !== newVal)
        classList.toggle(oldVal, false);
      classList.toggle(newVal, true);
    } else {
      classList.toggle(forwardVal, newVal);
    }
  }
  let initialUseClass = get_prop(localScope, path)
  onchange(initialUseClass)
  addPathObserver(path, onchange)
}

export const attach_classes_obs = (node, scope) => node.classList.forEach(attach_class_obs.bind(null, scope))
