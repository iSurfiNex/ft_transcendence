import { bracketEval } from './utils.js'
import { attach_event_obs } from './event_binding.js'

const attach_attr_obs = (attrName, query, node, scope, prefixes) => {
  const onAttrBindingChange = (newVal, transform, useValue, forwardVal) => {
    if (transform)
      newVal = transform(newVal)
    if (useValue) {
      (newVal === false || newVal == undefined )? node.removeAttribute(attrName) : node.setAttribute(attrName, newVal===true ? '': newVal)
    } else {
      newVal ? node.setAttribute(attrName, forwardVal) : node.removeAttribute(attrName)
    }
  }
  bracketEval(query, scope, prefixes, onAttrBindingChange)
}

export const attach_attributes_obs = (node, scope, prefixes) => [...node.attributes].forEach(attr => {
  if (attr.name == "class") return

  //if (attr.name === '@@context') {
  //  const contexts = attr.value.split(',')
  //  contexts.map(context => {
  //    const [key, pathStr] = context.trim().split(':')
  //    const path = pathStr.trim().split('.')
  //    prefixes[key] = path
  //  })

  //  console.log("==========================", attr.value, prefixes)
  //  return
  //}
  if (attr.name[0] === '@') {
    attach_event_obs(attr.name.substring(1), attr.value, node, scope, prefixes)
    node.removeAttribute(attr.name)
    return
  }

  attach_attr_obs(attr.name, attr.value, node, scope, prefixes)
})
