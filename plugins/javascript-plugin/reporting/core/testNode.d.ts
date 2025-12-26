import TestNodeStatus from "./testNodeStatus";
export type NodeType = "suite" | "test" | "step";
/**
 * Represents basic Test Node from test frameworks
 * @see {@link com.intellij.execution.testframework.sm.runner.events.TreeNodeEvent TreeNodeEvent}
 */
export default abstract class TestNode {
    private readonly nativeElement;
    /**
     * Title of the test case
     * @example
     *   it('title', () => {testing()})
     */
    abstract readonly title: string;
    /**
     * Location in file, separeted by '.'
     * @example
     * // location is 'Suite'
     * describe('Suite', () => {
     *   // location is 'Suite.test1'
     *   it('test1', () => {// console.er()})
     * })
     */
    abstract readonly locationInFile: string;
    abstract readonly nodeType: NodeType;
    get protocol(): string;
    get nodeId(): number;
    get parentNodeId(): number;
    get status(): TestNodeStatus;
    set status(status: TestNodeStatus);
    abstract get duration(): number;
    /**
     * Absolute path of file containing test case
     */
    abstract get absoluteFilePath(): string;
    setUpTestNode(nodeId: number, parentNodeIt: number): void;
    constructor(nativeElement: any);
    composeLocationHint(pathElements: string[]): string;
    protected getLocationHint(protocol: string, filePath: string, locationInFile?: string): string;
    toKeyValueString(): string;
}
