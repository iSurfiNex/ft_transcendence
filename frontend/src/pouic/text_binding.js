import {extractPathScope, addPathObserver, get_prop} from './utils.js'

// Function to split a text node based on a regex pattern
export const bindTextNode = (scope, prefixes, textNode) => {
  const text = textNode.nodeValue;
  // TODO i've quickly added ":" to ignore css property between brackets, there should be a better way
  //const regexPattern = /\{([^}:]+)\}/g; // Regex to match text inside curly braces
  const regexPattern = /\{\s*([a-zA-Z0-9_.]+)\s*\}/;
  const matches = text.split(regexPattern);
  if (matches.length < 2)
    return

  // Clear the existing content of the text node
  textNode.nodeValue = '';
  var parentNode = textNode.parentElement

  // Create and append individual text nodes for each part
  matches.forEach((part, index) => {
    if (index % 2 === 1) {
      // This is a match (text inside brackets),

      let path = part.split('.')
      let varScope = extractPathScope(path, scope, prefixes)
      //let newTextNode = document.createTextNode(get_prop(varScope, path));
      //textNode.parentNode.insertBefore(newTextNode, textNode.nextSibling);
      parentNode.insertAdjacentText("beforeend", get_prop(varScope, path));
      let newTextNode = parentNode.lastChild
      let onchange = (varVal) => { newTextNode.nodeValue = varVal; }
      addPathObserver(path, onchange)
    }
    else {
      parentNode.insertAdjacentText("beforeend", part);
      //let otherTextNode = document.createTextNode(part);
      //parentNode.insertBefore(otherTextNode, textNode.nextSibling);
    }

  });

  // Remove the original text node
  parentNode.removeChild(textNode);
}
