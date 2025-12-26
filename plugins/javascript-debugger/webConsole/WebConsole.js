
class NavigatablesHost {
  constructor() {
    this.firstNavigatable = null;
    this.lastNavigatable = null;
  }

  addNavigatable(item) {
    if (this.lastNavigatable) {
      this.lastNavigatable.nextNavigatable = item;
      item.prevNavigatable = this.lastNavigatable;
    }
    item.navigatableHost = this;
    if (!this.firstNavigatable) {
      this.firstNavigatable = item;
    }
    this.lastNavigatable = item;
  }

  addNavigatableBefore(nextItem, newItem) {
    if (nextItem.prevNavigatable) {
      nextItem.prevNavigatable.nextNavigatable = newItem;
      newItem.prevNavigatable = nextItem.prevNavigatable;
    } else if (this.firstNavigatable === nextItem) {
      this.firstNavigatable = newItem;
    }
    newItem.navigatableHost = this;
    nextItem.prevNavigatable = newItem;
    newItem.nextNavigatable = nextItem;
  }

  getPreviousNavigatable(current) {
    let prev = null;
    if (current) {
      prev = current.prevNavigatable;
      while (prev) {
        let elem;
        if (prev instanceof NavigatablesHost) {
          elem = prev.getFirstNavigatable();
        } else {
          elem = prev;
        }
        if (!isHidden(elem)) {
          break;
        }
        prev = prev.prevNavigatable;
      }
    }
    if (prev instanceof NavigatablesHost) {
      return prev.getLastNavigatable();
    }

    if (!prev && this.navigatableHost) {
      return this.navigatableHost.getPreviousNavigatable(this);
    }

    return prev;
  }

  getNextNavigatable(current) {
    let next = null;
    if (current) {
      next = current.nextNavigatable;
      while (next) {
        let elem;
        if (next instanceof NavigatablesHost) {
          elem = next.getFirstNavigatable();
        } else {
          elem = next;
        }
        if (!isHidden(elem)) {
          break;
        }
        next = next.nextNavigatable;
      }
    }
    if (next instanceof NavigatablesHost) {
      return next.getFirstNavigatable();
    }

    if (!next && this.navigatableHost) {
      return this.navigatableHost.getNextNavigatable(this);
    }

    return next;
  }

  getFirstNavigatable() {
    let first = this.firstNavigatable;
    while (first) {
      let elem;
      if (first instanceof NavigatablesHost) {
        elem = first.getFirstNavigatable();
      } else {
        elem = first;
      }
      if (!isHidden(elem)) {
        break;
      }
      first = first.nextNavigatable;
    }
    if (first instanceof NavigatablesHost) {
      return first.getFirstNavigatable();
    }
    return first;
  }

  getLastNavigatable() {
    let last = this.lastNavigatable;
    while (last) {
      let elem;
      if (last instanceof NavigatablesHost) {
        elem = last.getFirstNavigatable();
      } else {
        elem = last;
      }
      if (!isHidden(elem)) {
        break;
      }
      last = last.prevNavigatable;
    }
    if (last instanceof NavigatablesHost) {
      return last.getLastNavigatable();
    }
    return last;
  }
}


class WebConsole extends NavigatablesHost {

  constructor() {
    super();
    this.messageContainer = document.getElementById("out");
    this.renderedMessages = 0;
    this._stickToEnd = true;
    this.scrollStickGapSize = 60;
    document.addEventListener('scroll', this._onScroll.bind(this), false);
    document.addEventListener('mousedown', this._onMouseDown.bind(this), false);
    document.onkeydown = this._onKeyEvent.bind(this);
    this.rootGroup = new Group(this.messageContainer, null);
    this.currentGroup = this.rootGroup;
    this.maxRenderedCount = 2000;
    this.deferredMap = new Map();
    this.selectedElement = undefined;
    this.firstMessage = undefined;
  }

