import TestCaseStepNode from "../core/testCaseStepNode";
import { TestStep } from "@playwright/test/reporter";
export declare class PlaywrightTestStep extends TestCaseStepNode {
    readonly nativeStep: TestStep;
    readonly locationInFile: string;
    readonly title: string;
    get absoluteFilePath(): string;
    get duration(): number;
    setUpTestNode(nodeId: number, parentNodeIt: number): void;
    constructor(nativeStep: TestStep);
    toKeyValueString(): string;
}
