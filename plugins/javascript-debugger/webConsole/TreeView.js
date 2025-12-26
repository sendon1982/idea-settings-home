
class TreeView {
  /**
   * @param {Printable} printable
   * @param {WebConsole} console
   */
  constructor(printable, console) {
    this.console = console;
    this.container = createElement("div", "tree-view");
    this.list = createElement("ul", "tree-root");
    this.valueID = printable.id;
    this.rootItem = this.treeItem(printable);
    this.list.appendChild(this.rootItem.container);
    this.container.appendChild(this.list);
  }

  treeItem(printable) {
    let item = new Item(printable, this);
    return item;
  }

  rootElement() {
    return this.container;
  }

}

class Item extends NavigatablesHost {
  constructor(printable, tree) {
    super();
    this.tree = tree;
    this.printable = printable;
    this.container = createElement("li", "tree-item");
    let state = this.hasChildren() ? 'collapsed' : "leaf";
    this.container.classList.add(state);

    this.addNavigatable(this.container);
    this.expandAction = () => this.expand();
    this.collapseAction = () => this.collapse();

    let preview = createTextNode(printable);
    preview.classList.add("preview");
    preview.classList.add(...printable.styleClasses);
    if (printable.iconURL != null) {
      let iconElement = WebConsole._createDynamicIcon(printable, "node-icon");
      preview.insertAdjacentElement("afterbegin", iconElement);
    }
    this.container.appendChild(preview);

    if (this.hasChildren()) {
      this.collapsed = true;

      let childrenElem = createElement("ul", "group-container");
      this.childContainer = childrenElem;
      this.childrenItems = [];
      this.container.appendChild(childrenElem);
      let clickHandler = (event) => {
        event.stopPropagation();
        if (this.collapsed) {
          this.expand();
        } else {
          this.collapse();
        }
      };
      preview.onclick = clickHandler;
      this.container.onclick = (event) => {
        if (event.target !== event.currentTarget) return;
        clickHandler(event);
      }
    } else if (printable.type === PRINTABLE_TYPES.TREE_LINK) {
      let navigate = (e) => {
        callJVM("nodeLinkClick", [this.printable.id]);
      };
      this.container.navigateAction = navigate;
      preview.onclick = navigate;
    }
  }

  hasChildren() {
    return this.printable.type === PRINTABLE_TYPES.TREE;
  }

  expand() {
    if (this.collapsed && this.hasChildren()) {
      let callbackId = callJVM('expand', [this.printable.id], ([add, children]) => {
        if (add) {
          for (let childAndIndex of children) {
            let childPrintable = childAndIndex.first;
            let childItem = new Item(childPrintable);
            if (childPrintable.type === PRINTABLE_TYPES.MESSAGE_TREE_NODE) {
              let navigate = (event) => {
                callJVM('messageNodeCallback', [childPrintable.id]);
              };
              childItem.container.ondblclick = navigate;
              childItem.navigateAction = navigate;
            }
            this.addChild(childAndIndex.second, childItem);
          }
        }
        else {
          for (let index of children) {
            this.childrenItems.splice(index, 1);
            this.childContainer.removeChild(this.childContainer.childNodes[index]);
          }
        }
      }, true);
      this.callbackId = callbackId;
      toggle_visibility(this.container);
      this.collapsed = false;
      return true;
    }
    return false;
  }

  addChild(index, childItem) {
    if (index != null && index < this.childrenItems.length ) {
      let prevChild = this.childrenItems[index];
      this.childContainer.insertBefore(childItem.container, prevChild.container);
      this.childrenItems.splice(index, 0, childItem);
      this.addNavigatableBefore(prevChild, childItem);
    } else {
      this.addNavigatable(childItem);
      this.childContainer.appendChild(childItem.container);
      this.childrenItems.push(childItem);
    }
  }

  collapse() {
    if (!this.collapsed && this.hasChildren()) {
      clearContainer(this.childContainer);
      callbackMap.delete(this.callbackId);
      callJVM("collapse", [this.printable.id]);
      toggle_visibility(this.container);
      this.collapsed = true;
      this.firstNavigatable.nextNavigatable = null;
      this.lastNavigatable = this.firstNavigatable;
      return true;
    }
    return false;
  }

}