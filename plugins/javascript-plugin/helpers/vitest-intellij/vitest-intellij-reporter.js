const Tree = require('../base-test-reporter/intellij-tree.js');
const utils = require('../base-test-reporter/intellij-util');
const writer = utils.createWriter();
const tree = new Tree(null, writer.write.bind(writer));
const vitestIntellijUtil = require('./vitest-intellij-util');
const path = require('path');

/** @type {boolean} */
let beforeTestingStart = true;

/** @type {Object<string, TestSuiteNode>} */
let filePathToFileNodeMap = {};

/** @type {Object<string, Stat>} */
let collectedFilePathToTestStatMap = {};

/** @type {Object<string, TestNode>} */
let testIdToTestNodeMap = {};

/** @type {Object<string, TestSuiteNode>} */
let suiteIdToSuiteNodeMap = {};

class Stat {
  collectedTestCount = 0;
  finishedTestCount = 0;
}

// No flush here because top-level await is not allowed in all supported JS versions
tree.startNotify();

function IntellijReporter() {
}

function startTestingIfNeeded() {
  if (beforeTestingStart) {
    tree.testingStarted();
    beforeTestingStart = false;
    filePathToFileNodeMap = {};
    collectedFilePathToTestStatMap = {};
    testIdToTestNodeMap = {};
    suiteIdToSuiteNodeMap = {};
  }
}

function finishTesting() {
  if (beforeTestingStart) {
    utils.warn('Cannot finish not started testing');
    return;
  }
  tree.testingFinished();
  beforeTestingStart = true;
}

IntellijReporter.prototype.onInit = utils.safeAsyncFn(async (vitestCtx) => {
  if (process.env['_JETBRAINS_VITEST_RUN_WITH_COVERAGE']) {
    vitestIntellijUtil.configureCoverage(vitestCtx.config, tree);
    await writer.flush();
  }
});

// Not working in vitest
// IntellijReporter.prototype.onPathsCollected = utils.safeFn((paths) => {
// });

/**
 * @param {String} filePath
 * @returns {Stat}
 */
function getOrCreateStat(filePath) {
  let stat = collectedFilePathToTestStatMap[filePath];
  if (stat == null) {
    stat = new Stat();
    collectedFilePathToTestStatMap[filePath] = stat;
  }
  return stat;
}

IntellijReporter.prototype.onCollected = utils.safeAsyncFn(async (files) => {
  startTestingIfNeeded();
  buildTreeAndProcessTests(files, (testTask, testNode, filePath) => {
    getOrCreateStat(filePath).collectedTestCount++;
  });
  await writer.flush();
});

function shouldIgnoreSkippedTask(testTask) {
  return testTask.mode === 'skip' && vitestIntellijUtil.isSuitesOrTestsScope()
}

/**
 * @param fileNode
 * @param ancestorSuiteTasks
 * @return {TestSuiteNode}
 */
function getParentSuiteNode(fileNode, ancestorSuiteTasks) {
  if (ancestorSuiteTasks.length > 0) {
    const parentSuiteTask = ancestorSuiteTasks[ancestorSuiteTasks.length - 1];
    const parentSuiteNode = suiteIdToSuiteNodeMap[parentSuiteTask.id];
    return parentSuiteNode;
  }
  return fileNode;
}

function buildTreeAndProcessTests(files, testNodeCallback, suiteNodeDoneCallback) {
  for (const file of files) {
    const filePath = file.filepath;
    const fileNode = getOrCreateFileNode(filePath, file.projectName);
    for (const task of file.tasks) {
      traverseSuitesAndProcessTasks(
        task,
        [],
        (ancestorSuiteTasks, testTask) => {
          if (shouldIgnoreSkippedTask(testTask)) {
            return; // ignore other tests when running a single suite/test
          }
          const testNode = getOrCreateTestNode(ancestorSuiteTasks, testTask, fileNode, filePath);
          testNodeCallback(testTask, testNode, filePath);
        },
        (ancestorSuiteTasks, suiteTask) => {
          if (shouldIgnoreSkippedTask(suiteTask)) {
            return; // ignore other tests when running a single suite/test
          }
          getOrCreateSuiteNode(ancestorSuiteTasks, suiteTask, fileNode, filePath);
        },
        (ancestorSuiteTasks, suiteTask) => {
        if (suiteNodeDoneCallback) {
          const suiteNode = suiteIdToSuiteNodeMap[suiteTask.id];
          if (suiteNode) {
            suiteNodeDoneCallback(suiteTask, suiteNode);
          }
        }
      })
    }
  }
}

