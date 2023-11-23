import {bracketEval, get_prop, addPathObserver} from './utils.js'

const attach_class_obs = (scope, prefixes, query, i, classList) => {
  let oldVal
  let onClassBindingChange = (newVal, negate, useValue, forwardVal) => {
    if (negate)
      val = !val
    if (useValue) {
      if (oldVal !== newVal)
        classList.toggle(oldVal, false);
      classList.toggle(newVal, true);
    } else {
      classList.toggle(forwardVal, newVal);
    }
    oldVal = newVal
  }
  let hasBinding = bracketEval(query, scope, prefixes, onClassBindingChange)
  if (hasBinding)
    classList.toggle(query, false)
}

export const attach_classes_obs = (node, scope, prefixes) => node.classList.forEach(attach_class_obs.bind(null, scope, prefixes))
