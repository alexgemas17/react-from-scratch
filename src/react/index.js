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
let _stateID = 0
const _states = []
let _effectID = 0
const _effects = []
let _virtualDOM = {}
let _queueStateOps = []

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
    virtualNode.addNode(new VirtualNode(newContent, virtualNode, 'primitive', {}, `${jsxElement}`))
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
    const { className, onClick, ...others } = jsxElement.props
    className && newNode.setAttribute('class', className)
    onClick && newNode.addEventListener('click', function(event) { onClick(event) }, false)
    others && Object.entries(others).map(([key, value]) => newNode.setAttribute(key, value))
  }

  el.append(newNode)
}

function update(virtualNode, newJsxElement) {
  let runUpdate = false
  if (virtualNode.type === 'primitive') {
    if(typeof newJsxElement === 'string' || typeof newJsxElement === 'number'){
      const newValue = typeof newJsxElement === 'number' ? newJsxElement.toString() : newJsxElement
      runUpdate = virtualNode.value !== newValue
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
      virtualNode.el.remove()
      render(element, newJsxElement, node)
    } else {
      virtualNode.el.remove()
      virtualNode.removeAllChildren()
      virtualNode.parentNode.removeNode(virtualNode)
      
      render(virtualNode.parentNode.el, newJsxElement, virtualNode.parentNode)
      // newJsxElement.children &&
      // newJsxElement.children.forEach(child => {
      //   render(virtualNode.el, child, virtualNode)
      // });
    }
  }
}

function updateDOM() {
  _stateID = 0
  _effectID = 0
  update(_virtualDOM, _rootJsxElement)
}

function useState(initialState) {
  if (_states[_stateID] === undefined) {
    _states[_stateID] = initialState
  }

  const setStateId = _stateID
  const setValue = (callback) => {
    _states[setStateId] = callback(_states[setStateId])
    updateDOM()
  }
  
  return [
    _states[_stateID++],
    setValue
  ]
}

function useEffect(callback, newDepsArray) {
  const oldDepsArray = _effects[_effectID]
  const runEffect = oldDepsArray ? (newDepsArray.length !== 0 && !newDepsArray.every((dep, index) => dep === oldDepsArray[index]) ) : true
  if(runEffect) {
    callback()
    _effects[_effectID] = newDepsArray
  }
  _effectID++
}

function createRoot(htmlElement) {
  return new DomRoot(htmlElement)
}

const ReactDOM = {
  createRoot,
  useState,
  useEffect
}

export default ReactDOM