import { Suite } from "@playwright/test/reporter";
import SuiteNode from "../core/suiteNode";
import PlaywrightTestNode from "./playwrightTestNode";
export default class PlaywrightSuitNode extends SuiteNode {
    readonly nativeSuite: Suite;
    readonly isProjectSuite: boolean;
    readonly isFileSuite: boolean;
    readonly isRoot: boolean;
    readonly locationInFile: string;
    readonly suites: PlaywrightSuitNode[];
    readonly tests: PlaywrightTestNode[];
    readonly title: string;
    get duration(): number;
    get absoluteFilePath(): string;
    get protocol(): string;
    constructor(nativeSuite: Suite);
}
