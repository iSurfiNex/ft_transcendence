# Pouic

Pouic is a micro-framework design to work with WebComponent. It provides DOM variable binding with a global state variable. When the state object is modifies, the DOM updates by it-self.

## Quickstart

You create a state with initial data,
``` js
// app.js
import {setup} from "pouic"

state_base = {
  getSlug: title => title.toLowerCase().replace(/\s/, "-");
  pages: {
    home: {
      active: true,
      title: "Home Page",
      content: "Hello World!"
    }
  },
  users: [
     {name: "toto", active: false},
     {name: "yolo", active: true},
  ]
}

const state = setup(state_base)
```

Declare a component by creating a class that inherit `Component` then call `register` to transform them into WebComponent
In the component template, you can use binding to synchronize the DOM with a state variable. Binding goes this way `{pages.home.title}`, inside the brackets, provide the dot-separated path to your variable.

``` js
// HelloWorld.js
import { Component, register } from 'pouic'

class MyPage extends Component {
  static template = `<h1>{pages.home.title}</h1>`
  static css = `span { background: red; }`
}

register(MyPage)
```

Then import and use your component.

``` html
<!-- index.html -->
<!doctype html>
<html>
    <my-page></my-page>

    <script type="importmap">
     {
         "imports": {
             "pouic": "./pouic/index.js"
         }
     }
    </script>
    <script src="app.js" type="module"></script>
    <script src="my-page.js" type="module"></script>
</html>
```

You class `MyPage` has been transform to `my-page`.

## Create a component

The spec impose webcomponent to have a name made of at least 2 words, dash-separated; The first word should be your namespace. So make your class have 2 words minimum.

There is 3 special type of static property you'll want to use:
- `template`: becomes the DOM content of your component
- `css`: styles that only affect your component
- `sheets`: preloaded styles that can be shared across Component efficiently

You can also define a `observers` dictionnary where key is a variable path and value a function to be called any time that variable changes

``` js
// my_shared_sheet.js
const sheet = new CSSStyleSheet();

const styles = `
  .toto {
    background: red;
  }
`

export const mySharedSheet = sheet.replace(styles);
```

``` js
// HelloWorld.js
import { Component, register } from 'pouic'
import {mySharedSheet} from './my_shared_sheet.js'


class MyPage extends Component {
  static template = `<h1>{pages.home.title}</h1>`
  static css = `span { background: red; }`
  static sheets = [mySharedSheet]
  observers = {
	my.var: newValue => console.log("value changed: ", newValue)
  }
}

register(MyPage)
```

Your component can also override it's constructor and make use of any WebComponent lifecycle method see the [MDN doc](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#using_the_lifecycle_callbacks).

## Binding features

Simple variable

`<h1>{pages.home.title}</h1>`

Bind element n of an array

`<h1>{users.0.name}</h1>`

Boolean to attribute

`<h1 hidden="{pages.home.active}">Am I shown ?</h1>`

Negate variable

`<h1 hidden="{!pages.home.active}">Am I shown ?</h1>`

Kind-of ternary

`<h1 hello="{pages.home.active?world}"></h1>`

function call with parameter path binding
any time `pages.home.title` changes, the dom is updated with the result of the function

`<h1>The page slug is {getSlug(pages.home.title)}></h1>`

component method call binding
Call your component method by adding `this.` prefix

`<h1>{this.myComponentMethod(pages.home.title)}></h1>`

multiple parameter is possible, it's called initially once, and then called when any of the variable changes. Be aware that if both variables changes, the method will be called twice.

`<h1 id="{getMyId(pages.home.title,another.variable)}"></h1>`

Note: if you change the method itself, the function will also be re-called

Class binding: when attribute binding can only have one `{myVar}`, class binding can have many
`<h1 class="{users.0.name} {users.1.name}"></h1>`

In class binding, if you use function binding with multiple parameter, pay attention not to include a space in the binding
NO => `<h1 id="{var1} {myFn(var2, var3)}"></h1>`
YES =>`<h1 id="{var2} {myFn(var2,var3)}"></h1>`

event binding is very basic
`<button @click="myFn()"`
will call fn any time the `click` event is received on this node


### Repeating

``` html
<div repeat="path.to.an.array" as="myItem">
  <h1>{myItem.subproperty}</h1>
</div>
```
You can use any binding feature inside the repeat on either text, attribute or class
Nested repeat are not yet supported
