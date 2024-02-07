import {bindAttr, bindText} from './binding.js'
        import {evalRepeat} from './repeat_binding.js'
import {observe} from './state.js'

export class Component extends HTMLElement {
    constructor() {
      super();
      if (this.constructor.templateEl) {
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(this.constructor.templateEl.content.cloneNode(true));

        if(this.constructor.sheets)
          this.constructor.sheets.forEach(p => p.then(sheetReady => shadowRoot.adoptedStyleSheets.push(sheetReady)));
        evalRepeat(shadowRoot, this)
        bindAttr(shadowRoot, this, true)
        bindText(shadowRoot, this)
      }

      if (this.observers) {
        for (const  [key, value] of Object.entries(this.observers)) {
          observe(key, value)
        }
      }
    }
    get state() {
      return window.state
    }
  }

const camelToDashCase = (input)=> {
  return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export const register = (TargetClass, name) => {
  if (!name)
     name = camelToDashCase(TargetClass.name);
  if (TargetClass.template)
  {
    TargetClass.templateEl = document.createElement('template');
    TargetClass.templateEl.innerHTML = TargetClass.template

  }
    if (TargetClass.css) {
      const sheet = new CSSStyleSheet();
      const sheetPromise = sheet.replace(TargetClass.css)
      if (!TargetClass.sheets)
        TargetClass.sheets = [sheetPromise]
      else
        TargetClass.sheets.push(sheetPromise)
    }
  customElements.define(name, TargetClass)
}

export const pouic = (name, html, css) => {
  const Cls = class extends Component {
    static template = html
    static css = css
  }
  register(Cls, name)
  return Cls
}
