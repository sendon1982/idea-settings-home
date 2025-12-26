"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamcityFormatCountMessage = exports.teamcityFormatMessage = void 0;
var testNodeStatus_1 = require("./testNodeStatus");
var reporterUtils_1 = require("./reporterUtils");
function teamcityFormatMessage(message, node, extraProps) {
    if (node === void 0) { node = null; }
    if (extraProps === void 0) { extraProps = ""; }
    var props = extraProps !== "" ? " " + extraProps + " " : "";
    var nodeValues = node ? (" " + node.toKeyValueString()) : "";
    return "##teamcity[".concat(message).concat(props).concat(nodeValues, "]");
}
exports.teamcityFormatMessage = teamcityFormatMessage;
function teamcityFormatCountMessage(count) {
    return "##teamcity[testCount count='".concat(count, "']");
}
exports.teamcityFormatCountMessage = teamcityFormatCountMessage;
var TestEventsHandler = /** @class */ (function () {
    /**
     * @param write Custom `write` function, redefined to write to file for tests
     */
    function TestEventsHandler(write) {
        if (write === void 0) { write = console.log; }
        this.write = write;
        this.nextNodeId = 0;
        this.write = write;
    }
    TestEventsHandler.prototype.testStdOut = function (test, message) {
        this.write(teamcityFormatMessage("testStdOut", test, "out='".concat(reporterUtils_1.default.escapeAttributeValue(message), "'")));
    };
    TestEventsHandler.prototype.testStdErr = function (test, message) {
        this.write(teamcityFormatMessage("testStdErr", test, "out='".concat(reporterUtils_1.default.escapeAttributeValue(message), "'")));
    };
    /**
     * Starts testing and registers all test nodes
     * @param rootSuit - top most suit element i.e. without parent
     */
    TestEventsHandler.prototype.startTesting = function (rootSuit) {
        this.write(teamcityFormatMessage("enteredTheMatrix"));
        this.write(teamcityFormatMessage("testingStarted"));
        var count = this.registerTestNodes(rootSuit, this.nextNodeId++);
        this.write(teamcityFormatCountMessage(count));
    };
    /**
     * @param suite
     * @see {@link com.intellij.execution.testframework.sm.runner.OutputToGeneralTestEventsConverter.MyServiceMessageVisitor#visitTestSuiteStarted visitTestSuiteStarted}
     */
    TestEventsHandler.prototype.startSuite = function (suite) {
        if (suite.status !== testNodeStatus_1.default.NotStarted)
            return;
        if (suite.isRoot)
            return;
        suite.status = testNodeStatus_1.default.Running;
        this.write(teamcityFormatMessage("testSuiteStarted", suite));
    };
    /**
     * @param test
     * @see {@link com.intellij.execution.testframework.sm.runner.OutputToGeneralTestEventsConverter.MyServiceMessageVisitor#visitTestStarted visitTestStarted}
     */
    TestEventsHandler.prototype.startTest = function (test) {
        if (test.status !== testNodeStatus_1.default.NotStarted)
            return;
        test.status = testNodeStatus_1.default.Running;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.write(teamcityFormatMessage("testStarted", test));
    };
    TestEventsHandler.prototype.ignoreTest = function (test) {
        if (test.status !== testNodeStatus_1.default.Running)
            return;
        test.status = testNodeStatus_1.default.Finished;
        this.write(teamcityFormatMessage("testIgnored", test, "message='Pending test |'".concat(test.title, "|''")));
    };
    /**
     * @param test
     * @param error - if provided triggers error message, instead of success
     * @see {@link com.intellij.execution.testframework.sm.runner.OutputToGeneralTestEventsConverter.MyServiceMessageVisitor#visitTestFinished visitTestFinished}
     * @see {@link com.intellij.execution.testframework.sm.runner.OutputToGeneralTestEventsConverter.MyServiceMessageVisitor#visitTestFailed visitTestFailed}
     */
    TestEventsHandler.prototype.finishTest = function (test, error) {
        if (error === void 0) { error = null; }
        if (test.status !== testNodeStatus_1.default.Running)
            return;
        test.status = testNodeStatus_1.default.Finished;
        if (error === null) {
            this.write(teamcityFormatMessage("testFinished", test));
        }
        else {
            this.write(teamcityFormatMessage("testFailed", test, "message='".concat(reporterUtils_1.default.escapeAttributeValue(error.message), "' details='").concat(reporterUtils_1.default.escapeAttributeValue(error.stack), "'")));
            // TODO advanced error printing with 'expect' and 'actual' arguments}
        }
    };
    /**
     * @param suite
     * @see {@link com.intellij.execution.testframework.sm.runner.OutputToGeneralTestEventsConverter.MyServiceMessageVisitor#visitTestSuiteFinished visitTestSuiteFinished}
     */
    TestEventsHandler.prototype.finishSuite = function (suite) {
        if (suite.status !== testNodeStatus_1.default.Running)
            return;
        if (suite.isRoot)
            return;
        suite.status = testNodeStatus_1.default.Finished;
        this.write(teamcityFormatMessage("testSuiteFinished", suite));
    };
    TestEventsHandler.prototype.finishTesting = function () {
        this.write(teamcityFormatMessage("testingFinished"));
    };
    /**
     * Builds structure of test nodes as tree
     * @param rootSuite
     * @param parentNodeId
     * @returns number of registered nodes
     * @private
     */
    TestEventsHandler.prototype.registerTestNodes = function (rootSuite, parentNodeId) {
        var _this = this;
        var count = 0;
        if (!rootSuite.isRoot) {
            rootSuite.setUpTestNode(this.nextNodeId++, parentNodeId);
            rootSuite.status = testNodeStatus_1.default.NotStarted;
        }
        var validParentNodeId = rootSuite["nodeId"] === undefined ? parentNodeId : rootSuite["nodeId"];
        rootSuite.tests.forEach(function (test) {
            count++;
            test.setUpTestNode(_this.nextNodeId++, validParentNodeId);
            test.status = testNodeStatus_1.default.NotStarted;
        });
        rootSuite.suites.forEach(function (suite) {
            count += _this.registerTestNodes(suite, validParentNodeId);
        });
        return count;
    };
    return TestEventsHandler;
}());
exports.default = TestEventsHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdEV2ZW50c0hhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29yZS90ZXN0RXZlbnRzSGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxtREFBNkM7QUFDN0MsaURBQTJDO0FBZ0IzQyxTQUFnQixxQkFBcUIsQ0FBQyxPQUFvQixFQUFFLElBQTRCLEVBQUUsVUFBdUI7SUFBckQscUJBQUEsRUFBQSxXQUE0QjtJQUFFLDJCQUFBLEVBQUEsZUFBdUI7SUFDL0csSUFBTSxLQUFLLEdBQUcsVUFBVSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLFVBQVUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUM3RCxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUM5RCxPQUFPLHFCQUFjLE9BQU8sU0FBRyxLQUFLLFNBQUcsVUFBVSxNQUFHLENBQUE7QUFDdEQsQ0FBQztBQUpELHNEQUlDO0FBRUQsU0FBZ0IsMEJBQTBCLENBQUMsS0FBYTtJQUN0RCxPQUFPLHNDQUErQixLQUFLLE9BQUksQ0FBQTtBQUNqRCxDQUFDO0FBRkQsZ0VBRUM7QUFFRDtJQUdFOztPQUVHO0lBQ0gsMkJBQStCLEtBQTBDO1FBQTFDLHNCQUFBLEVBQUEsUUFBK0IsT0FBTyxDQUFDLEdBQUc7UUFBMUMsVUFBSyxHQUFMLEtBQUssQ0FBcUM7UUFMakUsZUFBVSxHQUFHLENBQUMsQ0FBQztRQU1yQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBRUQsc0NBQVUsR0FBVixVQUFXLElBQWMsRUFBRSxPQUFlO1FBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsWUFBWSxFQUFFLElBQUksRUFBRSxlQUFRLHVC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LE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO1lBQzdCLEtBQUssSUFBSSxLQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQUE7UUFDM0QsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUE1SEQsSUE0SEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3VpdGVOb2RlIGZyb20gXCIuL3N1aXRlTm9kZVwiXG5pbXBvcnQgVGVzdE5vZGUgZnJvbSBcIi4vdGVzdE5vZGVcIlxuaW1wb3J0IFRlc3ROb2RlU3RhdHVzIGZyb20gXCIuL3Rlc3ROb2RlU3RhdHVzXCJcbmltcG9ydCBSZXBvcnRlclV0aWxzIGZyb20gXCIuL3JlcG9ydGVyVXRpbHNcIlxuXG5leHBvcnQgdHlwZSBUZXN0TWVzc2FnZSA9IFwiZW50ZXJlZFRoZU1hdHJpeFwiXG4gIHwgXCJ0ZXN0aW5nU3RhcnRlZFwiXG4gIHwgXCJ0ZXN0U3VpdGVTdGFydGVkXCJcbiAgfCBcInRlc3RTdGFydGVkXCJcbiAgfCBcInRlc3RTdGVwU3RhcnRlZFwiXG4gIHwgXCJ0ZXN0U3RlcEZpbmlzaGVkXCJcbiAgfCBcInRlc3RGaW5pc2hlZFwiXG4gIHwgXCJ0ZXN0RmFpbGVkXCJcbiAgfCBcInRlc3RJZ25vcmVkXCJcbiAgfCBcInRlc3RTdWl0ZUZpbmlzaGVkXCJcbiAgfCBcInRlc3RpbmdGaW5pc2hlZFwiXG4gIHwgXCJ0ZXN0U3RkT3V0XCJcbiAgfCBcInRlc3RTdGRFcnJcIlxuXG5leHBvcnQgZnVuY3Rpb24gdGVhbWNpdHlGb3JtYXRNZXNzYWdlKG1lc3NhZ2U6IFRlc3RNZXNzYWdlLCBub2RlOiBUZXN0Tm9kZSB8IG51bGwgPSBudWxsLCBleHRyYVByb3BzOiBzdHJpbmcgPSBcIlwiKSB7XG4gIGNvbnN0IHByb3BzID0gZXh0cmFQcm9wcyAhPT0gXCJcIiA/IFwiIFwiICsgZXh0cmFQcm9wcyArIFwiIFwiIDogXCJcIlxuICBjb25zdCBub2RlVmFsdWVzID0gbm9kZSA/IChcIiBcIiArIG5vZGUudG9LZXlWYWx1ZVN0cmluZygpKSA6IFwiXCJcbiAgcmV0dXJuIGAjI3RlYW1jaXR5WyR7bWVzc2FnZX0ke3Byb3BzfSR7bm9kZVZhbHVlc31dYFxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGVhbWNpdHlGb3JtYXRDb3VudE1lc3NhZ2UoY291bnQ6IG51bWJlcikge1xuICByZXR1cm4gYCMjdGVhbWNpdHlbdGVzdENvdW50IGNvdW50PScke2NvdW50fSddYFxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXN0RXZlbnRzSGFuZGxlciB7XG4gIHByaXZhdGUgbmV4dE5vZGVJZCA9IDA7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB3cml0ZSBDdXN0b20gYHdyaXRlYCBmdW5jdGlvbiwgcmVkZWZpbmVkIHRvIHdyaXRlIHRvIGZpbGUgZm9yIHRlc3RzXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcmVhZG9ubHkgd3JpdGU6IChzdHI6IHN0cmluZykgPT4gdm9pZCA9IGNvbnNvbGUubG9nKSB7XG4gICAgdGhpcy53cml0ZSA9IHdyaXRlO1xuICB9XG5cbiAgdGVzdFN0ZE91dCh0ZXN0OiBUZXN0Tm9kZSwgbWVzc2FnZTogc3RyaW5nKSB7XG4gICAgdGhpcy53cml0ZSh0ZWFtY2l0eUZvcm1hdE1lc3NhZ2UoXCJ0ZXN0U3RkT3V0XCIsIHRlc3QsIGBvdXQ9JyR7UmVwb3J0ZXJVdGlscy5lc2NhcGVBdHRyaWJ1dGVWYWx1ZShtZXNzYWdlKX0nYCkpXG4gIH1cblxuICB0ZXN0U3RkRXJyKHRlc3Q6IFRlc3ROb2RlLCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICB0aGlzLndyaXRlKHRlYW1jaXR5Rm9ybWF0TWVzc2FnZShcInRlc3RTdGRFcnJcIiwgdGVzdCwgYG91dD0nJHtSZXBvcnRlclV0aWxzLmVzY2FwZUF0dHJpYnV0ZVZhbHVlKG1lc3NhZ2UpfSdgKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGVzdGluZyBhbmQgcmVnaXN0ZXJzIGFsbCB0ZXN0IG5vZGVzXG4gICAqIEBwYXJhbSByb290U3VpdCAtIHRvcCBtb3N0IHN1aXQgZWxlbWVudCBpLmUuIHdpdGhvdXQgcGFyZW50XG4gICAqL1xuICBzdGFydFRlc3Rpbmcocm9vdFN1aXQ6IFN1aXRlTm9kZSk6IHZvaWQge1xuICAgIHRoaXMud3JpdGUodGVhbWNpdHlGb3JtYXRNZXNzYWdlKFwiZW50ZXJlZFRoZU1hdHJpeFwiKSlcbiAgICB0aGlzLndyaXRlKHRlYW1jaXR5Rm9ybWF0TWVzc2FnZShcInRlc3RpbmdTdGFydGVkXCIpKVxuXG4gICAgY29uc3QgY291bnQgPSB0aGlzLnJlZ2lzdGVyVGVzdE5vZGVzKHJvb3RTdWl0LCB0aGlzLm5leHROb2RlSWQrKylcbiAgICB0aGlzLndyaXRlKHRlYW1jaXR5Rm9ybWF0Q291bnRNZXNzYWdlKGNvdW50KSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHN1aXRlXG4gICAqIEBzZWUge0BsaW5rIGNvbS5pbnRlbGxpai5leGVjdXRpb24udGVzdGZyYW1ld29yay5zbS5ydW5uZXIuT3V0cHV0VG9HZW5lcmFsVGVzdEV2ZW50c0NvbnZlcnRlci5NeVNlcnZpY2VNZXNzYWdlVmlzaXRvciN2aXNpdFRlc3RTdWl0ZVN0YXJ0ZWQgdmlzaXRUZXN0U3VpdGVTdGFydGVkfVxuICAgKi9cbiAgc3RhcnRTdWl0ZShzdWl0ZTogU3VpdGVOb2RlKTogdm9pZCB7XG4gICAgaWYgKHN1aXRlLnN0YXR1cyAhPT0gVGVzdE5vZGVTdGF0dXMuTm90U3RhcnRlZCkgcmV0dXJuO1xuICAgIGlmIChzdWl0ZS5pc1Jvb3QpIHJldHVybjtcblxuICAgIHN1aXRlLnN0YXR1cyA9IFRlc3ROb2RlU3RhdHVzLlJ1bm5pbmdcblxuICAgIHRoaXMud3JpdGUodGVhbWNpdHlGb3JtYXRNZXNzYWdlKFwidGVzdFN1aXRlU3RhcnRlZFwiLCBzdWl0ZSkpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHRlc3RcbiAgICogQHNlZSB7QGxpbmsgY29tLmludGVsbGlqLmV4ZWN1dGlvbi50ZXN0ZnJhbWV3b3JrLnNtLnJ1bm5lci5PdXRwdXRUb0dlbmVyYWxUZXN0RXZlbnRzQ29udmVydGVyLk15U2VydmljZU1lc3NhZ2VWaXNpdG9yI3Zpc2l0VGVzdFN0YXJ0ZWQgdmlzaXRUZXN0U3RhcnRlZH1cbiAgICovXG4gIHN0YXJ0VGVzdCh0ZXN0OiBUZXN0Tm9kZSk6IHZvaWQge1xuICAgIGlmICh0ZXN0LnN0YXR1cyAhPT0gVGVzdE5vZGVTdGF0dXMuTm90U3RhcnRlZCkgcmV0dXJuO1xuICAgIHRlc3Quc3RhdHVzID0gVGVzdE5vZGVTdGF0dXMuUnVubmluZ1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgdGhpcy53cml0ZSh0ZWFtY2l0eUZvcm1hdE1lc3NhZ2UoXCJ0ZXN0U3RhcnRlZFwiLCB0ZXN0KSlcbiAgfVxuXG4gIGlnbm9yZVRlc3QodGVzdDogVGVzdE5vZGUpOiB2b2lkIHtcbiAgICBpZiAodGVzdC5zdGF0dXMgIT09IFRlc3ROb2RlU3RhdHVzLlJ1bm5pbmcpIHJldHVybjtcbiAgICB0ZXN0LnN0YXR1cyA9IFRlc3ROb2RlU3RhdHVzLkZpbmlzaGVkXG4gICAgdGhpcy53cml0ZSh0ZWFtY2l0eUZvcm1hdE1lc3NhZ2UoXCJ0ZXN0SWdub3JlZFwiLCB0ZXN0LCBgbWVzc2FnZT0nUGVuZGluZyB0ZXN0IHwnJHt0ZXN0LnRpdGxlfXwnJ2ApKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB0ZXN0XG4gICAqIEBwYXJhbSBlcnJvciAtIGlmIHByb3ZpZGVkIHRyaWdnZXJzIGVycm9yIG1lc3NhZ2UsIGluc3RlYWQgb2Ygc3VjY2Vzc1xuICAgKiBAc2VlIHtAbGluayBjb20uaW50ZWxsaWouZXhlY3V0aW9uLnRlc3RmcmFtZXdvcmsuc20ucnVubmVyLk91dHB1dFRvR2VuZXJhbFRlc3RFdmVudHNDb252ZXJ0ZXIuTXlTZXJ2aWNlTWVzc2FnZVZpc2l0b3IjdmlzaXRUZXN0RmluaXNoZWQgdmlzaXRUZXN0RmluaXNoZWR9XG4gICAqIEBzZWUge0BsaW5rIGNvbS5pbnRlbGxpai5leGVjdXRpb24udGVzdGZyYW1ld29yay5zbS5ydW5uZXIuT3V0cHV0VG9HZW5lcmFsVGVzdEV2ZW50c0NvbnZlcnRlci5NeVNlcnZpY2VNZXNzYWdlVmlzaXRvciN2aXNpdFRlc3RGYWlsZWQgdmlzaXRUZXN0RmFpbGVkfVxuICAgKi9cbiAgZmluaXNoVGVzdCh0ZXN0OiBUZXN0Tm9kZSwgZXJyb3I6IEVycm9yID0gbnVsbCk6IHZvaWQge1xuICAgIGlmICh0ZXN0LnN0YXR1cyAhPT0gVGVzdE5vZGVTdGF0dXMuUnVubmluZykgcmV0dXJuO1xuICAgIHRlc3Quc3RhdHVzID0gVGVzdE5vZGVTdGF0dXMuRmluaXNoZWRcbiAgICBpZiAoZXJyb3IgPT09IG51bGwpIHtcbiAgICAgIHRoaXMud3JpdGUodGVhbWNpdHlGb3JtYXRNZXNzYWdlKFwidGVzdEZpbmlzaGVkXCIsIHRlc3QpKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMud3JpdGUodGVhbWNpdHlGb3JtYXRNZXNzYWdlKFwidGVzdEZhaWxlZFwiLCB0ZXN0LCBgbWVzc2FnZT0nJHtSZXBvcnRlclV0aWxzLmVzY2FwZUF0dHJpYnV0ZVZhbHVlKGVycm9yLm1lc3NhZ2UpfScgZGV0YWlscz0nJHtSZXBvcnRlclV0aWxzLmVzY2FwZUF0dHJpYnV0ZVZhbHVlKGVycm9yLnN0YWNrKX0nYCkpXG4gICAgICAvLyBUT0RPIGFkdmFuY2VkIGVycm9yIHByaW50aW5nIHdpdGggJ2V4cGVjdCcgYW5kICdhY3R1YWwnIGFyZ3VtZW50c31cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHN1aXRlXG4gICAqIEBzZWUge0BsaW5rIGNvbS5pbnRlbGxpai5leGVjdXRpb24udGVzdGZyYW1ld29yay5zbS5ydW5uZXIuT3V0cHV0VG9HZW5lcmFsVGVzdEV2ZW50c0NvbnZlcnRlci5NeVNlcnZpY2VNZXNzYWdlVmlzaXRvciN2aXNpdFRlc3RTdWl0ZUZpbmlzaGVkIHZpc2l0VGVzdFN1aXRlRmluaXNoZWR9XG4gICAqL1xuICBmaW5pc2hTdWl0ZShzdWl0ZTogU3VpdGVOb2RlKTogdm9pZCB7XG4gICAgaWYgKHN1aXRlLnN0YXR1cyAhPT0gVGVzdE5vZGVTdGF0dXMuUnVubmluZylcbiAgICAgIHJldHVybjtcblxuICAgIGlmIChzdWl0ZS5pc1Jvb3QpXG4gICAgICByZXR1cm47XG5cbiAgICBzdWl0ZS5zdGF0dXMgPSBUZXN0Tm9kZVN0YXR1cy5GaW5pc2hlZFxuICAgIHRoaXMud3JpdGUodGVhbWNpdHlGb3JtYXRNZXNzYWdlKFwidGVzdFN1aXRlRmluaXNoZWRcIiwgc3VpdGUpKVxuICB9XG5cbiAgZmluaXNoVGVzdGluZygpOiB2b2lkIHtcbiAgICB0aGlzLndyaXRlKHRlYW1jaXR5Rm9ybWF0TWVzc2FnZShcInRlc3RpbmdGaW5pc2hlZFwiKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZHMgc3RydWN0dXJlIG9mIHRlc3Qgbm9kZXMgYXMgdHJlZVxuICAgKiBAcGFyYW0gcm9vdFN1aXRlXG4gICAqIEBwYXJhbSBwYXJlbnROb2RlSWRcbiAgICogQHJldHVybnMgbnVtYmVyIG9mIHJlZ2lzdGVyZWQgbm9kZXNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHByaXZhdGUgcmVnaXN0ZXJUZXN0Tm9kZXMocm9vdFN1aXRlOiBTdWl0ZU5vZGUsIHBhcmVudE5vZGVJZDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGlmICghcm9vdFN1aXRlLmlzUm9vdCkge1xuICAgICAgcm9vdFN1aXRlLnNldFVwVGVzdE5vZGUodGhpcy5uZXh0Tm9kZUlkKyssIHBhcmVudE5vZGVJZClcbiAgICAgIHJvb3RTdWl0ZS5zdGF0dXMgPSBUZXN0Tm9kZVN0YXR1cy5Ob3RTdGFydGVkXG4gICAgfVxuXG4gICAgY29uc3QgdmFsaWRQYXJlbnROb2RlSWQ6IG51bWJlciA9IHJvb3RTdWl0ZVtcIm5vZGVJZFwiXSA9PT0gdW5kZWZpbmVkID8gcGFyZW50Tm9kZUlkIDogcm9vdFN1aXRlW1wibm9kZUlkXCJdXG5cbiAgICByb290U3VpdGUudGVzdHMuZm9yRWFjaCgodGVzdCkgPT4ge1xuICAgICAgY291bnQrK1xuICAgICAgdGVzdC5zZXRVcFRlc3ROb2RlKHRoaXMubmV4dE5vZGVJZCsrLCB2YWxpZFBhcmVudE5vZGVJZClcbiAgICAgIHRlc3Quc3RhdHVzID0gVGVzdE5vZGVTdGF0dXMuTm90U3RhcnRlZFxuICAgIH0pO1xuICAgIHJvb3RTdWl0ZS5zdWl0ZXMuZm9yRWFjaCgoc3VpdGUpID0+IHtcbiAgICAgIGNvdW50ICs9IHRoaXMucmVnaXN0ZXJUZXN0Tm9kZXMoc3VpdGUsIHZhbGlkUGFyZW50Tm9kZUlkKVxuICAgIH0pO1xuICAgIHJldHVybiBjb3VudFxuICB9XG59Il19