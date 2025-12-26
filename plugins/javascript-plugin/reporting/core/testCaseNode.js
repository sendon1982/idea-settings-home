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
var TestCaseNode = /** @class */ (function (_super) {
    __extends(TestCaseNode, _super);
    function TestCaseNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.nodeType = "test";
        return _this;
    }
    return TestCaseNode;
}(testNode_1.default));
exports.default = TestCaseNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdENhc2VOb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvcmUvdGVzdENhc2VOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQTZDO0FBRTdDO0lBQW1ELGdDQUFRO0lBQTNEO1FBQUEscUVBRUM7UUFEbUIsY0FBUSxHQUFhLE1BQU0sQ0FBQTs7SUFDL0MsQ0FBQztJQUFELG1CQUFDO0FBQUQsQ0FBQyxBQUZELENBQW1ELGtCQUFRLEdBRTFEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlc3ROb2RlLCB7Tm9kZVR5cGV9IGZyb20gXCIuL3Rlc3ROb2RlXCJcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgVGVzdENhc2VOb2RlIGV4dGVuZHMgVGVzdE5vZGUge1xuICBvdmVycmlkZSByZWFkb25seSBub2RlVHlwZTogTm9kZVR5cGUgPSBcInRlc3RcIlxufSJdfQ==