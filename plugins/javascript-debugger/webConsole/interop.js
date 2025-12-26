"use strict"

const PRINTABLE_TYPES = {
  TEXT: "text",
  TREE: "tree",
  TREE_LINK: "tree-link",
  MESSAGE_LINK: "message-link",
  MESSAGE_TREE_NODE: "message-tree-node"
}

class Printable {
  constructor() {
    /** @member {number} */
    this.id = undefined;
    /** @member {PRINTABLE_TYPES} */
    this.type = undefined;
    /** @member {string[]} */
    this.text = undefined;
    /** @member {string[]} */
    this.styleClasses = undefined;
    /** @member {boolean} */
    this.deferred = undefined;
    /** @member {number} */
    this.deferredID = undefined;
    /** @member {string} */
    this.iconURL = undefined;
  }
}

var callbackMap = new Map();
var callbackCounter = 0;

function callJVM(funcName, args, callback, preserveCallback) {
  if (callback != null) {
    callbackMap.set(callbackCounter, {preserve: preserveCallback, callback: callback});
    var callbackId = callbackCounter;
    args.push(callbackCounter);
    callbackCounter = (callbackCounter + 1) % 10000;
  }
  window.JSBridge[funcName](...args);
  return callbackId;
}

window.callback = function (callbackId, args) {
  let entry = callbackMap.get(callbackId);
  entry.callback(args);
  if (!entry.preserve) {
    callbackMap.delete(callbackId);
  }
}


//fixme: long running task freezes browser
window.processRequests = function(batch) {
  let receiver = WebConsole.instance();
  for (let request of batch) {
    let method = request.first;
    let args = request.second;
    receiver[method](...args);
  }
}