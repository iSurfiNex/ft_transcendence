import {attach_classes_obs} from './class_binding.js'
import {attach_attributes_obs} from './attr_binding.js'
import {bindTextNode} from './text_binding.js'

const getAllDescTextNodes = (element, textNodes = []) => {
  for (const childNode of element.childNodes) {
    if (childNode.nodeType === Node.TEXT_NODE) {
      textNodes.push(childNode);
    } else if (childNode.nodeType === Node.ELEMENT_NODE) {
      getAllDescTextNodes(childNode, textNodes);
    }
  }
  return textNodes;
}

const attach_node_obs = (node, scope, prefixes) => {
  attach_classes_obs(node, scope, prefixes)
  attach_attributes_obs(node, scope, prefixes)
}

export const bindAttr = (node, scope, asParent = false, prefixes = {}) => {
  let nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT, null, false);
  if (!asParent)
    attach_node_obs(node, scope, prefixes)

  while (node = nodeIterator.nextNode()) {
    attach_node_obs(node, scope, prefixes)
  }
}

export const bindText = (node, scope, prefixes) => {
  let textNodes = getAllDescTextNodes(node)
  textNodes.forEach(bindTextNode.bind(null, scope, prefixes))
}
