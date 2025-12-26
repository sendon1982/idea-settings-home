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
var SuiteNode = /** @class */ (function (_super) {
    __extends(SuiteNode, _super);
    function SuiteNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.nodeType = "suite";
        return _this;
    }
    return SuiteNode;
}(testNode_1.default));
exports.default = SuiteNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VpdGVOb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvcmUvc3VpdGVOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQTZDO0FBRTdDO0lBQWdELDZCQUFRO0lBQXhEO1FBQUEscUVBTUM7UUFEbUIsY0FBUSxHQUFhLE9BQU8sQ0FBQTs7SUFDaEQsQ0FBQztJQUFELGdCQUFDO0FBQUQsQ0FBQyxBQU5ELENBQWdELGtCQUFRLEdBTXZEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlc3ROb2RlLCB7Tm9kZVR5cGV9IGZyb20gXCIuL3Rlc3ROb2RlXCJcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgU3VpdGVOb2RlIGV4dGVuZHMgVGVzdE5vZGUge1xuICBhYnN0cmFjdCByZWFkb25seSBpc1Jvb3Q6IGJvb2xlYW47XG4gIGFic3RyYWN0IHJlYWRvbmx5IHN1aXRlczogU3VpdGVOb2RlW107XG4gIGFic3RyYWN0IHJlYWRvbmx5IHRlc3RzOiBUZXN0Tm9kZVtdO1xuXG4gIG92ZXJyaWRlIHJlYWRvbmx5IG5vZGVUeXBlOiBOb2RlVHlwZSA9IFwic3VpdGVcIlxufSJdfQ==