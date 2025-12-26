import TestNode, { NodeType } from "./testNode";
export default abstract class SuiteNode extends TestNode {
    abstract readonly isRoot: boolean;
    abstract readonly suites: SuiteNode[];
    abstract readonly tests: TestNode[];
    readonly nodeType: NodeType;
}
