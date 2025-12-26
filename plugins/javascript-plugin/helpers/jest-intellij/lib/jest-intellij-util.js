const Tree = require('../../base-test-reporter/intellij-tree');
const util = require('../../base-test-reporter/intellij-util');
const stringifier = require('../../base-test-reporter/intellij-stringifier');
const path = require('path');

function addTestFileNode(tree, testFilePath) {
  return tree.root.addTestSuiteChild(path.basename(testFilePath), 'file', testFilePath);
}

function reportTestFileResults(testFileNode, testResultsPerTestFile, testResultsProcessor) {
  const testFilePath = testResultsPerTestFile.testFilePath;
  const testResults = testResultsPerTestFile.testResults;
  if (typeof testResultsPerTestFile.failureMessage === 'string' && !(Array.isArray(testResults) && testResults.length > 0)) {
    addErrorTestChild(testFileNode, 'Error', testResultsPerTestFile.failureMessage);
  }
  else {
    // https://github.com/jestjs/jest/blob/4fedfbd64b3bb66290f7a4a0f29efa11237e379c/packages/jest-test-result/src/types.ts#L129
    const testExecutionError = testResultsPerTestFile.testExecError;
    if (testExecutionError) {
      const messageAndStacktrace = extractMessageAndStacktraceExecutionError(testExecutionError)
      addErrorTestChild(testFileNode, 'Error', messageAndStacktrace.failureMessage, messageAndStacktrace.stack);
    }
    testResultsProcessor(testFilePath, testResults)
  }
  testFileNode.children.forEach(function (childNode) {
    childNode.finishIfStarted();
  });
  testFileNode.finish(false);
}

/**
 * Copy of https://github.com/facebook/jest/blob/6d2632adae0f0fa1fe116d3b475fd9783d0de1b5/packages/jest-types/src/TestResult.ts#L23
 * for avoiding issues with jest breaking changes
 * @typedef {Object} JestTestCaseAssertionResult
 * @property {string[]} ancestorTitles
 * @property {number|null} [duration]
 * @property {*[]} failureDetails
 * @property {string[]} failureMessages
 * @property {string} fullName
 * @property {number} [invocations]
 * @property {{column: number, line: number}|null} [location]
 * @property {number} numPassingAsserts
 * @property {'passed'|'failed'|'skipped'|'pending'|'todo'|'disabled'|'focused'} status
 * @property {string} title
 */

/**
 * Copy of https://github.com/DmitryMakhnev/jest/blob/604d0e9d3023dc08795b20830b92c8585f8c5d3c/packages/jest-types/src/Circus.ts#L184
 * for avoiding issues with jest breaking changes
 * @typedef {Object} JestTestCaseStartInfo
 * @property {string[]} ancestorTitles
 * @property {string} fullName
 * @property {'skip'|'only' |'todo'} [mode]
 * @property {string} title
 * @property {number|null} [startedAt]
 */

/**
 * @param {TestSuiteNode} testFileNode
 * @param {string} testFilePath
 * @param {JestTestCaseAssertionResult|JestTestCaseStartInfo} testCaseInfo
 * @return {TestSuiteNode}
 */
function resolveSpecParent(testFileNode, testFilePath, testCaseInfo) {
  let currentParentNode = testFileNode;
  testCaseInfo.ancestorTitles.forEach(function (suiteTitle) {
    let childSuiteNode = currentParentNode.findChildNodeByName(suiteTitle);
    if (!(childSuiteNode && typeof childSuiteNode.addTestSuiteChild === 'function')) {
      const suiteLocationPath = util.getTestLocationPath(currentParentNode, suiteTitle, testFileNode, testFilePath);
      childSuiteNode = currentParentNode.addTestSuiteChild(suiteTitle, 'suite', suiteLocationPath);
      childSuiteNode.start();
    }
    currentParentNode = childSuiteNode;
  });
  return currentParentNode;
}

/**
 * @param {TestSuiteNode} testFileNode
 * @param {string} testFilePath
 * @param {TestSuiteNode} parentNode
 * @param {JestTestCaseAssertionResult|JestTestCaseStartInfo} testCaseInfo
 * @return {TestNode}
 */
function createSpecNodeAndStart(testFileNode, testFilePath, parentNode, testCaseInfo) {
  const specName = testCaseInfo.title;
  const testLocationPath = util.getTestLocationPath(parentNode, specName, testFileNode, testFilePath);
  const specNode = parentNode.addTestChild(specName, 'test', testLocationPath);
  specNode.start();
  return specNode;
};

