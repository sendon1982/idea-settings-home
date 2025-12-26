const Tree = require('../base-test-reporter/intellij-tree');
const util = require('../base-test-reporter/intellij-util');
const stringifier = require('../base-test-reporter/intellij-stringifier');
const path = require('path');
const processStdoutWrite = process.stdout.write.bind(process.stdout);
const processStderrWrite = process.stderr.write.bind(process.stderr);

/**
 * @param {string} filePath
 * @param {string?} projectName
 * @return {string}
 */
function createFileNodeName(filePath, projectName) {
  const baseName = path.basename(filePath);
  // use `|` as workspace name selection, for the following default vitest cli reporter
  // https://github.com/vitest-dev/vitest/blob/85fb94a3081558b01f47bd763ccdaeb5df1b98cb/packages/vitest/src/node/reporters/renderers/utils.ts#L258
  return projectName ? `|${projectName}| ${baseName}` : baseName;
}

function addTestFileNode(tree, testFilePath, projectName) {
  return tree.root.addTestSuiteChild(createFileNodeName(testFilePath, projectName), 'file', testFilePath);
}

function isSuiteNode(node) {
  return node && typeof node.addTestSuiteChild === 'function';
}

function sendConsoleLog(testNode, log) {
  if (log.type === 'stdout') {
    testNode.addStdOut(log.content);
  }
  else {
    testNode.addStdErr(log.content);
  }
}

function getResult(testTask) {
  let testOrSuite = testTask;
  while (testOrSuite != null) {
    const result = testOrSuite.result;
    if (result != null) return result;
    const parentSuite = testOrSuite.suite;
    testOrSuite = parentSuite !== testOrSuite ? parentSuite : null;
  }
  return null;
}

function finishTestNode(testTask, testNode) {
  const result = getResult(testTask);
  const outcome = getOutcome(testTask);
  let failureMessage, failureStack, failureExpectedStr, failureActualStr;
  const resultError = getFirstError(result);
  if (resultError != null) {
    const normalizedError = normalizeError(resultError);
    failureMessage = normalizedError.message;
    failureStack = normalizedError.stack;
    if (resultError.expected !== resultError.actual) {
      failureExpectedStr = stringifier.stringify(resultError.expected);
      failureActualStr = stringifier.stringify(resultError.actual);
      testNode.setPrintExpectedAndActualValues(shouldPrintExpectedAndActualValues(failureMessage, failureExpectedStr, failureActualStr));
    }
  }
  if ((outcome === Tree.TestOutcome.FAILED || outcome === Tree.TestOutcome.ERROR) && process.env.JB_VITEST_LOG_TEST_FAILURE_DETAILS) {
    testNode.addStdOut('[intellij] "' + testNode.name + '" failure details: ' + stringifier.stringify(result));
  }
  if (!failureMessage && isTodo(testTask)) {
    failureMessage = `Todo '${testTask.name}'`;
  }
  let durationMillis = result != null ? result.duration : null;

  // Ad hoc fix for WEB-69673 until IJPL-164000 won't be implemented
  if (durationMillis) {
    durationMillis = Math.floor(durationMillis);
  }

  testNode.setOutcome(outcome, durationMillis, failureMessage, failureStack, failureExpectedStr, failureActualStr, null, null);
  testNode.finish(false);
}

function getNormalizedErrorByTask(task) {
  const result = getResult(task);
  const resultError = getFirstError(result);
  return resultError != null ? normalizeError(resultError) : null;
}

function getFirstError(result) {
  if (result != null) {
    const errors = result.errors;
    const firstError = Array.isArray(errors) && errors.length > 0 ? errors[0] : null;
    return firstError != null ? firstError : result.error;
  }
  return null;
}

function getLastError(result) {
  if (result != null) {
    const errors = result.errors;
    const lastError = Array.isArray(errors) && errors.length > 0 ? errors[errors.length - 1] : null;
    return lastError != null ? lastError : result.error;
  }
}

