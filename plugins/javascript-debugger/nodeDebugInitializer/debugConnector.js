const debugConnectorUtil = require('./debugConnectorUtil');

try {
  if (debugConnectorUtil.isVerboseLoggingEnabled()) {
    log('Starting execArgv=' + JSON.stringify(process.execArgv) + ', argv=' + JSON.stringify(process.argv));
  }

  const reason = findReasonToSkipAttachingDebugger();
  if (reason != null) {
    if (debugConnectorUtil.isVerboseLoggingEnabled()) {
      log('Attaching debugger skipped: ' + reason);
    }
    return;
  }

  const inspector = require('inspector');
  const asyncInspectorOpenSupported = isAsyncInspectorOpenSupported();
  const debugPort = findAvailablePort(inspector, asyncInspectorOpenSupported);
  if (debugConnectorUtil.getGatewayHostPort() != null) {
    debugConnectorUtil.forwardDebugConnectionAndWait(debugPort);
    return;
  }

  const {execFile, execFileSync} = require('child_process');
  const launchPortPublisher = asyncInspectorOpenSupported ? execFileSync : execFile;
  const interpreter = process.env['JB_INTERPRETER'] || process.execPath;
  const publisherEnv = Object.assign({}, process.env, {
    NODE_OPTIONS: ''
  });
  if (debugConnectorUtil.isVerboseLoggingEnabled()) {
    log('interpreter to publish debug port: ' + interpreter
          + ', asyncInspectorOpenSupported: ' + asyncInspectorOpenSupported
          + ', process.versions.node: ' + (process.versions || {}).node);
  }
  launchPortPublisher(interpreter, [require.resolve('./debugConnectorPortPublisher.js'), debugPort.toString()], {
    env: publisherEnv,
    stdio: 'inherit',
    windowsHide: true
  });
  if (!asyncInspectorOpenSupported) {
    inspector.open(debugPort, getBindHost(), true);
  }
}
catch (e) {
  console.error(formatMessage('Attaching debugger skipped (unhandled exception)'), e);
}

function findReasonToSkipAttachingDebugger() {
  if (hasInspectArg()) {
    return '--inspect* passed';
  }
  if (isElectronRendererProcess()) {
    return 'electron process detected';
  }
  const helperProcessInfo = getMatchedHelperProcess();
  if (helperProcessInfo != null) {
    return 'matched as helper process ' + JSON.stringify(helperProcessInfo);
  }
  try {
    if (!require('worker_threads').isMainThread) {
      // will be attached using WIP NodeWorker domain
      return 'worker thread detected';
    }
  }
  catch (ignored) {
  }
  return null;
}

function hasInspectArg() {
  return process.execArgv.some(
      arg => arg === '--inspect' || arg === '--inspect-brk' || arg.startsWith('--inspect-brk=') || arg.startsWith('--inspect=')
  );
}

function isElectronRendererProcess() {
  return process.type && process.type === 'renderer' || process.argv.indexOf('--type=renderer') >= 0;
}

/**
 * A helper process is a Node.js process that is known not to run application code,
 * so it's safe not to attach a debugger to it.
 * Skipping attaching debugger to a helper process would produce less debugger related output in the console.
 *
 * @returns {Array<String>} a helper process info matching the current process; null if none matched
 */
function getMatchedHelperProcess() {
  const INTERPRETER_DIR_MACRO = '[interpreter dir]';
  const helperProcessInfoList = [
    ['/node_modules/npm/bin/npm-cli.js', 'prefix', '-g'], // 'npm prefix -g' is run by npm.cmd on Windows
    ['/node_modules/update-notifier/check.js'], // check for npm/yarn available updates

    // npm/Yarn script (e.g. 'npm run start') spawns the process hierarchy,
    // where the root Node.js process doesn't run any application code
    ['/node_modules/npm/bin/npm-cli.js', 'run'],
    [INTERPRETER_DIR_MACRO + '/npm', 'run'], // ~/.nvm/versions/node/v18.12.1/bin/npm ('npm' and 'node' are the same folder)
    ['/Yarn/bin/yarn.js', 'run'],
    ['/usr/local/bin/npm', 'run']
  ];
  if (process.env.JETBRAINS_NODE_DEBUGGER_ATTACH_TO_HELPERS) {
    return null;
  }
  const argv = process.argv;
  return helperProcessInfoList.find((helperProcessInfo) => {
    return isHelperInfoMatched(helperProcessInfo, argv);
  });

  /**
   * @param {Array<String>} helperProcessInfo
   * @param {Array<String>} argv
   * @returns {boolean}
   */
  function isHelperInfoMatched(helperProcessInfo, argv) {
    if (argv.length <= helperProcessInfo.length || helperProcessInfo.length === 0) {
      return false;
    }
    return helperProcessInfo.every((value, index) => {
      if (index === 0) {
        return matchPathSuffix(value, argv[1]);
      }
      return value === argv[index + 1];
    });
  }

  function matchPathSuffix(pathSuffix, path) {
    if (pathSuffix.startsWith(INTERPRETER_DIR_MACRO)) {
      const expectedPath = require('path').dirname(process.execPath) + pathSuffix.substring(INTERPRETER_DIR_MACRO.length);
      return toSystemIndependentPath(path) === toSystemIndependentPath(expectedPath);
    }
    return toSystemIndependentPath(path).endsWith(pathSuffix);
  }

  function toSystemIndependentPath(path) {
    return path.replace(/\\/g, '/');
  }
}

/**
 * inspector.open(...,...,false) doesn't work properly on some node versions. It opens the port but debugger can't attach.
 */
function isAsyncInspectorOpenSupported() {
  try {
    const versions = process.versions.node.split('.');
    const major = parseInt(versions[0], 10);
    const minor = parseInt(versions[1], 10);
    return major >= 11 || major === 10 && minor >= 7;
  }
  catch (e) {
    console.error(formatMessage('Cannot parse node version: ' + JSON.stringify(process.versions)), e);
    return false;
  }
}

function findAvailablePort(inspector, asyncInspectorOpenSupported) {
  try {
    inspector.open(0, getBindHost(), false);
    const port = parsePort(inspector.url());
    if (!asyncInspectorOpenSupported) {
      inspector.close();
    }
    return port;
  }
  catch(e) {
    inspector.close();
    throw e;
  }

  /**
   * @param {String} url, like 'ws://127.0.0.1:45681/98f5f884-7eba-4037-aa71-ba972e8ad0dd'
   */
  function parsePort(url) {
    const { URL } = require('url');
    const parsedURL = new URL(url);
    const port = parseInt(parsedURL.port, 10);
    if (isNaN(port)) throw Error('Failed to parse debug port from ' + url);
    return port;
  }
}

/**
 * @return host to listen on for inspector connections. If undefined, localhost will be used.
 */
function getBindHost() {
  return process.env.JETBRAINS_NODE_BIND_HOST;
}

function log(message) {
  console.log(formatMessage(message));
}

function formatMessage(message) {
  return debugConnectorUtil.formatMessage('debugConnector', message);
}
