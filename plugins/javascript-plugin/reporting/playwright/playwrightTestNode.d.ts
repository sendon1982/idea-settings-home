import { TestCase } from "@playwright/test/reporter";
import TestCaseNode from "../core/testCaseNode";
export default class PlaywrightTestNode extends TestCaseNode {
    private readonly nativeTest;
    readonly locationInFile: string;
    readonly title: string;
    get duration(): number;
    get line(): number;
    get column(): number;
    get absoluteFilePath(): string;
    constructor(nativeTest: TestCase);
    toKeyValueString(): string;
}