  _onKeyEvent(e) {
    e = e || window.event;
    let consume = false;
    if (e.keyCode === KEY_UP) {
      consume = true;
      this._selectUp();
    } else if (e.keyCode === KEY_DOWN) {
      consume = true;
      this._selectDown();
    } else if (e.keyCode === KEY_LEFT) {
      let current = this.selectedElement;
      while (current) {
        if (current && current.collapseAction && current.collapseAction()) {
          consume = true;
          this._select(current.getFirstNavigatable());
          break;
        } else {
          current = current.navigatableHost;
        }
      }
    } else if (e.keyCode === KEY_RIGHT) {
      let current = this.selectedElement;
      while (current) {
        if (current && current.expandAction && current.expandAction()) {
          consume = true;
          this._select(current.getFirstNavigatable());
          break;
        } else {
          current = current.navigatableHost;
        }
      }
    } else if (e.keyCode === KEY_ENTER) {
      if (this.selectedElement && this.selectedElement.navigateAction) {
        consume = true;
        this.selectedElement.navigateAction()
      }
    }
    if (consume) {
      e.preventDefault();
    }
  }

  /**
   * @param {number} count
   */
  setMaxRenderedCount(count) {
    this.maxRenderedCount = count;
  }

  /**
   * @return {!WebConsole}
   */
  static instance() {
    if (!WebConsole._instance)
      WebConsole._instance = new WebConsole();
    return WebConsole._instance;
  }

  /**
   * @param {boolean} value
   */
  setStickToEnd(value) {
    this._stickToEnd = value;
    setTimeout(() => {
      this._stickToEnd = value;
      if (value) {
        this.scrollDown();
      }
    },0);
  }

  /**
   * @param {!Event} event
   */
  _onScroll(event) {
    let bottom = document.scrollingElement.scrollHeight - window.innerHeight;
    let curY = document.scrollingElement.scrollTop;
    let stick = bottom - curY < this.scrollStickGapSize;
    if (stick !== this._stickToEnd) {
      this._stickToEnd = stick;
      WebConsole._notifyStickToEndChange(stick);
    }
  }

  /**
   * @param {!Event} event
   */
  _onMouseDown(event) {
    let clickY = document.scrollingElement.scrollTop + event.clientY;
    if (this._stickToEnd && document.scrollingElement.scrollHeight - clickY > this.scrollStickGapSize) {
      this._stickToEnd = false;
      WebConsole._notifyStickToEndChange(this._stickToEnd);
    }
  }

  /**
   * @param {boolean} state
   */
  static _notifyStickToEndChange(state) {
    callJVM("updateStickToEnd", [state]);
  }

  scrollDown() {
    const scrollingElement = this.scrollingElement();
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
  }

  scrollingElement() {
    return document.scrollingElement || document.body;
  }

  increaseLastMessageRepeatCount() {
    let message = this.lastMessage;
    if (message.repeatCounter) {
      message.repeatCounter.increase()
    } else {
      message.repeatCounter = new RepeatCounter();
      message.container.classList.add("repeated-message");
      message.container.insertAdjacentElement('beforebegin', message.repeatCounter.container);
    }
  }

  /**
   * @param {string} text
   * @param {boolean} caseSensitive
   */
  findText(text, caseSensitive) {
    return findText("#out", text, caseSensitive);
  }

  findNext() {
    findNext();
  }

  findPrev() {
    findPrev();
  }

  softWrap(state) {
    document.getElementById("out").style.whiteSpace = state === true ? "pre-wrap" : "no-wrap";
  }

  clear() {
    let root = this.messageContainer.parentNode;
    this.messageContainer.remove();
    this.messageContainer = createElement("div");
    this.messageContainer.id = "out";
    root.appendChild(this.messageContainer);
    /** @var {Message} */
    this.lastMessage = undefined;
    this.rootGroup = new Group(this.messageContainer, null);
    this.currentGroup = this.rootGroup;
    this.renderedMessages = 0;
    this.deferredMap.clear();
  }

  startTrace() {
    let currentMessage = this.getCurrentMessage();
    let currentContainer = currentMessage.container;
    currentContainer.classList.add("trace");
    currentContainer.classList.add("collapsed");
    let groupContainer = createElement("div", "group-container");
    let preview = createElement("span", "preview");

    currentContainer.insertBefore(preview, WebConsole.isIcon(currentContainer.firstChild)
                                       ? currentContainer.firstChild.nextSibling
                                       : currentContainer.firstChild);

    while (preview.nextSibling) {
      let nextSibling = preview.nextSibling;
      nextSibling.remove();
      preview.appendChild(nextSibling);
    }

    currentContainer.appendChild(groupContainer);
    currentContainer.onclick = (event) => {
      toggle_visibility(currentContainer)
    };

    currentMessage.expandAction = () => expand(currentContainer)
    currentMessage.collapseAction = () => collapse(currentContainer)

    currentMessage.container = groupContainer;
    currentMessage.savedContainer = currentContainer;
  }

