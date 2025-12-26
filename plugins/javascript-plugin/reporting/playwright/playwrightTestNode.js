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
var reporterUtils_1 = require("../core/reporterUtils");
var PlaywrightTestNode = /** @class */ (function (_super) {
    __extends(PlaywrightTestNode, _super);
    function PlaywrightTestNode(nativeTest) {
        var _this = _super.call(this, nativeTest) || this;
        _this.nativeTest = nativeTest;
        //this.locationInFile = nativeTest.titlePath().join(".")
        _this.locationInFile = _this.composeLocationHint(nativeTest.titlePath().slice(3));
        _this.title = nativeTest.title;
        return _this;
    }
    Object.defineProperty(PlaywrightTestNode.prototype, "duration", {
        get: function () {
            return this.nativeTest.results.map(function (r) { return r.duration; }).reduce(function (prev, cur) { return prev + cur; }, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlaywrightTestNode.prototype, "line", {
        get: function () {
            return this.nativeTest.location.line;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlaywrightTestNode.prototype, "column", {
        get: function () {
            return this.nativeTest.location.column;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlaywrightTestNode.prototype, "absoluteFilePath", {
        get: function () {
            var _a;
            // To see what is going on print `nativeTest`
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return (_a = this.nativeTest.location.file) !== null && _a !== void 0 ? _a : "";
        },
        enumerable: false,
        configurable: true
    });
    PlaywrightTestNode.prototype.toKeyValueString = function () {
        var location = this.nativeTest.location;
        return _super.prototype.toKeyValueString.call(this) + " column='".concat(location.column, "' line='").concat(location.line, "' file='").concat(reporterUtils_1.default.escapeAttributeValue(location.file), "' ");
    };
    return PlaywrightTestNode;
}(testCaseNode_1.default));
exports.default = PlaywrightTestNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheXdyaWdodFRlc3ROb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BsYXl3cmlnaHQvcGxheXdyaWdodFRlc3ROb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EscURBQStDO0FBQy9DLHVEQUFpRDtBQUVqRDtJQUFnRCxzQ0FBWTtJQXdCMUQsNEJBQTZCLFVBQW9CO1FBQWpELFlBQ0Usa0JBQU0sVUFBVSxDQUFDLFNBSWxCO1FBTDRCLGdCQUFVLEdBQVYsVUFBVSxDQUFVO1FBRS9DLHdEQUF3RDtRQUN4RCxLQUFJLENBQUMsY0FBYyxHQUFHLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDL0UsS0FBSSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFBOztJQUMvQixDQUFDO0lBeEJELHNCQUFhLHdDQUFRO2FBQXJCO1lBQ0UsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsUUFBUSxFQUFWLENBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksRUFBRSxHQUFHLElBQUssT0FBQSxJQUFJLEdBQUcsR0FBRyxFQUFWLENBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUM1RixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLG9DQUFJO2FBQVI7WUFDRSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQTtRQUN0QyxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLHNDQUFNO2FBQVY7WUFDRSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQTtRQUN4QyxDQUFDOzs7T0FBQTtJQUVELHNCQUFhLGdEQUFnQjthQUE3Qjs7WUFDRSw2Q0FBNkM7WUFDN0MsNkRBQTZEO1lBQzdELGFBQWE7WUFDYixPQUFPLE1BQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxtQ0FBSSxFQUFFLENBQUE7UUFDNUMsQ0FBQzs7O09BQUE7SUFTRCw2Q0FBZ0IsR0FBaEI7UUFDRSxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQTtRQUN6QyxPQUFPLGlCQUFNLGdCQUFnQixXQUFFLEdBQUcsbUJBQVksUUFBUSxDQUFDLE1BQU0scUJBQVcsUUFBUSxDQUFDLElBQUkscUJBQVcsdUJBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQUksQ0FBQztJQUN4SixDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBbkNELENBQWdELHNCQUFZLEdBbUMzRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VGVzdENhc2V9IGZyb20gXCJAcGxheXdyaWdodC90ZXN0L3JlcG9ydGVyXCJcbmltcG9ydCBUZXN0Q2FzZU5vZGUgZnJvbSBcIi4uL2NvcmUvdGVzdENhc2VOb2RlXCJcbmltcG9ydCBSZXBvcnRlclV0aWxzIGZyb20gXCIuLi9jb3JlL3JlcG9ydGVyVXRpbHNcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5d3JpZ2h0VGVzdE5vZGUgZXh0ZW5kcyBUZXN0Q2FzZU5vZGUge1xuICBvdmVycmlkZSByZWFkb25seSBsb2NhdGlvbkluRmlsZTogc3RyaW5nXG5cbiAgb3ZlcnJpZGUgcmVhZG9ubHkgdGl0bGU6IHN0cmluZ1xuXG4gIG92ZXJyaWRlIGdldCBkdXJhdGlvbigpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm5hdGl2ZVRlc3QucmVzdWx0cy5tYXAoKHIpID0+IHIuZHVyYXRpb24pLnJlZHVjZSgocHJldiwgY3VyKSA9PiBwcmV2ICsgY3VyLCAwKVxuICB9XG5cbiAgZ2V0IGxpbmUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5uYXRpdmVUZXN0LmxvY2F0aW9uLmxpbmVcbiAgfVxuXG4gIGdldCBjb2x1bW4oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5uYXRpdmVUZXN0LmxvY2F0aW9uLmNvbHVtblxuICB9XG5cbiAgb3ZlcnJpZGUgZ2V0IGFic29sdXRlRmlsZVBhdGgoKTogc3RyaW5nIHtcbiAgICAvLyBUbyBzZWUgd2hhdCBpcyBnb2luZyBvbiBwcmludCBgbmF0aXZlVGVzdGBcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiB0aGlzLm5hdGl2ZVRlc3QubG9jYXRpb24uZmlsZSA/PyBcIlwiXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG5hdGl2ZVRlc3Q6IFRlc3RDYXNlKSB7XG4gICAgc3VwZXIobmF0aXZlVGVzdClcbiAgICAvL3RoaXMubG9jYXRpb25JbkZpbGUgPSBuYXRpdmVUZXN0LnRpdGxlUGF0aCgpLmpvaW4oXCIuXCIpXG4gICAgdGhpcy5sb2NhdGlvbkluRmlsZSA9IHRoaXMuY29tcG9zZUxvY2F0aW9uSGludChuYXRpdmVUZXN0LnRpdGxlUGF0aCgpLnNsaWNlKDMpKVxuICAgIHRoaXMudGl0bGUgPSBuYXRpdmVUZXN0LnRpdGxlXG4gIH1cblxuICB0b0tleVZhbHVlU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLm5hdGl2ZVRlc3QubG9jYXRpb25cbiAgICByZXR1cm4gc3VwZXIudG9LZXlWYWx1ZVN0cmluZygpICsgYCBjb2x1bW49JyR7bG9jYXRpb24uY29sdW1ufScgbGluZT0nJHtsb2NhdGlvbi5saW5lfScgZmlsZT0nJHtSZXBvcnRlclV0aWxzLmVzY2FwZUF0dHJpYnV0ZVZhbHVlKGxvY2F0aW9uLmZpbGUpfScgYDtcbiAgfVxufSJdfQ==