function getOrCreateTestNode(ancestorSuiteTasks, testTask, fileNode, filePath) {
  let testNode = testIdToTestNodeMap[testTask.id];
  if (testNode == null) {
    const parentNode = getParentSuiteNode(fileNode, ancestorSuiteTasks);
    const testLocationPath = utils.getTestLocationPath(parentNode, testTask.name, fileNode, filePath)
    testNode = parentNode.addTestChild(testTask.name, 'test', testLocationPath)
    testIdToTestNodeMap[testTask.id] = testNode;
    testNode.start()
  }
  return testNode
}

function getOrCreateSuiteNode(ancestorSuiteTasks, suiteTask, fileNode, filePath) {
  let suiteNode = suiteIdToSuiteNodeMap[suiteTask.id];
  if (suiteNode == null) {
    const parentNode = getParentSuiteNode(fileNode, ancestorSuiteTasks);
    const suiteName = suiteTask.name;
    const suiteLocationPath = utils.getTestLocationPath(parentNode, suiteName, fileNode, filePath);
    suiteNode = parentNode.addTestSuiteChild(suiteName, 'suite', suiteLocationPath);
    suiteIdToSuiteNodeMap[suiteTask.id] = suiteNode;
    suiteNode.start();
  }
  return suiteNode;
}

function getOrCreateFileNode(filePath, projectName) {
  const isWorkspace = projectName != null;
  const fileNodeKey = isWorkspace ? projectName + '|' + filePath : filePath;
  let fileNode = filePathToFileNodeMap[fileNodeKey];
  if (fileNode == null) {
    if (vitestIntellijUtil.isSingleTestFileScope()
      // Don't update the root node for workspaces, because they can rerun file more than once
      && !isWorkspace
    ) {
      tree.updateRootNode(
        vitestIntellijUtil.createFileNodeName(filePath, projectName),
        path.relative('', path.dirname(filePath)),
        'file://' + filePath
      );
      fileNode = tree.root;
    }
    else {
      fileNode = vitestIntellijUtil.addTestFileNode(tree, filePath, projectName);
      fileNode.start();
    }
    filePathToFileNodeMap[fileNodeKey] = fileNode;
  }
  return fileNode;
}

function traverseSuitesAndProcessTasks(
  task,
  suiteTasks,
  testCallback,
  suiteStartedCallback,
  suiteProcessedCallback,
) {
  if (task.type === 'test') {
    testCallback(suiteTasks, task);
  }
  else if (task.type === 'suite') {
    if (suiteStartedCallback) {
      suiteStartedCallback(suiteTasks, task);
    }
    suiteTasks.push(task);
    for (const childTask of task.tasks) {
      traverseSuitesAndProcessTasks(
        childTask,
        suiteTasks,
        testCallback,
        suiteStartedCallback,
        suiteProcessedCallback,
      );
    }
    if (suiteProcessedCallback) {
      suiteProcessedCallback(suiteTasks, task);
    }
    suiteTasks.pop();
  }
}

IntellijReporter.prototype.onUserConsoleLog = utils.safeAsyncFn(async (log) => {
  const testNode = testIdToTestNodeMap[log.taskId];
  if (testNode) {
    vitestIntellijUtil.sendConsoleLog(testNode, log);
  }
  await writer.flush();
});

function isThisSuiteHasErrors(suiteTask) {
  const result = suiteTask.result;
  // skipped and todo suites don't have the state
  return result != null
    // the 'fails' state will be set for all levels of suites
    && result.state === 'fail'
    // but if the result has errors, the errors happen in this suite
    && (result.error || result.errors);
}

