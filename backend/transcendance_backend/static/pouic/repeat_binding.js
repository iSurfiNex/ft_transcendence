import {extractPathScope, get_prop, isIterable, addPathObserver, invalidPathSymbol } from './utils.js'
import {bindText, bindAttr } from './binding.js'

export const evalRepeat = (node, scope, prefixes = {}) => {
  // Select all nodes with attribute "repeat" that does not have an ansestor with attribute repeat
  let elements = node.querySelectorAll("[repeat]:not([repeat] [repeat])")

  for (const el of elements) {
    let arrayPath = el.getAttribute("repeat")
    let as = el.getAttribute("as")

    arrayPath = arrayPath.split('.')
    let path = arrayPath.slice();
    let localScope = extractPathScope(path, scope, prefixes)
    el.removeAttribute("repeat")
    el.removeAttribute("as")

    let templateNode = el.firstElementChild // TODO copy all nodes, not juste the first
    let clone = templateNode.cloneNode(true)
    el.removeChild(templateNode);
    let nodePool = []
    let onchange = (newLen) => {
      if (newLen === undefined)
        newLen = 0
      if (!Number.isInteger(newLen)) // happens if (  initialVal === invalidPathSymbol)
        return

      //const len = Array.isArray(newVal) ? newVal.length : Object.keys(newVal).length
  // if (!isIterable(newVal)) {
      //  console.warn(newVal, "Value is not iterable")
      //  return
      //}

      let nodesDiff = newLen - nodePool.length
      // Restore pool nodes
      for (let i = 0; i < newLen && i < nodePool.length; i++)
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
          const next_prefixes = {...prefixes, [as]: [...arrayPath, nodePool.length - 1]}
          bindText(c, scope, next_prefixes)
          bindAttr(c, scope, true, next_prefixes)
          evalRepeat(c, scope, next_prefixes)

        }
      }
      else {
        const startIdx = nodePool.length + nodesDiff
        // Disconnect pool nodes if needed
        for (let i = startIdx; i < nodePool.length; i++) {
          el.removeChild(nodePool[i]);
        }
        nodePool.splice(startIdx, -nodesDiff)
      }
    }

    path.push('length')
    let initialVal = get_prop(localScope, path)
    onchange(initialVal)
    addPathObserver(path, onchange)
  }
}
