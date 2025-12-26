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
exports.PlaywrightTestStep = void 0;
var testCaseStepNode_1 = require("../core/testCaseStepNode");
var reporterUtils_1 = require("../core/reporterUtils");
var PlaywrightTestStep = /** @class */ (function (_super) {
    __extends(PlaywrightTestStep, _super);
    function PlaywrightTestStep(nativeStep) {
        var _this = _super.call(this, nativeStep) || this;
        _this.nativeStep = nativeStep;
        _this.locationInFile = _this.composeLocationHint(nativeStep.titlePath().slice(3));
        _this.title = nativeStep.title;
        return _this;
    }
    Object.defineProperty(PlaywrightTestStep.prototype, "absoluteFilePath", {
        get: function () {
            var _a;
            return (_a = this.nativeStep.location.file) !== null && _a !== void 0 ? _a : "";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlaywrightTestStep.prototype, "duration", {
        get: function () {
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    PlaywrightTestStep.prototype.setUpTestNode = function (nodeId, parentNodeIt) {
    };
    PlaywrightTestStep.prototype.toKeyValueString = function () {
        var location = this.nativeStep.location;
        return "id='".concat(this.nativeStep["id"], "' column='").concat(location.column, "' line='").concat(location.line, "' file='").concat(reporterUtils_1.default.escapeAttributeValue(location.file), "'");
    };
    return PlaywrightTestStep;
}(testCaseStepNode_1.default));
exports.PlaywrightTestStep = PlaywrightTestStep;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheXdyaWdodFRlc3RTdGVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BsYXl3cmlnaHQvcGxheXdyaWdodFRlc3RTdGVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZEQUF1RDtBQUV2RCx1REFBaUQ7QUFFakQ7SUFBd0Msc0NBQWdCO0lBZXRELDRCQUFxQixVQUFvQjtRQUF6QyxZQUNFLGtCQUFNLFVBQVUsQ0FBQyxTQUdsQjtRQUpvQixnQkFBVSxHQUFWLFVBQVUsQ0FBVTtRQUV2QyxLQUFJLENBQUMsY0FBYyxHQUFHLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDL0UsS0FBSSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFBOztJQUMvQixDQUFDO0lBZkQsc0JBQWEsZ0RBQWdCO2FBQTdCOztZQUNFLE9BQU8sTUFBQSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLG1DQUFJLEVBQUUsQ0FBQTtRQUM1QyxDQUFDOzs7T0FBQTtJQUVELHNCQUFhLHdDQUFRO2FBQXJCO1lBQ0UsT0FBTyxDQUFDLENBQUE7UUFDVixDQUFDOzs7T0FBQTtJQUVRLDBDQUFhLEdBQXRCLFVBQXVCLE1BQWMsRUFBRSxZQUFvQjtJQUMzRCxDQUFDO0lBUVEsNkNBQWdCLEdBQXpCO1FBQ0UsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUE7UUFDekMsT0FBTyxjQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLHVCQUFhLFFBQVEsQ0FBQyxNQUFNLHFCQUFXLFFBQVEsQ0FBQyxJQUFJLHFCQUFXLHVCQUFhLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFHLENBQUE7SUFDeEosQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQXpCRCxDQUF3QywwQkFBZ0IsR0F5QnZEO0FBekJZLGdEQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXN0Q2FzZVN0ZXBOb2RlIGZyb20gXCIuLi9jb3JlL3Rlc3RDYXNlU3RlcE5vZGVcIlxuaW1wb3J0IHtUZXN0U3RlcH0gZnJvbSBcIkBwbGF5d3JpZ2h0L3Rlc3QvcmVwb3J0ZXJcIlxuaW1wb3J0IFJlcG9ydGVyVXRpbHMgZnJvbSBcIi4uL2NvcmUvcmVwb3J0ZXJVdGlsc1wiXG5cbmV4cG9ydCBjbGFzcyBQbGF5d3JpZ2h0VGVzdFN0ZXAgZXh0ZW5kcyBUZXN0Q2FzZVN0ZXBOb2RlIHtcbiAgcmVhZG9ubHkgbG9jYXRpb25JbkZpbGU6IHN0cmluZ1xuICByZWFkb25seSB0aXRsZTogc3RyaW5nXG5cbiAgb3ZlcnJpZGUgZ2V0IGFic29sdXRlRmlsZVBhdGgoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5uYXRpdmVTdGVwLmxvY2F0aW9uLmZpbGUgPz8gXCJcIlxuICB9XG5cbiAgb3ZlcnJpZGUgZ2V0IGR1cmF0aW9uKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIDBcbiAgfVxuXG4gIG92ZXJyaWRlIHNldFVwVGVzdE5vZGUobm9kZUlkOiBudW1iZXIsIHBhcmVudE5vZGVJdDogbnVtYmVyKSB7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihyZWFkb25seSBuYXRpdmVTdGVwOiBUZXN0U3RlcCkge1xuICAgIHN1cGVyKG5hdGl2ZVN0ZXApXG4gICAgdGhpcy5sb2NhdGlvbkluRmlsZSA9IHRoaXMuY29tcG9zZUxvY2F0aW9uSGludChuYXRpdmVTdGVwLnRpdGxlUGF0aCgpLnNsaWNlKDMpKVxuICAgIHRoaXMudGl0bGUgPSBuYXRpdmVTdGVwLnRpdGxlXG4gIH1cblxuICBvdmVycmlkZSB0b0tleVZhbHVlU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLm5hdGl2ZVN0ZXAubG9jYXRpb25cbiAgICByZXR1cm4gYGlkPScke3RoaXMubmF0aXZlU3RlcFtcImlkXCJdfScgY29sdW1uPScke2xvY2F0aW9uLmNvbHVtbn0nIGxpbmU9JyR7bG9jYXRpb24ubGluZX0nIGZpbGU9JyR7UmVwb3J0ZXJVdGlscy5lc2NhcGVBdHRyaWJ1dGVWYWx1ZShsb2NhdGlvbi5maWxlKX0nYFxuICB9XG59Il19