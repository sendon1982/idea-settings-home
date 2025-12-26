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
var playwrightTestNode_1 = require("./playwrightTestNode");
var PlaywrightSuitNode = /** @class */ (function (_super) {
    __extends(PlaywrightSuitNode, _super);
    function PlaywrightSuitNode(nativeSuite) {
        var _this = _super.call(this, nativeSuite) || this;
        _this.nativeSuite = nativeSuite;
        _this.isRoot = nativeSuite.parent == null;
        _this.isProjectSuite = nativeSuite.titlePath().length === 2;
        _this.isFileSuite = nativeSuite.titlePath().length === 3;
        _this.locationInFile = _this.composeLocationHint(nativeSuite.titlePath().slice(3));
        _this.title = nativeSuite.title;
        _this.suites = nativeSuite.suites.map(function (s) { return new PlaywrightSuitNode(s); });
        _this.tests = nativeSuite.tests.map(function (t) { return new playwrightTestNode_1.default(t); });
        return _this;
    }
    Object.defineProperty(PlaywrightSuitNode.prototype, "duration", {
        get: function () {
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlaywrightSuitNode.prototype, "absoluteFilePath", {
        get: function () {
            var _a, _b;
            // To see what is going on print `suite`
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return (_b = (_a = this.nativeSuite.location) === null || _a === void 0 ? void 0 : _a.file) !== null && _b !== void 0 ? _b : "";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlaywrightSuitNode.prototype, "protocol", {
        get: function () {
            return this.isFileSuite ? "file" : this.nodeType;
        },
        enumerable: false,
        configurable: true
    });
    return PlaywrightSuitNode;
}(suiteNode_1.default));
exports.default = PlaywrightSuitNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheXdyaWdodFN1aXROb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BsYXl3cmlnaHQvcGxheXdyaWdodFN1aXROb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsK0NBQXlDO0FBRXpDLDJEQUFxRDtBQUVyRDtJQUFnRCxzQ0FBUztJQTBCdkQsNEJBQXFCLFdBQWtCO1FBQXZDLFlBQ0Usa0JBQU0sV0FBVyxDQUFDLFNBUW5CO1FBVG9CLGlCQUFXLEdBQVgsV0FBVyxDQUFPO1FBRXJDLEtBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUE7UUFDeEMsS0FBSSxDQUFDLGNBQWMsR0FBRyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQTtRQUMxRCxLQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFBO1FBQ3ZELEtBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNoRixLQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUE7UUFDOUIsS0FBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQVEsSUFBSyxPQUFBLElBQUksa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEVBQXpCLENBQXlCLENBQUMsQ0FBQTtRQUM3RSxLQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBVyxJQUFLLE9BQUEsSUFBSSw0QkFBa0IsQ0FBQyxDQUFDLENBQUMsRUFBekIsQ0FBeUIsQ0FBQyxDQUFBOztJQUNoRixDQUFDO0lBeEJELHNCQUFhLHdDQUFRO2FBQXJCO1lBQ0UsT0FBTyxDQUFDLENBQUE7UUFDVixDQUFDOzs7T0FBQTtJQUVELHNCQUFhLGdEQUFnQjthQUE3Qjs7WUFDRSx3Q0FBd0M7WUFDeEMsNkRBQTZEO1lBQzdELGFBQWE7WUFDYixPQUFPLE1BQUEsTUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsMENBQUUsSUFBSSxtQ0FBSSxFQUFFLENBQUE7UUFDOUMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBYSx3Q0FBUTthQUFyQjtZQUNFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ25ELENBQUM7OztPQUFBO0lBWUgseUJBQUM7QUFBRCxDQUFDLEFBcENELENBQWdELG1CQUFTLEdBb0N4RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U3VpdGUsIFRlc3RDYXNlfSBmcm9tIFwiQHBsYXl3cmlnaHQvdGVzdC9yZXBvcnRlclwiXG5pbXBvcnQgU3VpdGVOb2RlIGZyb20gXCIuLi9jb3JlL3N1aXRlTm9kZVwiXG5cbmltcG9ydCBQbGF5d3JpZ2h0VGVzdE5vZGUgZnJvbSBcIi4vcGxheXdyaWdodFRlc3ROb2RlXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheXdyaWdodFN1aXROb2RlIGV4dGVuZHMgU3VpdGVOb2RlIHtcblxuICByZWFkb25seSBpc1Byb2plY3RTdWl0ZTogYm9vbGVhblxuICByZWFkb25seSBpc0ZpbGVTdWl0ZTogYm9vbGVhblxuXG4gIG92ZXJyaWRlIHJlYWRvbmx5IGlzUm9vdDogYm9vbGVhblxuICBvdmVycmlkZSByZWFkb25seSBsb2NhdGlvbkluRmlsZTogc3RyaW5nXG4gIG92ZXJyaWRlIHJlYWRvbmx5IHN1aXRlczogUGxheXdyaWdodFN1aXROb2RlW11cbiAgb3ZlcnJpZGUgcmVhZG9ubHkgdGVzdHM6IFBsYXl3cmlnaHRUZXN0Tm9kZVtdXG4gIG92ZXJyaWRlIHJlYWRvbmx5IHRpdGxlOiBzdHJpbmdcblxuICBvdmVycmlkZSBnZXQgZHVyYXRpb24oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gMFxuICB9XG5cbiAgb3ZlcnJpZGUgZ2V0IGFic29sdXRlRmlsZVBhdGgoKTogc3RyaW5nIHtcbiAgICAvLyBUbyBzZWUgd2hhdCBpcyBnb2luZyBvbiBwcmludCBgc3VpdGVgXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICByZXR1cm4gdGhpcy5uYXRpdmVTdWl0ZS5sb2NhdGlvbj8uZmlsZSA/PyBcIlwiXG4gIH1cblxuICBvdmVycmlkZSBnZXQgcHJvdG9jb2woKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pc0ZpbGVTdWl0ZSA/IFwiZmlsZVwiIDogdGhpcy5ub2RlVHlwZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hdGl2ZVN1aXRlOiBTdWl0ZSkge1xuICAgIHN1cGVyKG5hdGl2ZVN1aXRlKVxuICAgIHRoaXMuaXNSb290ID0gbmF0aXZlU3VpdGUucGFyZW50ID09IG51bGxcbiAgICB0aGlzLmlzUHJvamVjdFN1aXRlID0gbmF0aXZlU3VpdGUudGl0bGVQYXRoKCkubGVuZ3RoID09PSAyXG4gICAgdGhpcy5pc0ZpbGVTdWl0ZSA9IG5hdGl2ZVN1aXRlLnRpdGxlUGF0aCgpLmxlbmd0aCA9PT0gM1xuICAgIHRoaXMubG9jYXRpb25JbkZpbGUgPSB0aGlzLmNvbXBvc2VMb2NhdGlvbkhpbnQobmF0aXZlU3VpdGUudGl0bGVQYXRoKCkuc2xpY2UoMykpXG4gICAgdGhpcy50aXRsZSA9IG5hdGl2ZVN1aXRlLnRpdGxlXG4gICAgdGhpcy5zdWl0ZXMgPSBuYXRpdmVTdWl0ZS5zdWl0ZXMubWFwKChzOiBTdWl0ZSkgPT4gbmV3IFBsYXl3cmlnaHRTdWl0Tm9kZShzKSlcbiAgICB0aGlzLnRlc3RzID0gbmF0aXZlU3VpdGUudGVzdHMubWFwKCh0OiBUZXN0Q2FzZSkgPT4gbmV3IFBsYXl3cmlnaHRUZXN0Tm9kZSh0KSlcbiAgfVxufSJdfQ==