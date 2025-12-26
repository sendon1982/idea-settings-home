const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_ENTER = 13;

/**
 * @param {PRINTABLE_TYPES} type
 * @returns {boolean}
 */
function isLinkType(type) {
  return type.endsWith("-link");
}

function toStringArray(arr) {
  return arr.map(el => el.toString());
}

// only for debugging
function _inspect(obj) {
  console.log("inspect: ", obj);
  if (obj) {
    console.log("isArray: "+ Array.isArray(obj));
    console.log("type: " + typeof (obj));
    console.log("json: " + JSON.stringify(obj));
    console.log("keys [ ");
    for (var k in obj) {
      console.log(k);
    }
    console.log(" ]");
  }
}

/**
 * @param {string} elementName
 * @param {string=} styles
 * @return {!Element}
 */
Element.prototype.createChild = function(elementName, ...styles) {
  const element = createElement(elementName, ...styles);
  this.appendChild(element);
  return element;
};

/**
 * @param {string} tag
 * @param {string=}styles
 * @return {!Element}
 */
function createElement(tag, ...styles) {
  const block = document.createElement(tag);
  block.classList.add(...styles);
  return block
}

/**
 * @param {!Element} container
 */
function clearContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

const userCssPrefixesWhiteList = [
  'background', 'border', 'color', 'font', 'line', 'margin', 'padding', 'text', '-webkit-background',
  '-webkit-border', '-webkit-font', '-webkit-margin', '-webkit-padding', '-webkit-text'
];

function addUserStyles(jsToken, node) {
  let userStyles = {};
  if (jsToken.userStyle) {
    const buffer = createElement('span');
    buffer.setAttribute('style', jsToken.userStyle);
    for (let i = 0; i < buffer.style.length; i++) {
      const property = buffer.style[i];
      if (userCssPrefixesWhiteList.some((prefix) => property.startsWith(prefix))) {
        userStyles[property] = buffer.style[property];
      }
    }
  }

  for (const key in userStyles) {
    node.style[key] = userStyles[key];
  }
}

function addHighlightHandler(jsToken, node) {
  if (jsToken.styleClasses.includes('dom')) {
    node.onmouseover = (e) => {
      callJVM('highlight', [jsToken.id]);
    };
    node.onmouseleave = (e) => {
      callJVM('hideHighlight', [jsToken.id]);
    }
  }
}

/**
 * @param {Printable} printable
 * @returns {Element}
 */
function createTextNode(printable) {
  let node;

  if (printable.text.length === 1) {
    let span = createElement("span");
    span.setAttribute("style", printable.inlineStyles[0]);
    span.appendChild(document.createTextNode(JSON.parse('"' + printable.text[0] + '"')));
    node = span;
  } else {
    let messageNode = createElement("span");
    for (let i = 0; i < printable.text.length; i++) {
      let span = createElement("span");
      span.setAttribute("style", printable.inlineStyles[i]);
      let textNode = document.createTextNode(JSON.parse('"' + printable.text[i] + '"'));
      span.appendChild(textNode);
      messageNode.appendChild(span);
    }
    node = messageNode;
  }

  addUserStyles(printable, node);
  addHighlightHandler(printable, node);
  return node;
}

function toggle_visibility(item) {
  if (item.classList.contains('expanded')) {
    item.classList.add('collapsed');
    item.classList.remove('expanded');
    return false;
  } else {
    item.classList.add('expanded');
    item.classList.remove('collapsed');
    return true;
  }
}

function expand(item) {
  if (item.classList.contains("collapsed")) {
    item.classList.add('expanded');
    item.classList.remove('collapsed');
    return true;
  }
  return false;
}

function collapse(item) {
  if (item.classList.contains('expanded')) {
    item.classList.add('collapsed');
    item.classList.remove('expanded');
    return true;
  }
  return false;
}

function updateIcons() {
  for (let rule of document.styleSheets[1].cssRules) {
    let style = rule.style;
    let iconURL = style.backgroundImage;
    let stampedURL = iconURL.substring(0, iconURL.lastIndexOf("?"))
                          + "?stamp=" + Math.floor((Math.random() * 10000) + 1) + ')';
    style.backgroundImage = stampedURL
  }
}

function isHidden(element) {
  return (!element || element.offsetParent === null)
}