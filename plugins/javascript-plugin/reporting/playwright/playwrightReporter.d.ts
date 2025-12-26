/// <reference types="node" />
import { FullConfig, FullResult, Reporter, Suite, TestCase, TestError, TestResult, TestStep } from "@playwright/test/reporter";
declare class PlaywrightJBReporter implements Reporter {
    private readonly testStructure;
    private readonly globalErrors;
    printsToStdio(): boolean;
    onStdErr(chunk: string | Buffer, test: void | TestCase, result: void | TestResult): boolean;
    onStdOut(chunk: string | Buffer, test: void | TestCase, result: void | TestResult): boolean;
    onBegin(config: FullConfig, suite: Suite): void;
    onTestBegin(test: TestCase, result: TestResult): void;
    onStepBegin(test: TestCase, result: TestResult, step: TestStep): void;
    onStepEnd(test: TestCase, result: TestResult, step: TestStep): void;
    onTestEnd(test: TestCase, result: TestResult): void;
    onEnd(result: FullResult): void;
    onError(error: TestError): void;
    private buildError;
    private normalizeFailureMessageAndStack;
}
export = PlaywrightJBReporter;
