const debugConnectorUtil = require('./debugConnectorUtil');

forwardDebugConnection(parseInt(process.argv[2], 10));

function forwardDebugConnection(debugPort) {
  if (isNaN(debugPort) || debugPort <= 0) {
    console.error(formatMessage('debug port expected, argv=' + JSON.stringify(process.argv)));
    process.exit(1);
  }
  const gatewayHostPort = debugConnectorUtil.getGatewayHostPort();
  if (gatewayHostPort == null) {
    console.error(formatMessage('undefined gateway'));
    process.exit(1);
  }
  const inspectorHostPort = {port: debugPort};
  const verboseLogging = debugConnectorUtil.isVerboseLoggingEnabled();
  if (verboseLogging) {
    console.log(formatMessage('Forwarding connection between inspector ' + JSON.stringify(inspectorHostPort) +
      ' and gateway ' + JSON.stringify(gatewayHostPort)));
  }

  const gatewaySocket = connect(gatewayHostPort, 'gateway', verboseLogging);
  const inspectorSocket = connect(inspectorHostPort, 'inspector', verboseLogging);

  gatewaySocket.pipe(inspectorSocket);
  inspectorSocket.pipe(gatewaySocket);
}

function connect(options, endpointName, verboseLogging) {
  const net = require('net');
  const socket = net.createConnection(options);
  socket.setNoDelay(true);
  socket.on('error', err => {
    console.error(formatMessage('Error connecting to ' + endpointName + ' ' + JSON.stringify(options)), err);
  });
  if (verboseLogging) {
    logEvent(socket, 'lookup', endpointName);
    logEvent(socket, 'connect', endpointName);
    logEvent(socket, 'ready', endpointName);
    socket.once('data', (data) => {
      console.log(formatMessage('received data from ' + endpointName + ' (' + data.length + ' bytes)'));
    });
    logEvent(socket, 'timeout', endpointName);
    logEvent(socket, 'close', endpointName);
    logEvent(socket, 'end', endpointName);
  }
  return socket;
}

function logEvent(socket, eventName, socketName, logEventArgs) {
  socket.on(eventName, () => {
    console.log(formatMessage('\'' + eventName + '\' event from ' + socketName +
      (logEventArgs ? ', args: ' + JSON.stringify(arguments) : '')));
  });
}

function formatMessage(message) {
  return debugConnectorUtil.formatMessage('debugConnectionForwarder', message);
}
