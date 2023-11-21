import { bracketEval, get_prop, addPathObserver} from './utils.js'
import {attach_event_obs} from './event_binding.js'


const attach_attr_obs = (attrName, query, node, scope) => {
  let [path, negate, useValue, forwardVal, localScope] = bracketEval(query, scope)
  if (path === undefined)
    return
  let onchange = (newVal) => {
    if (negate)
      newVal = !newVal
    if (useValue) {
      newVal === false ? node.removeAttribute(attrName) : node.setAttribute(attrName, newVal===true ? '': newVal)
    } else {
      newVal ? node.setAttribute(attrName, forwardVal) : node.removeAttribute(attrName)
    }
}

  let initialUseAttr = get_prop(localScope, path)
  onchange(initialUseAttr)
  //updateAttr(node, initialUseAttr, attrName, forwardVal)
  addPathObserver(path, onchange)
}


export const attach_attributes_obs = (node, scope) => [...node.attributes].forEach(attr => {
  if (attr.name == "class") return

  if (attr.name[0] === '@') {
    attach_event_obs(attr.name.substring(1), attr.value, node, scope)
    node.removeAttribute(attr.name)
    return
  }


  attach_attr_obs(attr.name, attr.value, node, scope)
})
