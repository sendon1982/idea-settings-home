import { Suite } from "mocha";
import SuiteNode from "../core/suiteNode";
import CypressTestNode from "./cypressTestNode";
export default class CypressSuitNode extends SuiteNode {
    private readonly nativeSuite;
    readonly isRoot: boolean;
    readonly locationInFile: string;
    readonly suites: CypressSuitNode[];
    readonly tests: CypressTestNode[];
    readonly title: string;
    get duration(): number;
    get absoluteFilePath(): string;
    constructor(nativeSuite: Suite);
}
