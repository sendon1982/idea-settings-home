"use strict";
var playwrightSuitNode_1 = require("./playwrightSuitNode");
var playwrightTestNode_1 = require("./playwrightTestNode");
var playwrightTestStructure_1 = require("./playwrightTestStructure");
var testNodeStatus_1 = require("../core/testNodeStatus");
var ansiRegexPattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
].join('|');
var ansiRegex = new RegExp(ansiRegexPattern, 'g');
var PlaywrightJBReporter = /** @class */ (function () {
    function PlaywrightJBReporter() {
        this.testStructure = new playwrightTestStructure_1.default();
        this.globalErrors = [];
    }
    PlaywrightJBReporter.prototype.printsToStdio = function () {
        return true;
    };
    PlaywrightJBReporter.prototype.onStdErr = function (chunk, test, result) {
        if (test == null) {
            return process.stderr.write(chunk);
        }
        if (chunk instanceof Buffer) {
            chunk = chunk.toString();
        }
        this.testStructure.testStdErr(new playwrightTestNode_1.default(test), chunk);
    };
    PlaywrightJBReporter.prototype.onStdOut = function (chunk, test, result) {
        if (test == null) {
            return process.stdout.write(chunk);
        }
        if (chunk instanceof Buffer) {
            chunk = chunk.toString();
        }
        this.testStructure.testStdOut(new playwrightTestNode_1.default(test), chunk);
    };
    PlaywrightJBReporter.prototype.onBegin = function (config, suite) {
        this.testStructure.startTesting(new playwrightSuitNode_1.default(suite));
        // root
        this.testStructure.startSuite(new playwrightSuitNode_1.default(suite));
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    PlaywrightJBReporter.prototype.onTestBegin = function (test, result) {
        var _this = this;
        var suite = new playwrightSuitNode_1.default(test.parent);
        var suitesToStart = [];
        while (suite !== undefined && suite.status === testNodeStatus_1.default.NotStarted) {
            suitesToStart.push(suite);
            if (suite.nativeSuite.parent === undefined)
                suite = undefined;
            else
                suite = new playwrightSuitNode_1.default(suite.nativeSuite.parent);
        }
        suitesToStart.reverse().forEach(function (suite) {
            _this.testStructure.startSuite(suite);
        });
        this.testStructure.startTest(new playwrightTestNode_1.default(test));
        if (test.expectedStatus == 'skipped') {
            this.testStructure.ignoreTest(new playwrightTestNode_1.default(test));
        }
    };
    PlaywrightJBReporter.prototype.onStepBegin = function (test, result, step) {
        this.testStructure.startStep(step);
    };
    PlaywrightJBReporter.prototype.onStepEnd = function (test, result, step) {
        this.testStructure.finishStep(step);
    };
    PlaywrightJBReporter.prototype.onTestEnd = function (test, result) {
        // If the test status is interrupted, don't have to finish test in structure, it will be marked as interrupted by default
        if (result.status == "interrupted")
            return;
        var error = (test.outcome() == "unexpected") ? this.buildError(result) : null;
        this.testStructure.finishTest(new playwrightTestNode_1.default(test), error);
        var suite = new playwrightSuitNode_1.default(test.parent);
        // terminate all finished suites up the test structrure
        while (suite !== undefined && suite.tests.every(function (t) { return t.status === testNodeStatus_1.default.Finished; }) &&
            suite.suites.every(function (s) { return s.status === testNodeStatus_1.default.Finished; })) {
            this.testStructure.finishSuite(suite);
            if (suite.nativeSuite.parent === undefined)
                suite = undefined;
            else
                suite = new playwrightSuitNode_1.default(suite.nativeSuite.parent);
        }
    };
    PlaywrightJBReporter.prototype.onEnd = function (result) {
        var _this = this;
        if (this.globalErrors.length > 0) {
            process.stderr.write(this.globalErrors.join("\n"), function () {
                _this.testStructure.finishTesting();
            });
        }
        else {
            this.testStructure.finishTesting();
        }
    };
    PlaywrightJBReporter.prototype.onError = function (error) {
        var _a = this.normalizeFailureMessageAndStack(error.message, error.stack), message = _a[0], stack = _a[1];
        this.globalErrors.push(message + stack);
    };
    PlaywrightJBReporter.prototype.buildError = function (result) {
        var _this = this;
        var _a;
        var normalizedErrors = result.errors
            .map(function (error) { return _this.normalizeFailureMessageAndStack(error.message, error.stack); });
        var stack = (_a = normalizedErrors.map(function (value) { return value[1]; }).find(function (value) { return value != null; })) !== null && _a !== void 0 ? _a : "";
        var message = normalizedErrors.map(function (value) { return value[0]; }).join("\n");
        return {
            name: 'Error',
            message: message,
            stack: stack
        };
    };
    PlaywrightJBReporter.prototype.normalizeFailureMessageAndStack = function (message, stack) {
        if (stack != null) {
            if (stack.indexOf(message) === 0) {
                stack = stack.substring(message.length);
            }
            else {
                var newMessage = "Error: " + message;
                if (stack.indexOf(newMessage) === 0) {
                    stack = stack.substring(newMessage.length);
                    message = newMessage;
                }
            }
        }
        if (message != null) {
            message = message.replace(ansiRegex, '');
        }
        return [message, stack];
    };
    return PlaywrightJBReporter;
}());
module.exports = PlaywrightJBReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheXdyaWdodFJlcG9ydGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BsYXl3cmlnaHQvcGxheXdyaWdodFJlcG9ydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwyREFBcUQ7QUFDckQsMkRBQXFEO0FBQ3JELHFFQUErRDtBQUMvRCx5REFBbUQ7QUFHbkQsSUFBTSxnQkFBZ0IsR0FBRztJQUN2Qiw4SEFBOEg7SUFDOUgsMERBQTBEO0NBQzNELENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRVosSUFBTSxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFFcEQ7SUFBQTtRQUVtQixrQkFBYSxHQUFHLElBQUksaUNBQXVCLEVBQUUsQ0FBQztRQUM5QyxpQkFBWSxHQUFrQixFQUFFLENBQUM7SUFtSXBELENBQUM7SUFqSUMsNENBQWEsR0FBYjtRQUNFLE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVELHVDQUFRLEdBQVIsVUFBUyxLQUFzQixFQUFFLElBQXFCLEVBQUUsTUFBeUI7UUFDL0UsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO1lBQ2hCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEM7UUFFRCxJQUFJLEtBQUssWUFBWSxNQUFNLEVBQUU7WUFDM0IsS0FBSyxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUMxQjtRQUVELElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksNEJBQWtCLENBQUMsSUFBZ0IsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBQ2hGLENBQUM7SUFFRCx1Q0FBUSxHQUFSLFVBQVMsS0FBc0IsRUFBRSxJQUFxQixFQUFFLE1BQXlCO1FBQy9FLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtZQUNoQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENB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QUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNuQyxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzNDLE9BQU8sR0FBRyxVQUFVLENBQUM7aUJBQ3RCO2FBQ0Y7U0FDRjtRQUNELElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtZQUNuQixPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDMUM7UUFDRCxPQUFPLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBQ3pCLENBQUM7SUFDSCwyQkFBQztBQUFELENBQUMsQUF0SUQsSUFzSUM7QUFFRCxpQkFBUyxvQkFBb0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQbGF5d3JpZ2h0U3VpdE5vZGUgZnJvbSBcIi4vcGxheXdyaWdodFN1aXROb2RlXCJcbmltcG9ydCBQbGF5d3JpZ2h0VGVzdE5vZGUgZnJvbSBcIi4vcGxheXdyaWdodFRlc3ROb2RlXCJcbmltcG9ydCBQbGF5d3JpZ2h0VGVzdFN0cnVjdHVyZSBmcm9tIFwiLi9wbGF5d3JpZ2h0VGVzdFN0cnVjdHVyZVwiXG5pbXBvcnQgVGVzdE5vZGVTdGF0dXMgZnJvbSBcIi4uL2NvcmUvdGVzdE5vZGVTdGF0dXNcIlxuaW1wb3J0IHtGdWxsQ29uZmlnLCBGdWxsUmVzdWx0LCBSZXBvcnRlciwgU3VpdGUsIFRlc3RDYXNlLCBUZXN0RXJyb3IsIFRlc3RSZXN1bHQsIFRlc3RTdGVwfSBmcm9tIFwiQHBsYXl3cmlnaHQvdGVzdC9yZXBvcnRlclwiO1xuXG5jb25zdCBhbnNpUmVnZXhQYXR0ZXJuID0gW1xuICAnW1xcXFx1MDAxQlxcXFx1MDA5Ql1bW1xcXFxdKCkjOz9dKig/Oig/Oig/Oig/OjtbLWEtekEtWlxcXFxkXFxcXC8jJi46PT8lQH5fXSspKnxbYS16QS1aXFxcXGRdKyg/OjtbLWEtekEtWlxcXFxkXFxcXC8jJi46PT8lQH5fXSopKik/XFxcXHUwMDA3KScsXG4gICcoPzooPzpcXFxcZHsxLDR9KD86O1xcXFxkezAsNH0pKik/W1xcXFxkQS1QUi1UWmNmLW50cXJ5PT48fl0pKSdcbl0uam9pbignfCcpO1xuXG5jb25zdCBhbnNpUmVnZXggPSBuZXcgUmVnRXhwKGFuc2lSZWdleFBhdHRlcm4sICdnJyk7XG5cbmNsYXNzIFBsYXl3cmlnaHRKQlJlcG9ydGVyIGltcGxlbWVudHMgUmVwb3J0ZXIge1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgdGVzdFN0cnVjdHVyZSA9IG5ldyBQbGF5d3JpZ2h0VGVzdFN0cnVjdHVyZSgpO1xuICBwcml2YXRlIHJlYWRvbmx5IGdsb2JhbEVycm9yczogQXJyYXk8U3RyaW5nPiA9IFtdO1xuXG4gIHByaW50c1RvU3RkaW8oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIG9uU3RkRXJyKGNodW5rOiBzdHJpbmcgfCBCdWZmZXIsIHRlc3Q6IHZvaWQgfCBUZXN0Q2FzZSwgcmVzdWx0OiB2b2lkIHwgVGVzdFJlc3VsdCkge1xuICAgIGlmICh0ZXN0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBwcm9jZXNzLnN0ZGVyci53cml0ZShjaHVuayk7XG4gICAgfVxuXG4gICAgaWYgKGNodW5rIGluc3RhbmNlb2YgQnVmZmVyKSB7XG4gICAgICBjaHVuayA9IGNodW5rLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgdGhpcy50ZXN0U3RydWN0dXJlLnRlc3RTdGRFcnIobmV3IFBsYXl3cmlnaHRUZXN0Tm9kZSh0ZXN0IGFzIFRlc3RDYXNlKSwgY2h1bmspXG4gIH1cblxuICBvblN0ZE91dChjaHVuazogc3RyaW5nIHwgQnVmZmVyLCB0ZXN0OiB2b2lkIHwgVGVzdENhc2UsIHJlc3VsdDogdm9pZCB8IFRlc3RSZXN1bHQpIHtcbiAgICBpZiAodGVzdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gcHJvY2Vzcy5zdGRvdXQud3JpdGUoY2h1bmspO1xuICAgIH1cblxuICAgIGlmIChjaHVuayBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgY2h1bmsgPSBjaHVuay50b1N0cmluZygpO1xuICAgIH1cblxuICAgIHRoaXMudGVzdFN0cnVjdHVyZS50ZXN0U3RkT3V0KG5ldyBQbGF5d3JpZ2h0VGVzdE5vZGUodGVzdCBhcyBUZXN0Q2FzZSksIGNodW5rKVxuICB9XG5cbiAgb25CZWdpbihjb25maWc6IEZ1bGxDb25maWcsIHN1aXRlOiBTdWl0ZSkge1xuICAgIHRoaXMudGVzdFN0cnVjdHVyZS5zdGFydFRlc3RpbmcobmV3IFBsYXl3cmlnaHRTdWl0Tm9kZShzdWl0ZSkpXG4gICAgLy8gcm9vdFxuICAgIHRoaXMudGVzdFN0cnVjdHVyZS5zdGFydFN1aXRlKG5ldyBQbGF5d3JpZ2h0U3VpdE5vZGUoc3VpdGUpKVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICBvblRlc3RCZWdpbih0ZXN0OiBUZXN0Q2FzZSwgcmVzdWx0OiBUZXN0UmVzdWx0KTogdm9pZCB7XG4gICAgbGV0IHN1aXRlOiBQbGF5d3JpZ2h0U3VpdE5vZGUgfCB1bmRlZmluZWQgPSBuZXcgUGxheXdyaWdodFN1aXROb2RlKHRlc3QucGFyZW50KVxuICAgIGxldCBzdWl0ZXNUb1N0YXJ0OiBQbGF5d3JpZ2h0U3VpdE5vZGVbXSA9IFtdXG5cbiAgICB3aGlsZSAoc3VpdGUgIT09IHVuZGVmaW5lZCAmJiBzdWl0ZS5zdGF0dXMgPT09IFRlc3ROb2RlU3RhdHVzLk5vdFN0YXJ0ZWQpIHtcbiAgICAgIHN1aXRlc1RvU3RhcnQucHVzaChzdWl0ZSlcbiAgICAgIGlmIChzdWl0ZS5uYXRpdmVTdWl0ZS5wYXJlbnQgPT09IHVuZGVmaW5lZCkgc3VpdGUgPSB1bmRlZmluZWRcbiAgICAgIGVsc2Ugc3VpdGUgPSBuZXcgUGxheXdyaWdodFN1aXROb2RlKHN1aXRlLm5hdGl2ZVN1aXRlLnBhcmVudClcbiAgICB9XG5cbiAgICBzdWl0ZXNUb1N0YXJ0LnJldmVyc2UoKS5mb3JFYWNoKChzdWl0ZTogUGxheXdyaWdodFN1aXROb2RlKSA9PiB7XG4gICAgICB0aGlzLnRlc3RTdHJ1Y3R1cmUuc3RhcnRTdWl0ZShzdWl0ZSlcbiAgICB9KVxuXG4gICAgdGhpcy50ZXN0U3RydWN0dXJlLnN0YXJ0VGVzdChuZXcgUGxheXdyaWdodFRlc3ROb2RlKHRlc3QpKVxuXG4gICAgaWYgKHRlc3QuZXhwZWN0ZWRTdGF0dXMgPT0gJ3NraXBwZWQnKSB7XG4gICAgICB0aGlzLnRlc3RTdHJ1Y3R1cmUuaWdub3JlVGVzdChuZXcgUGxheXdyaWdodFRlc3ROb2RlKHRlc3QpKVxuICAgIH1cbiAgfVxuXG4gIG9uU3RlcEJlZ2luKHRlc3Q6IFRlc3RDYXNlLCByZXN1bHQ6IFRlc3RSZXN1bHQsIHN0ZXA6IFRlc3RTdGVwKSB7XG4gICAgdGhpcy50ZXN0U3RydWN0dXJlLnN0YXJ0U3RlcChzdGVwKVxuICB9XG5cbiAgb25TdGVwRW5kKHRlc3Q6IFRlc3RDYXNlLCByZXN1bHQ6IFRlc3RSZXN1bHQsIHN0ZXA6IFRlc3RTdGVwKSB7XG4gICAgdGhpcy50ZXN0U3RydWN0dXJlLmZpbmlzaFN0ZXAoc3RlcClcbiAgfVxuXG4gIG9uVGVzdEVuZCh0ZXN0OiBUZXN0Q2FzZSwgcmVzdWx0OiBUZXN0UmVzdWx0KSB7XG4gICAgLy8gSWYgdGhlIHRlc3Qgc3RhdHVzIGlzIGludGVycnVwdGVkLCBkb24ndCBoYXZlIHRvIGZpbmlzaCB0ZXN0IGluIHN0cnVjdHVyZSwgaXQgd2lsbCBiZSBtYXJrZWQgYXMgaW50ZXJydXB0ZWQgYnkgZGVmYXVsdFxuICAgIGlmIChyZXN1bHQuc3RhdHVzID09IFwiaW50ZXJydXB0ZWRcIikgcmV0dXJuO1xuXG4gICAgY29uc3QgZXJyb3I6IEVycm9yID0gKHRlc3Qub3V0Y29tZSgpID09IFwidW5leHBlY3RlZFwiKSA/IHRoaXMuYnVpbGRFcnJvcihyZXN1bHQpIDogbnVsbDtcbiAgICB0aGlzLnRlc3RTdHJ1Y3R1cmUuZmluaXNoVGVzdChuZXcgUGxheXdyaWdodFRlc3ROb2RlKHRlc3QpLCBlcnJvcilcblxuICAgIGxldCBzdWl0ZTogUGxheXdyaWdodFN1aXROb2RlIHwgdW5kZWZpbmVkID0gbmV3IFBsYXl3cmlnaHRTdWl0Tm9kZSh0ZXN0LnBhcmVudClcbiAgICAvLyB0ZXJtaW5hdGUgYWxsIGZpbmlzaGVkIHN1aXRlcyB1cCB0aGUgdGVzdCBzdHJ1Y3RydXJlXG4gICAgd2hpbGUgKHN1aXRlICE9PSB1bmRlZmluZWQgJiYgc3VpdGUudGVzdHMuZXZlcnkoKHQ6IFBsYXl3cmlnaHRUZXN0Tm9kZSkgPT4gdC5zdGF0dXMgPT09IFRlc3ROb2RlU3RhdHVzLkZpbmlzaGVkKSAmJlxuICAgIHN1aXRlLnN1aXRlcy5ldmVyeSgoczogUGxheXdyaWdodFN1aXROb2RlKSA9PiBzLnN0YXR1cyA9PT0gVGVzdE5vZGVTdGF0dXMuRmluaXNoZWQpKSB7XG4gICAgICB0aGlzLnRlc3RTdHJ1Y3R1cmUuZmluaXNoU3VpdGUoc3VpdGUpXG4gICAgICBpZiAoc3VpdGUubmF0aXZlU3VpdGUucGFyZW50ID09PSB1bmRlZmluZWQpIHN1aXRlID0gdW5kZWZpbmVkXG4gICAgICBlbHNlIHN1aXRlID0gbmV3IFBsYXl3cmlnaHRTdWl0Tm9kZShzdWl0ZS5uYXRpdmVTdWl0ZS5wYXJlbnQpXG4gICAgfVxuICB9XG5cbiAgb25FbmQocmVzdWx0OiBGdWxsUmVzdWx0KSB7XG4gICAgaWYgKHRoaXMuZ2xvYmFsRXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIHByb2Nlc3Muc3RkZXJyLndyaXRlKHRoaXMuZ2xvYmFsRXJyb3JzLmpvaW4oXCJcXG5cIiksICgpID0+IHtcbiAgICAgICAgdGhpcy50ZXN0U3RydWN0dXJlLmZpbmlzaFRlc3RpbmcoKVxuICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy50ZXN0U3RydWN0dXJlLmZpbmlzaFRlc3RpbmcoKVxuICAgIH1cbiAgfVxuXG4gIG9uRXJyb3IoZXJyb3I6IFRlc3RFcnJvcikge1xuICAgIGNvbnN0IFttZXNzYWdlLCBzdGFja10gPSB0aGlzLm5vcm1hbGl6ZUZhaWx1cmVNZXNzYWdlQW5kU3RhY2soZXJyb3IubWVzc2FnZSwgZXJyb3Iuc3RhY2spXG4gICAgdGhpcy5nbG9iYWxFcnJvcnMucHVzaChtZXNzYWdlICsgc3RhY2spXG4gIH1cblxuICBwcml2YXRlIGJ1aWxkRXJyb3IocmVzdWx0OiBUZXN0UmVzdWx0KTogRXJyb3Ige1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRFcnJvcnMgPSByZXN1bHQuZXJyb3JzXG4gICAgICAubWFwKChlcnJvcjogRXJyb3IpID0+IHRoaXMubm9ybWFsaXplRmFpbHVyZU1lc3NhZ2VBbmRTdGFjayhlcnJvci5tZXNzYWdlLCBlcnJvci5zdGFjaykpXG5cbiAgICBjb25zdCBzdGFjayA9IG5vcm1hbGl6ZWRFcnJvcnMubWFwKHZhbHVlID0+IHZhbHVlWzFdKS5maW5kKHZhbHVlID0+IHZhbHVlICE9IG51bGwpID8/IFwiXCJcbiAgICBjb25zdCBtZXNzYWdlID0gbm9ybWFsaXplZEVycm9ycy5tYXAodmFsdWUgPT4gdmFsdWVbMF0pLmpvaW4oXCJcXG5cIilcblxuICAgIHJldHVybiA8RXJyb3I+e1xuICAgICAgbmFtZTogJ0Vycm9yJywgLy9UT0RPOiBDbGFyaWZ5IHRoZSBuYW1lXG4gICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgc3RhY2s6IHN0YWNrXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBub3JtYWxpemVGYWlsdXJlTWVzc2FnZUFuZFN0YWNrKG1lc3NhZ2UgPzogc3RyaW5nLCBzdGFjayA/OiBzdHJpbmcpOiBbc3RyaW5nLCBzdHJpbmddIHtcbiAgICBpZiAoc3RhY2sgIT0gbnVsbCkge1xuICAgICAgaWYgKHN0YWNrLmluZGV4T2YobWVzc2FnZSkgPT09IDApIHtcbiAgICAgICAgc3RhY2sgPSBzdGFjay5zdWJzdHJpbmcobWVzc2FnZS5sZW5ndGgpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IG5ld01lc3NhZ2UgPSBcIkVycm9yOiBcIiArIG1lc3NhZ2U7XG4gICAgICAgIGlmIChzdGFjay5pbmRleE9mKG5ld01lc3NhZ2UpID09PSAwKSB7XG4gICAgICAgICAgc3RhY2sgPSBzdGFjay5zdWJzdHJpbmcobmV3TWVzc2FnZS5sZW5ndGgpO1xuICAgICAgICAgIG1lc3NhZ2UgPSBuZXdNZXNzYWdlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChtZXNzYWdlICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2UoYW5zaVJlZ2V4LCAnJyk7XG4gICAgfVxuICAgIHJldHVybiBbbWVzc2FnZSwgc3RhY2tdXG4gIH1cbn1cblxuZXhwb3J0ID0gUGxheXdyaWdodEpCUmVwb3J0ZXJcbiJdfQ==