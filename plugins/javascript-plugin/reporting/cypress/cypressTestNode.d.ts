import { Test } from "mocha";
import TestCaseNode from "../core/testCaseNode";
export default class CypressTestNode extends TestCaseNode {
    private readonly nativeTest;
    readonly locationInFile: string;
    readonly title: string;
    get duration(): number;
    get absoluteFilePath(): string;
    constructor(nativeTest: Test);
}
