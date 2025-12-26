import SuiteNode from "./suiteNode";
import TestNode from "./testNode";
export type TestMessage = "enteredTheMatrix" | "testingStarted" | "testSuiteStarted" | "testStarted" | "testStepStarted" | "testStepFinished" | "testFinished" | "testFailed" | "testIgnored" | "testSuiteFinished" | "testingFinished" | "testStdOut" | "testStdErr";
export declare function teamcityFormatMessage(message: TestMessage, node?: TestNode | null, extraProps?: string): string;
export declare function teamcityFormatCountMessage(count: number): string;
export default class TestEventsHandler {
    protected readonly write: (str: string) => void;
    private nextNodeId;
    /**
     * @param write Custom `write` function, redefined to write to file for tests
     */
    constructor(write?: (str: string) => void);
    testStdOut(test: TestNode, message: string): void;
    testStdErr(test: TestNode, message: string): void;
    /**
     * Starts testing and registers all test nodes
     * @param rootSuit - top most suit element i.e. without parent
     */
    startTesting(rootSuit: SuiteNode): void;
    /**
     * @param suite
     * @see {@link com.intellij.execution.testframework.sm.runner.OutputToGeneralTestEventsConverter.MyServiceMessageVisitor#visitTestSuiteStarted visitTestSuiteStarted}
     */
    startSuite(suite: SuiteNode): void;
    /**
     * @param test
     * @see {@link com.intellij.execution.testframework.sm.runner.OutputToGeneralTestEventsConverter.MyServiceMessageVisitor#visitTestStarted visitTestStarted}
     */
    startTest(test: TestNode): void;
    ignoreTest(test: TestNode): void;
    /**
     * @param test
     * @param error - if provided triggers error message, instead of success
     * @see {@link com.intellij.execution.testframework.sm.runner.OutputToGeneralTestEventsConverter.MyServiceMessageVisitor#visitTestFinished visitTestFinished}
     * @see {@link com.intellij.execution.testframework.sm.runner.OutputToGeneralTestEventsConverter.MyServiceMessageVisitor#visitTestFailed visitTestFailed}
     */
    finishTest(test: TestNode, error?: Error): void;
    /**
     * @param suite
     * @see {@link com.intellij.execution.testframework.sm.runner.OutputToGeneralTestEventsConverter.MyServiceMessageVisitor#visitTestSuiteFinished visitTestSuiteFinished}
     */
    finishSuite(suite: SuiteNode): void;
    finishTesting(): void;
    /**
     * Builds structure of test nodes as tree
     * @param rootSuite
     * @param parentNodeId
     * @returns number of registered nodes
     * @private
     */
    private registerTestNodes;
}