  static isIcon(element) {
    return element.classList.contains("result-icon");
  }

  endTrace() {
    let currentMessage = this.getCurrentMessage();
    currentMessage.container = currentMessage.savedContainer;
  }

  startGroup(groupName, collapsed) {
    let state = collapsed ? "collapsed" : "expanded";
    let currentMessage = this.getCurrentMessage();
    let container = currentMessage.container;
    container.classList.remove("message");
    container.classList.add("group");
    container.classList.add(state);

    let title = createElement("span", "preview");
    title.appendChild(document.createTextNode(groupName));
    let groupContainer = createElement("div", "group-container");
    container.appendChild(title);
    container.appendChild(groupContainer);
    let clickHandler = (event) => {
      event.stopPropagation();
      toggle_visibility(container);
    };
    title.onclick = clickHandler;
    container.onclick = (event) => {
      if (event.target !== event.currentTarget) return;
      clickHandler(event);
    };

    currentMessage.expandAction = () => expand(container)
    currentMessage.collapseAction = () => collapse(container)

    this.currentGroup = new Group(groupContainer, this.currentGroup);
  }

  endGroup() {
    if (this.currentGroup.parent) {
      this.currentGroup = this.currentGroup.parent;
    }
  }

  startMessage(type, level, source) {
    this._addMessage(new Message(type, level, source));
  }

  /**
   * @param {Printable} printable
   */
  print(printable) {
    let currentMessage = this.getCurrentMessage();
    let newNode = this._prepareNode(printable, currentMessage);

    if (printable.deferred) {
      newNode.message = currentMessage;
      this.deferredMap.set(printable.id, newNode);
    }
    let currentBlock = currentMessage.container;
    if (printable.type === PRINTABLE_TYPES.MESSAGE_LINK) {
      currentBlock.insertAdjacentElement("beforebegin", newNode);
    } else {
      currentBlock.appendChild(newNode);
    }
  }

  /**
   * @param {Printable} printable
   */
  _prepareNode(printable, currentMessage) {
    let newNode;
    if (isLinkType(printable.type)) {
      newNode = createTextNode(printable);
      newNode.onclick = (e) => {
        e.stopPropagation();
        callJVM("navigate", [printable.id]);
      };
      newNode.navigatable = true;
      newNode.navigateAction = () => {callJVM("navigate", [printable.id])};
      currentMessage.addNavigatable(newNode);
    }
    else if (printable.type === PRINTABLE_TYPES.TREE) {
      let treeView = new TreeView(printable, this);
      newNode = treeView.rootElement();
      currentMessage.addNavigatable(treeView.rootItem);
    }
    else {
      newNode = createTextNode(printable);
      if (printable.iconURL != null) {
        let icon = WebConsole._createDynamicIcon(printable, "node-icon");
        newNode.insertAdjacentElement("afterbegin", icon);
      }
    }
    newNode.classList.add(...printable.styleClasses);
    return newNode;
  }

  /**
   * @param {Printable} newPrintable
   */
  resolveDeferred(newPrintable) {
    let currentNode = this.deferredMap.get(newPrintable.deferredID);
    let currentMessage = currentNode.message;
    this.deferredMap.delete(newPrintable.deferredID);
    let newNode = this._prepareNode(newPrintable, currentMessage);
    currentNode.parentNode.replaceChild(newNode, currentNode);
  }

  /**
   * @returns {Message}
   */
  getCurrentMessage() {
    if (!this.lastMessage) {
      this._addMessage(new Message());
    }
    return this.lastMessage;
  }

  static _createIcon(...styles) {
    return createElement("span", "icon", ...styles);
  }

  static _createDynamicIcon(valueMessage, ...styles) {
    let iconElement = WebConsole._createIcon(...styles)
    iconElement.style.backgroundImage = 'url(' + valueMessage.iconURL + ')';
    return iconElement;
  }

