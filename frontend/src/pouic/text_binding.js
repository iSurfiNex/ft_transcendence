import {extractPathScope, addPathObserver, get_prop, bracketEval} from './utils.js'

// Function to split a text node based on a regex pattern
export const bindTextNode = (scope, prefixes, textNode) => {
  const text = textNode.nodeValue;
  // TODO i've quickly added ":" to ignore css property between brackets, there should be a better way
  //const regexPattern = /\{([^}:]+)\}/g; // Regex to match text inside curly braces
  const regexPattern = /(\{\s*[a-zA-Z0-9_.\(\)\,\)]+\s*\})/;
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

      parentNode.insertAdjacentText("beforeend", "")
      let newTextNode = parentNode.lastChild
      let onTextChange = (varVal) => { newTextNode.nodeValue = varVal; }
      // if bracketEval returns false, the variable could not be found in the state, continue to the fallback value
      if (bracketEval(part, scope, prefixes, onTextChange))
        return
    }
    // fallback to just inserting the text
    parentNode.insertAdjacentText("beforeend", part);
  });

  // Remove the original text node
  parentNode.removeChild(textNode);
}
