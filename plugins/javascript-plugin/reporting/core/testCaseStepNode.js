"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var testNode_1 = require("./testNode");
var TestCaseStepNode = /** @class */ (function (_super) {
    __extends(TestCaseStepNode, _super);
    function TestCaseStepNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.nodeType = "step";
        return _this;
    }
    return TestCaseStepNode;
}(testNode_1.default));
exports.default = TestCaseStepNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdENhc2VTdGVwTm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3Rlc3RDYXNlU3RlcE5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBNkM7QUFFN0M7SUFBdUQsb0NBQVE7SUFBL0Q7UUFBQSxxRUFFQztRQURtQixjQUFRLEdBQWEsTUFBTSxDQUFBOztJQUMvQyxDQUFDO0lBQUQsdUJBQUM7QUFBRCxDQUFDLEFBRkQsQ0FBdUQsa0JBQVEsR0FFOUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGVzdE5vZGUsIHtOb2RlVHlwZX0gZnJvbSBcIi4vdGVzdE5vZGVcIlxuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBUZXN0Q2FzZVN0ZXBOb2RlIGV4dGVuZHMgVGVzdE5vZGUge1xuICBvdmVycmlkZSByZWFkb25seSBub2RlVHlwZTogTm9kZVR5cGUgPSBcInN0ZXBcIlxufSJdfQ==