  /**
   * @param {Message} message
   * @private
   */
  _addMessage(message) {
    if (!this.firstMessage) {
      this.firstMessage = message;
    }
    message.root.onclick = (event) => {
      if (event.target !== event.currentTarget) return;
      this.selectedMessage = message;
      this._select(message.root);
    };


    this.addNavigatable(message);
    this.lastMessage = message;
    this.currentGroup.add(message);

    // groups counted as one rendered message
    if (this.rootGroup === this.currentGroup) {
      this.renderedMessages++;
    }
    if (this.renderedMessages > this.maxRenderedCount) {
      this.hideMessages();
    }
  }

  /**
   * @param {Element} element
   * @private
   */
  _select(element) {
    if (this.selectedElement) {
      this.selectedElement.classList.remove("selected");
    }
    if (element) {
      element.classList.add("selected");
      element.scrollIntoViewIfNeeded(false);
    }
    this.selectedElement = element;
  }

  _selectUp() {
    let next;
    if (this.selectedElement) {
      next = this.selectedElement.navigatableHost.getPreviousNavigatable(this.selectedElement);
    } else {
      next = this.getLastNavigatable();
    }
    this._select(next);
  }

  _selectDown() {
    let next;
    if (this.selectedElement) {
      next = this.selectedElement.navigatableHost.getNextNavigatable(this.selectedElement);
    } else {
      next = this.getFirstNavigatable();
    }
    this._select(next);
  }

  hideMessages() {
    if (this.renderedMessages <= this.maxRenderedCount) return;

    const singleRun = this.renderedMessages - this.maxRenderedCount;
    let messagesHolder;
    if (this.messageContainer.firstChild.class instanceof MessagesHolder
        && this.messageContainer.firstChild.class.savedMessages.length < this.maxRenderedCount) {
      messagesHolder = this.messageContainer.firstChild.class;
    } else {
      messagesHolder = new MessagesHolder();
      this.messageContainer.insertBefore(messagesHolder.root, this.messageContainer.firstChild);
    }

    let currentMessage = this.messageContainer.firstChild.nextSibling;
    let next = currentMessage.nextSibling;
    for (let i = 0; i < singleRun && next; i++) {
        currentMessage.remove();
        this.renderedMessages--;
        messagesHolder.savedMessages.push(currentMessage);
        currentMessage = next;
        next = currentMessage.nextSibling;
    }
  }
}

class Message extends NavigatablesHost {
  constructor(type, level, source) {
    super();
    this.container = createElement("div", "message");
    this.root = createElement("div", "message-wrapper");
    this.root.appendChild(this.container);
    this.addNavigatable(this.root);

    if (level === 'level-error' || level === 'level-warning' || level === 'level-info') {
      this.setIcon(WebConsole._createIcon("result-icon"));
    }
    else if (type === 'EVAL_IN') {
      this.root.classList.add("message-input");
      this.setIcon(WebConsole._createIcon("prompt-in", "result-icon"));
    } else if (type === 'EVAL_OUT') {
      this.root.classList.add("message-result");
      this.setIcon(WebConsole._createIcon("prompt-out", "result-icon"));
    }
    this.root.classList.add(level);
    this.root.classList.add(source);
  }

  setIcon(icon) {
    this.icon = icon;
    this.container.appendChild(icon);
  }

}

class Group {
  /**
   * @param {!Element} container
   * @param {?Group} parent
   */
  constructor(container, parent) {
    this.container = container;
    this.parent = parent;
  }

  /**
   * @param {!Message} message
   */
  add(message) {
    this.container.appendChild(message.root);
    message.root.group = this;
  }

}

class MessagesHolder {
  constructor() {
    this.root = createElement("div", "saved-messages");
    this.root.appendChild(document.createTextNode("Show previous logs"));
    this.root.addEventListener("click", this.expand.bind(this));
    this.savedMessages = [];
    this.root.class = this;

  }

  expand() {
    let parent = this.root.parentElement;
    let anchor = this.root;
    for (let message of this.savedMessages) {
      parent.insertBefore(message, anchor);
    }
    this.savedMessages = [];
    this.root.remove();
  }

}

class RepeatCounter {

  constructor() {
    this.count = 2;
    this.container = createElement("label", "repeat-counter");
    this.container.textContent = this.count;
  }

  increase() {
    this.count++;
    this.container.textContent = this.count;
  }

}
