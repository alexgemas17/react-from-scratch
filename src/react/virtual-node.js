export class VirtualNode {
    /*
        jsxEl: {
            type: string
            props: Object
            children: Array
        } 
    */
    constructor(el, parentNode, type, props, value = undefined) {
        this.el = el
        this.type = type
        this.props = props
        this.children = []
        this.value = value
        this.parentNode = parentNode
    }

    addNode(node) {
        this.children.push(node)
        return this
    }

    removeNode(node) {
        const index = this.children.findIndex(c => c.el.isEqualNode(node.el));
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    removeAllChildren() {
        this.children = []
    }

    isDiff(newJsxEl) {
        return this.#isTypeDiff(newJsxEl) || this.#isPropsDiff(newJsxEl)
    }

    #isTypeDiff(newJsxEl) {
        return newJsxEl.type !== this.type
    }

    #isPropsDiff(newJsxEl) {
        return JSON.stringify(this.props) !== JSON.stringify(newJsxEl.props);
    }
}