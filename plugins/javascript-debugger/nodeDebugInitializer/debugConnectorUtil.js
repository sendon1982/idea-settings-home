exports.getGatewayHostPort = () => {
  const host = process.env.JB_NODE_DEBUG_CONNECTION_GATEWAY_HOST;
  const port = parseInt(process.env.JB_NODE_DEBUG_CONNECTION_GATEWAY_PORT, 10);
  if (host != null && !isNaN(port) && port > 0) {
    return {host: host, port: port};
  }
  return null;
};

exports.forwardDebugConnectionAndWait = (debugPort) => {
  const { spawn } = require('child_process');
  const childProcessEnv = Object.assign({}, process.env, {
    NODE_OPTIONS: ''
  });
  spawn(process.execPath, [require.resolve('./debugConnectionForwarder.js'), debugPort.toString()], {
    env: childProcessEnv,
    stdio: 'inherit',
    windowsHide: true
  });

  const inspector = require('inspector');
  // https://nodejs.org/api/inspector.html#inspectorwaitfordebugger
  if (typeof inspector.waitForDebugger === 'function') {
    // Wait for IDE to register breakpoints and call `org.jetbrains.wip.protocol.runtime.RuntimeKt.RunIfWaitingForDebugger`.
    inspector.waitForDebugger();
  }
  else {
    console.error(formatMessage('debugConnectionForwarder', 'inspector.waitForDebugger is unavailable in ' + process.versions.node +
      ' (added in v12.7.0). Some initial breakpoints might be skipped.'));
  }
};

let verboseLoggingEnabled = null;

function isVerboseLoggingEnabled() {
  if (verboseLoggingEnabled === null) {
    verboseLoggingEnabled = process.env.JETBRAINS_NODE_DEBUGGER_VERBOSE_LOGGING != null;
  }
  return verboseLoggingEnabled;
}

exports.isVerboseLoggingEnabled = isVerboseLoggingEnabled;

exports.formatMessage = (caller, message) => {
  const pidMsg = isVerboseLoggingEnabled() ? ' pid:' + process.pid + ', ppid:' + process.ppid : '';
  return '[' + caller + pidMsg + '] ' + message;
};
