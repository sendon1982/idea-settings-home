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
var testCaseNode_1 = require("../core/testCaseNode");
var constants_1 = require("./constants");
var cypressUtils_1 = require("./cypressUtils");
var CypressTestNode = /** @class */ (function (_super) {
    __extends(CypressTestNode, _super);
    function CypressTestNode(nativeTest) {
        var _this = _super.call(this, nativeTest) || this;
        _this.nativeTest = nativeTest;
        _this.locationInFile = _this.composeLocationHint(nativeTest.titlePath());
        _this.title = nativeTest.title;
        return _this;
    }
    Object.defineProperty(CypressTestNode.prototype, "duration", {
        get: function () {
            if (this.nativeTest.duration != undefined)
                return this.nativeTest.duration;
            return Math.round(performance.now() - this.nativeTest[constants_1.TEST_STARTED_TIMESTAMP_INDEX]);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CypressTestNode.prototype, "absoluteFilePath", {
        get: function () {
            var _a;
            // To see what is going on print `nativeTest`
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            var absoluteFile = (_a = this.nativeTest.invocationDetails.absoluteFile) !== null && _a !== void 0 ? _a : "";
            return cypressUtils_1.default.fixIfWindowsFilePath(absoluteFile);
        },
        enumerable: false,
        configurable: true
    });
    return CypressTestNode;
}(testCaseNode_1.default));
exports.default = CypressTestNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3lwcmVzc1Rlc3ROb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2N5cHJlc3MvY3lwcmVzc1Rlc3ROb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EscURBQStDO0FBQy9DLHlDQUF3RDtBQUN4RCwrQ0FBeUM7QUFHekM7SUFBNkMsbUNBQVk7SUFtQnZELHlCQUE2QixVQUFnQjtRQUE3QyxZQUNFLGtCQUFNLFVBQVUsQ0FBQyxTQUdsQjtRQUo0QixnQkFBVSxHQUFWLFVBQVUsQ0FBTTtRQUUzQyxLQUFJLENBQUMsY0FBYyxHQUFHLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQTtRQUN0RSxLQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUE7O0lBQy9CLENBQUM7SUFsQkQsc0JBQWEscUNBQVE7YUFBckI7WUFDRSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxJQUFJLFNBQVM7Z0JBQ3ZDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUE7WUFDakMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLHdDQUE0QixDQUFDLENBQUMsQ0FBQTtRQUN0RixDQUFDOzs7T0FBQTtJQUVELHNCQUFhLDZDQUFnQjthQUE3Qjs7WUFDRSw2Q0FBNkM7WUFDN0MsNkRBQTZEO1lBQzdELGFBQWE7WUFDYixJQUFNLFlBQVksR0FBVyxNQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsWUFBWSxtQ0FBSSxFQUFFLENBQUE7WUFDakYsT0FBTyxzQkFBWSxDQUFDLG9CQUFvQixDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ3hELENBQUM7OztPQUFBO0lBT0gsc0JBQUM7QUFBRCxDQUFDLEFBeEJELENBQTZDLHNCQUFZLEdBd0J4RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VGVzdH0gZnJvbSBcIm1vY2hhXCJcbmltcG9ydCBUZXN0Q2FzZU5vZGUgZnJvbSBcIi4uL2NvcmUvdGVzdENhc2VOb2RlXCJcbmltcG9ydCB7VEVTVF9TVEFSVEVEX1RJTUVTVEFNUF9JTkRFWH0gZnJvbSBcIi4vY29uc3RhbnRzXCJcbmltcG9ydCBDeXByZXNzVXRpbHMgZnJvbSBcIi4vY3lwcmVzc1V0aWxzXCJcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDeXByZXNzVGVzdE5vZGUgZXh0ZW5kcyBUZXN0Q2FzZU5vZGUge1xuXG4gIG92ZXJyaWRlIHJlYWRvbmx5IGxvY2F0aW9uSW5GaWxlOiBzdHJpbmdcbiAgb3ZlcnJpZGUgcmVhZG9ubHkgdGl0bGU6IHN0cmluZ1xuXG4gIG92ZXJyaWRlIGdldCBkdXJhdGlvbigpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLm5hdGl2ZVRlc3QuZHVyYXRpb24gIT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuIHRoaXMubmF0aXZlVGVzdC5kdXJhdGlvblxuICAgIHJldHVybiBNYXRoLnJvdW5kKHBlcmZvcm1hbmNlLm5vdygpIC0gdGhpcy5uYXRpdmVUZXN0W1RFU1RfU1RBUlRFRF9USU1FU1RBTVBfSU5ERVhdKVxuICB9XG5cbiAgb3ZlcnJpZGUgZ2V0IGFic29sdXRlRmlsZVBhdGgoKTogc3RyaW5nIHtcbiAgICAvLyBUbyBzZWUgd2hhdCBpcyBnb2luZyBvbiBwcmludCBgbmF0aXZlVGVzdGBcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGFic29sdXRlRmlsZTogc3RyaW5nID0gdGhpcy5uYXRpdmVUZXN0Lmludm9jYXRpb25EZXRhaWxzLmFic29sdXRlRmlsZSA/PyBcIlwiXG4gICAgcmV0dXJuIEN5cHJlc3NVdGlscy5maXhJZldpbmRvd3NGaWxlUGF0aChhYnNvbHV0ZUZpbGUpXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG5hdGl2ZVRlc3Q6IFRlc3QpIHtcbiAgICBzdXBlcihuYXRpdmVUZXN0KVxuICAgIHRoaXMubG9jYXRpb25JbkZpbGUgPSB0aGlzLmNvbXBvc2VMb2NhdGlvbkhpbnQobmF0aXZlVGVzdC50aXRsZVBhdGgoKSlcbiAgICB0aGlzLnRpdGxlID0gbmF0aXZlVGVzdC50aXRsZVxuICB9XG59Il19