/**
 * @param {TestSuiteNode} parentNode
 * @param {string} childName
 */
function findFirstUnfinishedSpecNode(parentNode, childName) {
  const specNodes = parentNode.findChildNodesByName(childName);
  return specNodes.find(function (specNode) {
    return !specNode.isFinished();
  });
};

/**
 * @param {TestSuiteNode} testFileNode
 * @param {string} testFilePath
 * @param {JestTestCaseAssertionResult} testResult
 * @param {boolean} [mightBeDuplicate]
 */
function reportSpecResult(testFileNode, testFilePath, testResult, mightBeDuplicate) {
  if (testResult.status === 'pending' && isSuitesOrTestsScope()) {
    return; // When running with `--testNamePattern=<pattern>`, tests not matched by the pattern are reported as 'pending'.
  }
  const currentParentNode = resolveSpecParent(testFileNode, testFilePath, testResult);
  if (mightBeDuplicate && currentParentNode.findChildNodeByName(testResult.title) != null) {
    // 'to-do' can be reported twice from onTestCaseResult and from onTestFileResult
    return;
  }

  // try to find first unfinished for preventing cases with nodes with same names on same level
  const firstUnfinishedSpecNode = findFirstUnfinishedSpecNode(currentParentNode, testResult.title);

  const specNode = firstUnfinishedSpecNode
    ? firstUnfinishedSpecNode
    : createSpecNodeAndStart(testFileNode, testFilePath, currentParentNode, testResult);

  finishSpecNode(specNode, testResult);
}

function getFirstElement(array) {
  return Array.isArray(array) && array.length > 0 ? array[0] : null;
}

function finishSpecNode(specNode, testResult) {
  let failureMessage, failureStack, failureExpectedStr, failureActualStr;
  const failureDetails = getFirstElement(testResult.failureDetails);
  if (failureDetails != null) {
    const stack = failureDetails.stack
      // In case WEB-67757 (more https://github.com/jestjs/jest/issues/15196) we don't have the `stack` property.
      // So, we try to extract it from the failureMessages
      || testResult.failureMessages.join('');
    const normalizedMessageAndStackObj = normalizeFailureMessageAndStack(failureDetails.message, stack);
    failureMessage = normalizedMessageAndStackObj.message;
    failureStack = normalizedMessageAndStackObj.stack;
    const matcherResult = failureDetails.matcherResult;
    if (matcherResult && matcherResult.expected !== matcherResult.actual) {
      failureExpectedStr = stringifier.stringify(matcherResult.expected);
      failureActualStr = stringifier.stringify(matcherResult.actual);
    }
  }
  if (!util.isString(failureMessage)) {
    if (testResult.status === 'todo') {
      failureMessage = `Todo '${specNode.name}'`;
    }
    else {
      const failureMessageAndStack = getFirstElement(testResult.failureMessages);
      if (failureMessageAndStack != null && util.isString(failureMessageAndStack)) {
        const messageAndStackObj = splitFailureMessageAndStack(failureMessageAndStack);
        failureMessage = messageAndStackObj.message;
        failureStack = messageAndStackObj.stack;
      }
    }
  }
  const outcome = getOutcome(testResult.status);
  if (outcome === Tree.TestOutcome.FAILED && !util.isString(failureMessage)) {
    failureMessage = 'Failure cause not provided'
  }
  specNode.setOutcome(outcome, testResult.duration, failureMessage, failureStack, failureExpectedStr, failureActualStr, null, null);
  if (util.isString(failureExpectedStr)) {
    specNode.setPrintExpectedAndActualValues(!containsExpectedAndActualValues(failureMessage));
  }
  specNode.finish(false);
}

function normalizeFailureMessageAndStack(message, stack) {
  if (util.isString(message) && util.isString(stack) && message.length > 0) {
    if (stack.indexOf(message) === 0) {
      stack = stack.substring(message.length);
    }
    else {
      const newMessage = "Error: " + message;
      if (stack.indexOf(newMessage) === 0) {
        stack = stack.substring(newMessage.length);
        message = newMessage;
      }
    }
  }
  return { stack: stack, message: message };
}

