const Tree = require('../../base-test-reporter/intellij-tree');
const jestIntellijUtil = require('./jest-intellij-util');
const intellijUtil = require('../../base-test-reporter/intellij-util');
const writer = getWriter();
const tree = new Tree(null, writer.write.bind(writer));

function getWriter() {
  if (typeof process.stdout._intellijOriginalWrite === 'function') {
    return intellijUtil.createWriter(process.stdout._intellijOriginalWrite);
  }
  return intellijUtil.createWriter(process.stdout);
}

// No flush here because top-level await is not allowed in all supported JS versions
tree.startNotify();

let runningTests = {};

function IntellijReporter(globalConfig) {
  if (jestIntellijUtil.isRunWithCoverage()) {
    tree.sendMessage("jest-coverage-config", {coverageDirectory: globalConfig.coverageDirectory})
    globalConfig.coverageReporters.push('lcov');
  }
}

IntellijReporter.prototype.onRunStart = intellijUtil.safeAsyncFn(async function (results, options) {
  runningTests = {};
  tree.testingStarted();
  this.jasmineReporterConfigured = null;
  await writer.flush();
});

IntellijReporter.prototype.onTestFileStart = intellijUtil.safeAsyncFn(async function (test) {
  const testFileNode = jestIntellijUtil.addTestFileNode(tree, test.path);
  testFileNode.id = test.path;
  testFileNode.register();
  testFileNode.start();
  if (this.jasmineReporterConfigured == null) {
    this.jasmineReporterConfigured = configureJasmineReporter(test);
  }
  runningTests[test.path] = testFileNode;
  await writer.flush();
});

IntellijReporter.prototype.onTestStart = IntellijReporter.prototype.onTestFileStart;

function configureJasmineReporter(test) {
  if (!canConfigureJasmineReporter(test)) {
    return false;
  }
  const jasmineReporter = require.resolve('./jest-intellij-jasmine-reporter.js');
  const dirname = require('path').dirname;
  // ignore helpers/ directory from /path/to/helpers/jest-intellij/lib/jest-intellij-jasmine-reporter.js
  const ignorePattern = '^' + escapePattern(dirname(dirname(dirname(jasmineReporter))));

  const overriddenConfig = {
    transformIgnorePatterns: concatArrays(test.context.config.transformIgnorePatterns, [ignorePattern]),
    unmockedModulePathPatterns: concatArrays(test.context.config.unmockedModulePathPatterns, [ignorePattern])
  };
  if (typeof test.context.config.setupFilesAfterEnv !== 'undefined') {
    // setupFilesAfterEnv is available since jest@24
    if (Array.isArray(test.context.config.setupFilesAfterEnv) && test.context.config.setupFilesAfterEnv.indexOf(jasmineReporter) >= 0) {
      return true;
    }
    overriddenConfig.setupFilesAfterEnv = concatArrays(test.context.config.setupFilesAfterEnv, [jasmineReporter]);
  }
  else {
    if (test.context.config.setupTestFrameworkScriptFile === jasmineReporter) {
      return true;
    }
    overriddenConfig.setupTestFrameworkScriptFile = jasmineReporter;
    overriddenConfig.globals = Object.assign({}, test.context.config.globals || {},
      jestIntellijUtil.createGlobals(test.context.config.setupTestFrameworkScriptFile));
    if (test.context.config.automock && test.context.config.setupTestFrameworkScriptFile) {
      overriddenConfig.unmockedModulePathPatterns.push(test.context.config.setupTestFrameworkScriptFile);
    }
  }
  test.context.config = Object.assign({}, test.context.config, overriddenConfig);
  return true;
}

function concatArrays(array1, array2) {
  if (Array.isArray(array1) && Array.isArray(array2)) {
    return array1.concat(array2);
  }
  return Array.isArray(array1) ? array1 : array2;
}

