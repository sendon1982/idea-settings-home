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
var testEventsHandler_1 = require("../core/testEventsHandler");
var playwrightTestStep_1 = require("./playwrightTestStep");
var PlaywrightTestStructure = /** @class */ (function (_super) {
    __extends(PlaywrightTestStructure, _super);
    function PlaywrightTestStructure() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stepId = 0;
        return _this;
    }
    PlaywrightTestStructure.prototype.startStep = function (step) {
        if (!this.isTestStepLocatable(step))
            return;
        step["id"] = this.stepId++;
        var playwrightTestStep = new playwrightTestStep_1.PlaywrightTestStep(step);
        this.write((0, testEventsHandler_1.teamcityFormatMessage)("testStepStarted", playwrightTestStep));
    };
    PlaywrightTestStructure.prototype.finishStep = function (step) {
        if (!this.isTestStepLocatable(step) || step["id"] === undefined)
            return;
        var playwrightTestStep = new playwrightTestStep_1.PlaywrightTestStep(step);
        this.write((0, testEventsHandler_1.teamcityFormatMessage)("testStepFinished", playwrightTestStep, "duration='".concat(step.duration, "'"))); // duration is written only on finish
    };
    PlaywrightTestStructure.prototype.isTestStepLocatable = function (step) {
        return step.location !== undefined;
    };
    return PlaywrightTestStructure;
}(testEventsHandler_1.default));
exports.default = PlaywrightTestStructure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheXdyaWdodFRlc3RTdHJ1Y3R1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGxheXdyaWdodC9wbGF5d3JpZ2h0VGVzdFN0cnVjdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtEQUFrRjtBQUVsRiwyREFBdUQ7QUFHdkQ7SUFBcUQsMkNBQWlCO0lBQXRFO1FBQUEscUVBeUJDO1FBeEJTLFlBQU0sR0FBRyxDQUFDLENBQUE7O0lBd0JwQixDQUFDO0lBdEJDLDJDQUFTLEdBQVQsVUFBVSxJQUFjO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDO1lBQ2pDLE9BQU07UUFFUixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBRTFCLElBQU0sa0JBQWtCLEdBQUcsSUFBSSx1Q0FBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN2RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUEseUNBQXFCLEVBQUMsaUJBQWlCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxDQUFBO0lBQzFFLENBQUM7SUFFRCw0Q0FBVSxHQUFWLFVBQVcsSUFBYztRQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxTQUFTO1lBQzdELE9BQU07UUFFUixJQUFNLGtCQUFrQixHQUFHLElBQUksdUNBQWtCLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFdkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFBLHlDQUFxQixFQUFDLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLG9CQUFhLElBQUksQ0FBQyxRQUFRLE1BQUcsQ0FBQyxDQUFDLENBQUEsQ0FBQyxxQ0FBcUM7SUFDaEosQ0FBQztJQUVPLHFEQUFtQixHQUEzQixVQUE0QixJQUFjO1FBQ3hDLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUE7SUFDcEMsQ0FBQztJQUNILDhCQUFDO0FBQUQsQ0FBQyxBQXpCRCxDQUFxRCwyQkFBaUIsR0F5QnJFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlc3RFdmVudHNIYW5kbGVyLCB7dGVhbWNpdHlGb3JtYXRNZXNzYWdlfSBmcm9tIFwiLi4vY29yZS90ZXN0RXZlbnRzSGFuZGxlclwiXG5pbXBvcnQge1Rlc3RTdGVwfSBmcm9tIFwiQHBsYXl3cmlnaHQvdGVzdC9yZXBvcnRlclwiXG5pbXBvcnQge1BsYXl3cmlnaHRUZXN0U3RlcH0gZnJvbSBcIi4vcGxheXdyaWdodFRlc3RTdGVwXCJcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5d3JpZ2h0VGVzdFN0cnVjdHVyZSBleHRlbmRzIFRlc3RFdmVudHNIYW5kbGVyIHtcbiAgcHJpdmF0ZSBzdGVwSWQgPSAwXG5cbiAgc3RhcnRTdGVwKHN0ZXA6IFRlc3RTdGVwKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzVGVzdFN0ZXBMb2NhdGFibGUoc3RlcCkpXG4gICAgICByZXR1cm5cblxuICAgIHN0ZXBbXCJpZFwiXSA9IHRoaXMuc3RlcElkKytcblxuICAgIGNvbnN0IHBsYXl3cmlnaHRUZXN0U3RlcCA9IG5ldyBQbGF5d3JpZ2h0VGVzdFN0ZXAoc3RlcClcbiAgICB0aGlzLndyaXRlKHRlYW1jaXR5Rm9ybWF0TWVzc2FnZShcInRlc3RTdGVwU3RhcnRlZFwiLCBwbGF5d3JpZ2h0VGVzdFN0ZXApKVxuICB9XG5cbiAgZmluaXNoU3RlcChzdGVwOiBUZXN0U3RlcCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1Rlc3RTdGVwTG9jYXRhYmxlKHN0ZXApIHx8IHN0ZXBbXCJpZFwiXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuXG5cbiAgICBjb25zdCBwbGF5d3JpZ2h0VGVzdFN0ZXAgPSBuZXcgUGxheXdyaWdodFRlc3RTdGVwKHN0ZXApXG5cbiAgICB0aGlzLndyaXRlKHRlYW1jaXR5Rm9ybWF0TWVzc2FnZShcInRlc3RTdGVwRmluaXNoZWRcIiwgcGxheXdyaWdodFRlc3RTdGVwLCBgZHVyYXRpb249JyR7c3RlcC5kdXJhdGlvbn0nYCkpIC8vIGR1cmF0aW9uIGlzIHdyaXR0ZW4gb25seSBvbiBmaW5pc2hcbiAgfVxuXG4gIHByaXZhdGUgaXNUZXN0U3RlcExvY2F0YWJsZShzdGVwOiBUZXN0U3RlcCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBzdGVwLmxvY2F0aW9uICE9PSB1bmRlZmluZWRcbiAgfVxufSJdfQ==