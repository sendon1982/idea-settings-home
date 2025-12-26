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
var suiteNode_1 = require("../core/suiteNode");
var cypressTestNode_1 = require("./cypressTestNode");
var cypressUtils_1 = require("./cypressUtils");
var CypressSuitNode = /** @class */ (function (_super) {
    __extends(CypressSuitNode, _super);
    function CypressSuitNode(nativeSuite) {
        var _this = _super.call(this, nativeSuite) || this;
        _this.nativeSuite = nativeSuite;
        _this.isRoot = nativeSuite.root;
        _this.locationInFile = _this.composeLocationHint(nativeSuite.titlePath());
        _this.title = nativeSuite.title;
        _this.suites = nativeSuite.suites.map(function (s) { return new CypressSuitNode(s); });
        _this.tests = nativeSuite.tests.map(function (t) { return new cypressTestNode_1.default(t); });
        return _this;
    }
    Object.defineProperty(CypressSuitNode.prototype, "duration", {
        get: function () {
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CypressSuitNode.prototype, "absoluteFilePath", {
        get: function () {
            var _a;
            var absoluteFile = (_a = this.nativeSuite.invocationDetails.absoluteFile) !== null && _a !== void 0 ? _a : "";
            return cypressUtils_1.default.fixIfWindowsFilePath(absoluteFile);
        },
        enumerable: false,
        configurable: true
    });
    return CypressSuitNode;
}(suiteNode_1.default));
exports.default = CypressSuitNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3lwcmVzc1N1aXROb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2N5cHJlc3MvY3lwcmVzc1N1aXROb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsK0NBQXlDO0FBQ3pDLHFEQUErQztBQUMvQywrQ0FBeUM7QUFHekM7SUFBNkMsbUNBQVM7SUFnQnBELHlCQUE2QixXQUFrQjtRQUEvQyxZQUNFLGtCQUFNLFdBQVcsQ0FBQyxTQU1uQjtRQVA0QixpQkFBVyxHQUFYLFdBQVcsQ0FBTztRQUU3QyxLQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUE7UUFDOUIsS0FBSSxDQUFDLGNBQWMsR0FBRyxLQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUE7UUFDdkUsS0FBSSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFBO1FBQzlCLEtBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFRLElBQUssT0FBQSxJQUFJLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBdEIsQ0FBc0IsQ0FBQyxDQUFBO1FBQzFFLEtBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFPLElBQUssT0FBQSxJQUFJLHlCQUFlLENBQUMsQ0FBQyxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQTs7SUFDekUsQ0FBQztJQWhCRCxzQkFBYSxxQ0FBUTthQUFyQjtZQUNFLE9BQU8sQ0FBQyxDQUFBO1FBQ1YsQ0FBQzs7O09BQUE7SUFFRCxzQkFBYSw2Q0FBZ0I7YUFBN0I7O1lBQ0UsSUFBTSxZQUFZLEdBQVcsTUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLFlBQVksbUNBQUksRUFBRSxDQUFBO1lBQ2xGLE9BQU8sc0JBQVksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUN4RCxDQUFDOzs7T0FBQTtJQVVILHNCQUFDO0FBQUQsQ0FBQyxBQXhCRCxDQUE2QyxtQkFBUyxHQXdCckQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1N1aXRlLCBUZXN0fSBmcm9tIFwibW9jaGFcIlxuaW1wb3J0IFN1aXRlTm9kZSBmcm9tIFwiLi4vY29yZS9zdWl0ZU5vZGVcIlxuaW1wb3J0IEN5cHJlc3NUZXN0Tm9kZSBmcm9tIFwiLi9jeXByZXNzVGVzdE5vZGVcIlxuaW1wb3J0IEN5cHJlc3NVdGlscyBmcm9tIFwiLi9jeXByZXNzVXRpbHNcIlxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN5cHJlc3NTdWl0Tm9kZSBleHRlbmRzIFN1aXRlTm9kZSB7XG4gIG92ZXJyaWRlIHJlYWRvbmx5IGlzUm9vdDogYm9vbGVhblxuICBvdmVycmlkZSByZWFkb25seSBsb2NhdGlvbkluRmlsZTogc3RyaW5nXG4gIG92ZXJyaWRlIHJlYWRvbmx5IHN1aXRlczogQ3lwcmVzc1N1aXROb2RlW11cbiAgb3ZlcnJpZGUgcmVhZG9ubHkgdGVzdHM6IEN5cHJlc3NUZXN0Tm9kZVtdXG4gIG92ZXJyaWRlIHJlYWRvbmx5IHRpdGxlOiBzdHJpbmdcblxuICBvdmVycmlkZSBnZXQgZHVyYXRpb24oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gMFxuICB9XG5cbiAgb3ZlcnJpZGUgZ2V0IGFic29sdXRlRmlsZVBhdGgoKTogc3RyaW5nIHtcbiAgICBjb25zdCBhYnNvbHV0ZUZpbGU6IHN0cmluZyA9IHRoaXMubmF0aXZlU3VpdGUuaW52b2NhdGlvbkRldGFpbHMuYWJzb2x1dGVGaWxlID8/IFwiXCJcbiAgICByZXR1cm4gQ3lwcmVzc1V0aWxzLmZpeElmV2luZG93c0ZpbGVQYXRoKGFic29sdXRlRmlsZSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbmF0aXZlU3VpdGU6IFN1aXRlKSB7XG4gICAgc3VwZXIobmF0aXZlU3VpdGUpXG4gICAgdGhpcy5pc1Jvb3QgPSBuYXRpdmVTdWl0ZS5yb290XG4gICAgdGhpcy5sb2NhdGlvbkluRmlsZSA9IHRoaXMuY29tcG9zZUxvY2F0aW9uSGludChuYXRpdmVTdWl0ZS50aXRsZVBhdGgoKSlcbiAgICB0aGlzLnRpdGxlID0gbmF0aXZlU3VpdGUudGl0bGVcbiAgICB0aGlzLnN1aXRlcyA9IG5hdGl2ZVN1aXRlLnN1aXRlcy5tYXAoKHM6IFN1aXRlKSA9PiBuZXcgQ3lwcmVzc1N1aXROb2RlKHMpKVxuICAgIHRoaXMudGVzdHMgPSBuYXRpdmVTdWl0ZS50ZXN0cy5tYXAoKHQ6IFRlc3QpID0+IG5ldyBDeXByZXNzVGVzdE5vZGUodCkpXG4gIH1cbn0iXX0=