function canConfigureJasmineReporter(test) {
  if (!process.env[jestIntellijUtil.JASMINE_REPORTER_DISABLED] && test && test.context && test.context.config) {
    if (intellijUtil.isString(test.context.config.testRunner)) {
      const testRunner = test.context.config.testRunner.replace(/\\/g, '/');
      const suffix = '/jest-jasmine2/build/index.js';
      if (testRunner.length > suffix.length && testRunner.lastIndexOf(suffix) === testRunner.length - suffix.length) {
        return true;
      }
    }
  }
  return false;
}

function escapePattern(str) {
  return str.replace(/[.?*+^$[\]\\(){}|]/g, "\\$&");
}

/**
 * Copy of https://github.com/facebook/jest/blob/92630a6fadcb4a2a4b57ab4fcf6400d37594c142/packages/jest-test-result/src/types.ts#L182
 * for avoiding issues with jest breaking changes
 * @typedef {Object} JestTest
 * @property {Object} context
 * @property {number} [duration]
 * @property {string} path
 */

/**
 * @description
 *  Note that according to the documentation
 *  (https://github.com/jestjs/jest/blob/f91b07795041ac711bb446d2e010611ba02c293d/packages/jest-reporters/src/types.ts#L33-L37)
 *  it is not called for `skipped`, 'pending', 'disabled' and `todo` tests.
 * @param {JestTest} test
 * @param {JestTestCaseStartInfo} testCaseStartInfo
 */
IntellijReporter.prototype.onTestCaseStart = intellijUtil.safeAsyncFn(async function (test, testCaseStartInfo) {
  const testFileNode = runningTests[test.path];
  if (testFileNode && !this.jasmineReporterConfigured) {
    const specParent = jestIntellijUtil.resolveSpecParent(testFileNode, test.path, testCaseStartInfo);
    jestIntellijUtil.createSpecNodeAndStart(testFileNode, test.path, specParent, testCaseStartInfo);
  }
  await writer.flush();
});

IntellijReporter.prototype.onTestCaseResult = intellijUtil.safeAsyncFn(async function (test, testCaseResult) {
  this._onTestCaseResultCalled = true;
  const testFileNode = runningTests[test.path];
  if (testFileNode) {
    if (!this.jasmineReporterConfigured) {
      jestIntellijUtil.reportSpecResult(testFileNode, test.path, testCaseResult, false);
    }
  }
  else {
    intellijUtil.warn('No started test for ' + test.path);
  }
  await writer.flush();
});

IntellijReporter.prototype.onTestFileResult = intellijUtil.safeAsyncFn(async function (test, testResult) {
  const reporterObj = this;
  const testFileNode = runningTests[testResult.testFilePath];
  if (testFileNode) {
    jestIntellijUtil.reportTestFileResults(testFileNode, testResult, function (testFilePath, testResults) {
      if (!reporterObj.jasmineReporterConfigured) {
        testResults.forEach(function (testResult) {
          if (!reporterObj._onTestCaseResultCalled) {
            jestIntellijUtil.reportSpecResult(testFileNode, testFilePath, testResult, false);
          }
          else if (testResult.status === 'todo' || testResult.status === 'pending') {
            jestIntellijUtil.reportSpecResult(testFileNode, testFilePath, testResult, true);
          }
        });
        jestIntellijUtil.addEmptyTestResultIfNeeded(testFileNode);
      }
    });
  }
  else {
    intellijUtil.warn('No started test for ' + testResult.testFilePath);
  }
  delete runningTests[testResult.testFilePath];
  await writer.flush();
});

IntellijReporter.prototype.onTestResult = IntellijReporter.prototype.onTestFileResult;

IntellijReporter.prototype.onRunComplete = intellijUtil.safeAsyncFn(async function (contexts, results) {
  // Make sure to finish any pending tests
  for (const testPath in runningTests) {
    const testNode = runningTests[testPath];
    if (testNode && testNode.finishIfStarted) {
      testNode.finishIfStarted();
    }
  }
  tree.testingFinished();
  await writer.close();
});

module.exports = IntellijReporter;