function normalizeError(error) {
  const name = error.name || 'Error';
  let message = error.message;
  let stack = error.stack;
  if (!util.isString(stack)) {
    stack = error.stackStr;
  }

  if (util.isString(name) && util.isString(message) && util.isString(stack)) {
    const messageLines = splitByLines(message);
    const stackLines = splitByLines(stack);
    if (messageLines.length > 0 && stackLines.length > 0 && messageLines.length <= stackLines.length) {
      messageLines[0] = name + ': ' + messageLines[0]
      if (arrayEqual(messageLines, stackLines.slice(0, messageLines.length))) {
        message = messageLines.join('\n')
        stack = stackLines.slice(messageLines.length).join('\n')
      }
    }
  }
  return {
    name: name,
    message: message,
    stack: stack
  }
}

function arrayEqual(a1, a2) {
  if (a1.length !== a2.length) return false
  for (let i = 0; i < a1.length; ++i) {
    if (a1[i] !== a2[i]) return false
  }
  return true
}

function splitByLines(text) {
  return text.split(/\n|\r\n/);
}

function shouldPrintExpectedAndActualValues(failureMessage, expectedStr, actualStr) {
  const duplicated = util.isString(failureMessage) && util.isString(expectedStr) && util.isString(actualStr) &&
    failureMessage.endsWith("expected '" + actualStr + "' to equal '" + expectedStr + "'");
  return !duplicated;
}

/**
 * @param {string} testTask
 * @returns {TestOutcome}
 */
function getOutcome(testTask) {
  const result = testTask.result;
  if (result == null) {
    if (testTask.mode === 'skip') {
      return Tree.TestOutcome.SKIPPED;
    }
    if (isTodo(testTask)) {
      return Tree.TestOutcome.SKIPPED;
    }
    return Tree.TestOutcome.ERROR;
  }
  if (result.state === 'pass') {
    return Tree.TestOutcome.SUCCESS;
  }
  return Tree.TestOutcome.FAILED;
}

function isTodo(testTask) {
  return testTask.mode === 'todo';
}

function addErrorTestChild(parentNode, childName, failureMsg, failureDetails) {
  const errorNode = parentNode.addTestChild(childName, 'test', null);
  errorNode.setOutcome(Tree.TestOutcome.ERROR, null, failureMsg, failureDetails, null, null, null, null);
  errorNode.start();
  errorNode.finish(false);
}

let globalRunScopeType;
function getRunScopeType() {
  if (globalRunScopeType == null) {
    globalRunScopeType = process.env['_JETBRAINS_VITEST_RUN_SCOPE_TYPE'];
  }
  return globalRunScopeType;
}

function isSuitesOrTestsScope() {
  const runScopeType = getRunScopeType();
  return runScopeType === 'suite' || runScopeType === 'test' || runScopeType === 'selected_tests';
}

function isSingleTestFileScope() {
  const runScopeType = getRunScopeType();
  return runScopeType === 'test_file' || runScopeType === 'suite' || runScopeType === 'test';
}

function configureCoverage(config, tree) {
  if (config) {
    const coverage = config.coverage;
    if (coverage) {
      const root = config.root;
      const reportsDirectory = coverage.reportsDirectory;
      if (util.isString(root) && util.isString(reportsDirectory)) {
        const resolvedCoverageDirectory = path.resolve(root, reportsDirectory)
        coverage.reporter.push(['lcov', {}]);
        tree.sendMessage('vitest-coverage-config', {coverageDirectory: resolvedCoverageDirectory});
      }
    }
  }
}

exports.addTestFileNode = addTestFileNode;
exports.addErrorTestChild = addErrorTestChild;
exports.finishTestNode = finishTestNode;
exports.isSuiteNode = isSuiteNode;
exports.isSingleTestFileScope = isSingleTestFileScope;
exports.isSuitesOrTestsScope = isSuitesOrTestsScope;
exports.normalizeError = normalizeError;
exports.getNormalizedErrorByTask = getNormalizedErrorByTask;
exports.sendConsoleLog = sendConsoleLog;
exports.configureCoverage = configureCoverage;
exports.createFileNodeName = createFileNodeName;
exports.getFirstError = getFirstError;
exports.getLastError = getLastError;