function splitFailureMessageAndStack(failureMessageAndStack) {
  const lines = splitByLines(failureMessageAndStack);
  let stackStartInd = lines.findIndex(line => line.match(/^\s+at\s.*\)$/));
  if (stackStartInd < 0) {
    stackStartInd = Math.min(1, lines.length);
  }
  return {
    message: lines.slice(0, stackStartInd).join('\n').trim(),
    stack: lines.slice(stackStartInd).join('\n')
  }
}

/**
 * @param {string} status
 * @returns {TestOutcome}
 */
function getOutcome(status) {
  if (status === 'passed') {
    return Tree.TestOutcome.SUCCESS;
  }
  if (status === 'pending' || status === 'disabled') {
    return Tree.TestOutcome.SKIPPED;
  }
  if (status === 'todo') {
    return Tree.TestOutcome.SKIPPED;
  }
  return Tree.TestOutcome.FAILED;
}

function addErrorTestChild(parentNode, childName, failureMsg, stack) {
  const errorNode = parentNode.addTestChild(childName, 'test', null);
  errorNode.setOutcome(Tree.TestOutcome.ERROR, null, failureMsg, stack || null, null, null, null, null);
  errorNode.start();
  errorNode.finish(false);
}

function addEmptyTestResultIfNeeded(rootNode) {
  if (rootNode.children.every((child) => isCreatedState(child))) {
    addErrorTestChild(rootNode, 'No tests found', 'No matching tests found')
  }
}

function isCreatedState(node) {
  return node.state.name === 'created'
}

let globalRunScopeType;
function getRunScopeType() {
  if (globalRunScopeType == null) {
    globalRunScopeType = process.env['_JETBRAINS_TEST_RUNNER_RUN_SCOPE_TYPE'];
  }
  return globalRunScopeType;
}

function isSuitesOrTestsScope() {
  const runScopeType = getRunScopeType();
  return runScopeType === 'suite' || runScopeType === 'test' || runScopeType === 'selected_tests';
}

exports.addTestFileNode = addTestFileNode;
exports.reportTestFileResults = reportTestFileResults;
exports.reportSpecResult = reportSpecResult;
exports.addEmptyTestResultIfNeeded = addEmptyTestResultIfNeeded;
exports.isCreatedState = isCreatedState;
exports.resolveSpecParent = resolveSpecParent;
exports.createSpecNodeAndStart = createSpecNodeAndStart;

exports.createGlobals = function (originalSetupTestFrameworkScriptFile) {
  const globals = {};
  if (originalSetupTestFrameworkScriptFile) {
    globals._JB_INTELLIJ_ORIGINAL_SETUP_TEST_FRAMEWORK_SCRIPT_FILE = originalSetupTestFrameworkScriptFile;
  }
  return globals;
};
exports.getOriginalSetupTestFrameworkScriptFile = function () {
  if (typeof _JB_INTELLIJ_ORIGINAL_SETUP_TEST_FRAMEWORK_SCRIPT_FILE !== 'undefined') {
    return _JB_INTELLIJ_ORIGINAL_SETUP_TEST_FRAMEWORK_SCRIPT_FILE;
  }
};
exports.JASMINE_REPORTER_DISABLED = '_JB_INTELLIJ_JASMINE_REPORTER_DISABLED';

exports.isRunWithCoverage = () => {
  return process.env['_JETBRAINS_INTELLIJ_RUN_WITH_COVERAGE'] === 'true';
}

function splitByLines(text) {
  return text.split(/\n|\r\n/);
}

function containsExpectedAndActualValues(failureMessage) {
  if (util.isString(failureMessage)) {
    const lines = splitByLines(failureMessage)
    return lines.length >= 2 &&
           lines[lines.length - 2].startsWith('Expected:') &&
           lines[lines.length - 1].startsWith('Received:');
  }
  return false;
}

exports.containsExpectedAndActualValues = containsExpectedAndActualValues;
exports.normalizeFailureMessageAndStack = normalizeFailureMessageAndStack;

function extractMessageAndStacktraceExecutionError(testExecutionError) {
  let failureMessage = testExecutionError.message;
  const splitStack = splitFailureMessageAndStack(testExecutionError.stack);
  let stack = splitStack.stack;
  if (failureMessage == null || failureMessage === '' && splitStack.message !== '') {
    failureMessage = splitStack.message;
  }
  return {
    failureMessage,
    stack,
  };
}
