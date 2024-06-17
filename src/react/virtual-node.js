function isArrayNullOrEmpty(arr) {
  return arr === undefined || arr === null || arr.length === 0;
}
export class VirtualNode {
  /*
    jsxEl: {
        type: string
        props: Object
        children: Array
    } 
  */
  constructor(el, parentNode, type, props, value = undefined) {
    this.el = el;
    this.type = type;
    this.props = props;
    this.children = [];
    this.value = value;
    this.parentNode = parentNode;
  }

  addNode(node) {
    this.children.push(node);
    return this;
  }

  replace(newNode, oldNode) {
    const index = this.children.findIndex((c) => !c.isDiff(oldNode))
    if (index !== -1) {
      this.children[index] = newNode
    }
  }

  removeNode(node) {
    const index = this.children.findIndex((c) => c.el.isEqualNode(node.el));
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }

  removeAllChildren() {
    this.children = [];
  }

  isDiff(newJsxEl) {
    return this.#isTypeDiff(newJsxEl) || this.#isPropsDiff(newJsxEl);
  }

  #isTypeDiff(newJsxEl) {
    return newJsxEl.type !== this.type;
  }

  #isPropsDiff(newJsxEl) {
    return JSON.stringify(this.props) !== JSON.stringify(newJsxEl.props);
  }

  isChildrenDiff(newJsxEl) {
    if (typeof newJsxEl === "string" || typeof newJsxEl === "number") {
      if (this.type === 'primitive') {
        return false
      }

      const newValue =
        typeof newJsxEl === "number" ? newJsxEl.toString() : newJsxEl;
      return newValue !== this.value;
    }

    if (
      (isArrayNullOrEmpty(newJsxEl.children) &&
        !isArrayNullOrEmpty(this.children)) ||
      (!isArrayNullOrEmpty(newJsxEl.children) &&
        isArrayNullOrEmpty(this.children))
    )
      return true;

    return newJsxEl.children.length !== this.children.length;
  }
}
