import { VirtualNode } from "./virtual-node";

export function j(type, props, ...args) {
  const children = args.length ? [].concat(...args) : null;
  return {
    type,
    props: props || {},
    children
  };
}

/* ------------------------------------------------------------ */
let _rootElement = null
let _rootJsxElement = null
let _stateID = -1
const _states = []
let _virtualDOM = {}

function DomRoot(htmlElement) {
  _rootElement = htmlElement
}
DomRoot.prototype.render = function (children) {
  _rootJsxElement = children
  render(_rootElement, children)
}

function render(el, jsxElement, virtualNode = undefined) {
  if (typeof jsxElement === 'string' || typeof jsxElement === 'number') {
    const newContent = document.createTextNode(jsxElement);
    virtualNode.addNode(new VirtualNode(newContent, virtualNode, 'primitive', {}, jsxElement))
    return el.append(newContent)
  }

  if (typeof jsxElement.type === 'function') {
    return render(el, jsxElement.type(jsxElement.props), virtualNode)
  }

  const newNode = document.createElement(jsxElement.type)
  const vn = new VirtualNode(newNode, virtualNode, jsxElement.type, jsxElement.props)

  virtualNode ? virtualNode.addNode(vn) : _virtualDOM = vn 

  jsxElement.children &&
    jsxElement.children.forEach(child => {
      render(newNode, child, vn)
    });

  if (jsxElement.props) {
    const { className, onClick } = jsxElement.props
    className && newNode.setAttribute('class', className)
    onClick && newNode.addEventListener('click', function(event) { onClick(event) }, false)
  }

  el.append(newNode)
}

function update(virtualNode, newJsxElement) {
  let runUpdate = false
  if (virtualNode.type === 'primitive') {
    if(typeof newJsxElement === 'string' || typeof newJsxElement === 'number'){
      runUpdate = virtualNode.value !== newJsxElement
    }
  }

  if (typeof newJsxElement.type === 'function') {
    return update(virtualNode, newJsxElement.type(newJsxElement.props))
  }

  if(virtualNode.type !== 'primitive') {
    //Check virtual node 
    runUpdate = virtualNode.isDiff(newJsxElement)

    //Check childrens
    if(!runUpdate && newJsxElement.children) {
      if(!virtualNode.children ||virtualNode.children.length !== newJsxElement.children.length) {
        runUpdate = true
      } else {
        for (let index = 0; index < newJsxElement.children.length; index++) {
          const jsxChild = newJsxElement.children[index];
          const virtualChild = virtualNode.children[index];

          update(virtualChild, jsxChild)
        }
      }
    }
  }

  if (runUpdate) {
    let element = null
    let node = null

    if(virtualNode.type === 'primitive') {
      node = virtualNode.parentNode
      node.removeNode(virtualNode)
      element = node.el
      element.innerHTML = ""
      render(element, newJsxElement, node)

    } else {
      virtualNode.el.innerHTML = ""
      virtualNode.removeAllChildren()

      newJsxElement.children &&
      newJsxElement.children.forEach(child => {
        render(virtualNode.el, child, virtualNode)
      });
    }
  }
}

function updateDOM() {
  _stateID = -1
  update(_virtualDOM, _rootJsxElement)
}

function useState(initialState) {
  const id = ++_stateID

  if (_states[id] === undefined) {
    _states[id] = initialState
  }

  const setValue = (callback) => {
    _states[id] = callback(_states[id])
    return updateDOM()
  }
  
  return [
    _states[id],
    setValue
  ]
}

function createRoot(htmlElement) {
  return new DomRoot(htmlElement)
}

const ReactDOM = {
  createRoot,
  useState
}

export default ReactDOM