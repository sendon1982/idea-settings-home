import TestNode, { NodeType } from "./testNode";
export default abstract class TestCaseNode extends TestNode {
    readonly nodeType: NodeType;
}
