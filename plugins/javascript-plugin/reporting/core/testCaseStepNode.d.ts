import TestNode, { NodeType } from "./testNode";
export default abstract class TestCaseStepNode extends TestNode {
    readonly nodeType: NodeType;
}
