const processStdoutWrite = process.stdout.write.bind(process.stdout);
const processStderrWrite = process.stderr.write.bind(process.stderr);

var toString = {}.toString;

/**
 * @param {*} value
 * @return {boolean}
 */
function isString(value) {
  return typeof value === 'string' || toString.call(value) === '[object String]';
}

/**
 * @param {Array.<string>} list
 * @param {number} fromInclusive
 * @param {number} toExclusive
 * @param {string} delimiterChar one character string
 * @returns {string}
 */
function joinList(list, fromInclusive, toExclusive, delimiterChar) {
  if (list.length === 0) {
    return '';
  }
  if (delimiterChar.length !== 1) {
    throw Error('Delimiter is expected to be a character, but "' + delimiterChar + '" received');
  }
  var addDelimiter = false
    , escapeChar = '\\'
    , escapeCharCode = escapeChar.charCodeAt(0)
    , delimiterCharCode = delimiterChar.charCodeAt(0)
    , result = ''
    , item
    , itemLength
    , ch
    , chCode;
  for (var itemId = fromInclusive; itemId < toExclusive; itemId++) {
    if (addDelimiter) {
      result += delimiterChar;
    }
    addDelimiter = true;
    item = list[itemId];
    itemLength = item.length;
    for (var i = 0; i < itemLength; i++) {
      ch = item.charAt(i);
      chCode = item.charCodeAt(i);
      if (chCode === delimiterCharCode || chCode === escapeCharCode) {
        result += escapeChar;
      }
      result += ch;
    }
  }
  return result;
}

/**
 * @param {String} message
 */
function warn(message) {
  const str = 'WARN - IDE integration: ' + message + '\n';
  try {
    processStderrWrite(str);
  }
  catch (ex) {
    try {
      processStdoutWrite(str);
    }
    catch (ex) {
      // do nothing
    }
  }
}

/**
 * @template T
 * @param {T} fn
 * @return T
 */
function safeAsyncFn(fn) {
  return async function () {
    try {
      return await fn.apply(this, arguments);
    } catch (ex) {
      warn(ex.message + '\n' + ex.stack);
    }
  };
}

/**
 * @tempate T
 * @param {T} fn
 * @return T
 */
function safeAsyncGeneratorFn(fn) {
  return async function* () {
    try {
      const asyncGenerator = fn.apply(this, arguments);
      for await (const result of asyncGenerator) {
        yield result;
      }
    } catch (e) {
      warn(e.message + '\n' + e.stack);
    }
  };
}

const LOCATION_DELIMITER_CHAR = '.';

/**
 * @param {TestSuiteNode} parentNode
 * @param {string} nodeName
 * @param {TestSuiteNode} testFileNode
 * @param {string} [testFilePath]
 * @static
 */
function getTestLocationPath(parentNode, nodeName, testFileNode, testFilePath) {
  const names = [nodeName];
  let currentParentNode = parentNode;
  while (currentParentNode !== testFileNode) {
    names.push(currentParentNode.name);
    currentParentNode = currentParentNode.parent;
  }
  names.push(testFilePath || '');
  names.reverse();
  return joinList(names, 0, names.length, LOCATION_DELIMITER_CHAR);
}

function SyncWriter(write) {
  this.write = write;
  this.flush = function() {};
  this.close = function() {};
}

function AsyncSocketWriter(socket) {
  this._lastPromise = Promise.resolve();
  this._buffer = [];

  this.write = function(message) {
    const messagePromise = this._lastPromise.then(function() {
      return new Promise(function(resolve, reject) {
        if (socket.destroyed) {
          return reject(new Error('Socket is closed or not available'));
        }

        socket.write(message, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    this._lastPromise = messagePromise;
    this._buffer.push(messagePromise);
    return messagePromise;
  };

  this.flush = function() {
    const currentBuffer = this._buffer;
    this._buffer = [];
    return Promise.all(currentBuffer);
  };

  this.close = function () {
    this.flush().then(function () {
      return new Promise((resolve) => {
        socket.end(() => {
          resolve();
        })
      });
    });
  };
}

function createWriter(customSyncWrite) {
  if (!customSyncWrite) {
    customSyncWrite = process.stdout.write.bind(process.stdout);
  }
  const socket = maybeOpenSocket();
  if (socket) {
    return new AsyncSocketWriter(socket);
  }
  else {
    return new SyncWriter(customSyncWrite);
  }
}

function maybeOpenSocket() {
  const net = require('net');
  let socket;
  try {
    if (process.env.JB_TEAMCITY_SOCKET_PATH) {
      socket = net.createConnection(process.env.JB_TEAMCITY_SOCKET_PATH);
    }
    else if (process.env.JB_TEAMCITY_SOCKET_PORT) {
      const port = parseInt(process.env.JB_TEAMCITY_SOCKET_PORT);
      const host = process.env.JB_TEAMCITY_SOCKET_HOST || 'localhost';
      socket = net.createConnection({host, port});
    }
    else {
      return null;
    }

    socket.unref();
    socket.setNoDelay(true);
    socket.on('error', (err) => {
      warn('Socket error:' + err.message);
      if (!socket.destroyed) {
        socket.destroy();
      }
    })
    process.on('exit', () => {
      if (!socket.destroyed) {
        socket.destroy();
      }
    })
    process.on('SIGINT', () => {
      if (!socket.destroyed) {
        socket.destroy();
      }
      process.exit();
    })

    return socket;
  }
  catch (err) {
    warn('Failed to create socket:' + err.message);
    return null;
  }
}

exports.isString = isString;
exports.safeAsyncFn = safeAsyncFn;
exports.safeAsyncGeneratorFn = safeAsyncGeneratorFn;
exports.warn = warn;
exports.createWriter = createWriter;
exports.getTestLocationPath = getTestLocationPath;
