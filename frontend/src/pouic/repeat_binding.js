import {extractPathScope, get_prop, isIterable, addPathObserver } from './utils.js'
import {bindText } from './binding.js'

export const evalRepeat = (node, scope) => {
  let elements = node.querySelectorAll("[repeat]")

  for (const el of elements) {
    let arrayPath = el.getAttribute("repeat")
    let as = el.getAttribute("as")

    arrayPath = arrayPath.split('.')
    let path = arrayPath.slice();
    let localScope = extractPathScope(path, scope)
    el.removeAttribute("repeat")
    el.removeAttribute("as")

    let templateNode = el.firstElementChild // TODO copy all nodes, not juste the first
    let clone = templateNode.cloneNode(true)
    el.removeChild(templateNode);
    let nodePool = []
    let onchange = (newVal) => {
      if (!isIterable(newVal)) {
        console.warn(newVal, "Value is not iterable")
        return
      }
      let nodesDiff = newVal.length - nodePool.length
      // Restore pool nodes
      for (let i = 0; i < newVal.length && i < nodePool.length; i++)
      {
        if (!nodePool[i].isConnected)
          el.appendChild(nodePool[i])
      }
      // Create new pool node if needed
      if (nodesDiff > 0) {
        for (let i = 0; i < nodesDiff; i++) {
          let c = clone.cloneNode(true)
          el.appendChild(c)
          nodePool.push(c)
          bindText(c, scope, { [as]: [...arrayPath, nodePool.length - 1] })
        }
      }
      else {
        // Disconnect pool nodes if needed
        for (let i = nodePool.length + nodesDiff; i < nodePool.length; i++) {
          el.removeChild(nodePool[i]);
        }
      }
    }

    let initialVal = get_prop(localScope, path)
    onchange(initialVal)
    addPathObserver(path, onchange)
  }
}