IntellijReporter.prototype.onFinished = utils.safeAsyncFn(async (files, errors) => {
  if (beforeTestingStart) {
    utils.warn("Got finished tests before collecting them");
  }

  buildTreeAndProcessTests(
    files,
    (testTask, testNode, filePath) => {
      vitestIntellijUtil.finishTestNode(testTask, testNode);
      const stat = collectedFilePathToTestStatMap[filePath];
      if (stat != null) {
        stat.finishedTestCount++;
      }
    },
    (suiteTask, suiteNode) => {
      const taskResult = suiteTask.result;
      if (isThisSuiteHasErrors(suiteTask)) {
        const resultHooks = taskResult.hooks;
        if (resultHooks) {
          /**
           * Hooks:
           * - beforeEach https://vitest.dev/api/#beforeeach
           * - afterEach https://vitest.dev/api/#aftereach
           * - onTestFinished https://vitest.dev/api/#ontestfinished
           * - onTestFailed https://vitest.dev/api/#ontestfailed
           * are bound to its suites and handled as `TestNode` state.
           */
          if (resultHooks.beforeAll === 'run') {
            const error = vitestIntellijUtil.getFirstError(taskResult);
            if (error != null) {
              const normalizedError = vitestIntellijUtil.normalizeError(error);
              vitestIntellijUtil.addErrorTestChild(
                suiteNode,
                "Error in beforeAll hook",
                normalizedError.message,
                normalizedError.stack,
              );
            }
          }

          if (resultHooks.afterAll === 'run') {
            // take last because in case of error in the `beforeAll` the suite task has 2 errors
            const error = vitestIntellijUtil.getLastError(taskResult);
            if (error != null) {
              const normalizedError = vitestIntellijUtil.normalizeError(error);
              vitestIntellijUtil.addErrorTestChild(
                suiteNode,
                "Error in afterAll hook",
                normalizedError.message,
                normalizedError.stack,
              );
            }
          }
        }
      }
    },
  );

  if (Array.isArray(errors)) {
    for (const error of errors) {
      const normalizedError = vitestIntellijUtil.normalizeError(error);
      vitestIntellijUtil.addErrorTestChild(tree.root, normalizedError.name, normalizedError.message, normalizedError.stack);
    }
  }

  for (const file of files) {
    const filePath = file.filepath;
    const fileNode = getOrCreateFileNode(filePath, file.projectName);
    const fileError = vitestIntellijUtil.getNormalizedErrorByTask(file);
    if (fileError != null) {
      vitestIntellijUtil.addErrorTestChild(fileNode, fileError.name, fileError.message, fileError.stack);
    }
    const stat = getOrCreateStat(filePath);
    if (stat.collectedTestCount === stat.finishedTestCount) {
      fileNode.children.forEach(function (childNode) {
        childNode.finishIfStarted();
      });
      fileNode.finish(false);
    }
  }
  if (Object.values(collectedFilePathToTestStatMap).every((stat) => stat.collectedTestCount <= stat.finishedTestCount)) {
    finishTesting();
  }
  await writer.close();
});

module.exports = IntellijReporter;

/*
function traceCalls(functionName, fn) {
  const old = IntellijReporter.prototype[functionName];
  IntellijReporter.prototype[functionName] = function () {
    process.stdout.write('trace: ' + functionName + '\n');
    if (typeof fn === 'function') {
      fn.apply(this, arguments);
    }
    if (typeof old === 'function') {
      old.apply(this, arguments);
    }
  }
}

traceCalls('onInit');
traceCalls('onPathsCollected');
traceCalls('onCollected', (files) => {
  logFiles('onCollected', files);
});
traceCalls('onFinished', (files) => {
  logFiles('onFinished', files);
});
traceCalls('onTaskUpdate');
traceCalls('onTestRemoved');
traceCalls('onWatcherStart');
traceCalls('onWatcherRerun');
traceCalls('onServerRestart');
traceCalls('onUserConsoleLog');

function logFiles(message, files) {
  process.stdout.write(message + ' ' + files.length + '\n' + files.map(file => '  ' + file.filepath).join('\n') + '\n');
}

*/
