const debugConnectorUtil = require('./debugConnectorUtil');

publishDebugPort(parseInt(process.argv[2], 10));

function publishDebugPort(debugPort) {
  if (isNaN(debugPort) || debugPort <= 0) {
    console.error('Debug port expected, argv=' + JSON.stringify(process.argv));
    process.exit(1);
  }
  const ideHost = process.env['JB_IDE_HOST'] || '127.0.0.1';
  const idePort = process.env['JB_IDE_PORT'];

  const net = require('net');
  const TIMEOUT = 15000;
  if (debugConnectorUtil.isVerboseLoggingEnabled()) {
    console.log(formatMessage('Publishing debug port ' + debugPort + ' to IDE (' + ideHost + ':' + idePort + ')'));
  }
  const socket = net.createConnection({host: ideHost, port: idePort}, () => {
    socket.on('data', () => {
      clearTimeout(timeoutId);
      socket.destroy();
    });

    socket.write(debugPort.toString(), 'utf8');
    const timeoutId = setTimeout(() => {
      console.error(formatMessage("Debugger didn't connect during timeout"));
      return socket.destroy();
    }, TIMEOUT);
  });
  socket.setNoDelay(true);
  socket.on('error', err => {
    console.error(formatMessage('Error when connecting to IDE'), err);
    process.exit(1);
  });
}

function formatMessage(message) {
  return debugConnectorUtil.formatMessage('debugConnectorPortPublisher', message);
}
