"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testNodeStatus_1 = require("./testNodeStatus");
var reporterUtils_1 = require("./reporterUtils");
/**
 * Represents basic Test Node from test frameworks
 * @see {@link com.intellij.execution.testframework.sm.runner.events.TreeNodeEvent TreeNodeEvent}
 */
var TestNode = /** @class */ (function () {
    function TestNode(nativeElement) {
        this.nativeElement = nativeElement;
    }
    Object.defineProperty(TestNode.prototype, "protocol", {
        get: function () {
            return this.nodeType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TestNode.prototype, "nodeId", {
        get: function () {
            return this.nativeElement["nodeId"];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TestNode.prototype, "parentNodeId", {
        get: function () {
            return this.nativeElement["parentNodeId"];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TestNode.prototype, "status", {
        get: function () {
            return this.nativeElement["testNodeStatus"];
        },
        set: function (status) {
            this.nativeElement["testNodeStatus"] = status;
        },
        enumerable: false,
        configurable: true
    });
    TestNode.prototype.setUpTestNode = function (nodeId, parentNodeIt) {
        this.nativeElement["nodeId"] = nodeId;
        this.nativeElement["parentNodeId"] = parentNodeIt;
    };
    TestNode.prototype.composeLocationHint = function (pathElements) {
        return pathElements.map(function (p) { return reporterUtils_1.default.escapeAttributeValue(p).replace(".", "\\."); }).join(".");
    };
    TestNode.prototype.getLocationHint = function (protocol, filePath, locationInFile) {
        if (locationInFile == null || locationInFile.trim().length == 0) {
            // Don't need to escape dots in the path for files, see com/intellij/execution/testframework/sm/FileUrlProvider.java:78
            return reporterUtils_1.default.escapeAttributeValue(protocol + "://" + filePath);
        }
        else {
            // But this escape necessary for suites/tests
            filePath = filePath.replace(/\\/g, '\\\\').replace(/\./g, '\\.');
            return reporterUtils_1.default.escapeAttributeValue(protocol + "://" + filePath + "." + locationInFile);
        }
    };
    TestNode.prototype.toKeyValueString = function () {
        return "nodeId='".concat(this.nodeId, "' parentNodeId='").concat(this.parentNodeId, "' name='").concat(reporterUtils_1.default.escapeAttributeValue(this.title), "' running='").concat(this.status === testNodeStatus_1.default.Running ? 'true' : 'false', "' nodeType='").concat(this.nodeType, "' duration='").concat(this.duration, "' locationHint='").concat(this.getLocationHint(this.protocol, this.absoluteFilePath, this.locationInFile), "'");
    };
    return TestNode;
}());
exports.default = TestNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdE5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29yZS90ZXN0Tm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1EQUE2QztBQUM3QyxpREFBMkM7QUFJM0M7OztHQUdHO0FBQ0g7SUFxREUsa0JBQTZCLGFBQWE7UUFBYixrQkFBYSxHQUFiLGFBQWEsQ0FBQTtJQUMxQyxDQUFDO0lBakNELHNCQUFJLDhCQUFRO2FBQVo7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUE7UUFDdEIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSw0QkFBTTthQUFWO1lBQ0UsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ3JDLENBQUM7OztPQUFBO0lBRUQsc0JBQUksa0NBQVk7YUFBaEI7WUFDRSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDM0MsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSw0QkFBTTthQUFWO1lBQ0UsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUE7UUFDN0MsQ0FBQzthQUVELFVBQVcsTUFBc0I7WUFDL0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLE1BQU0sQ0FBQTtRQUMvQyxDQUFDOzs7T0FKQTtJQWFELGdDQUFhLEdBQWIsVUFBYyxNQUFjLEVBQUUsWUFBb0I7UUFDaEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUE7UUFDckMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxZQUFZLENBQUE7SUFDbkQsQ0FBQztJQUtELHNDQUFtQixHQUFuQixVQUFvQixZQUFzQjtRQUN4QyxPQUFPLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSx1QkFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQXpELENBQXlELENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDbkcsQ0FBQztJQUVTLGtDQUFlLEdBQXpCLFVBQTBCLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxjQUF1QjtRQUNuRixJQUFJLGNBQWMsSUFBSSxJQUFJLElBQUksY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDL0QsdUhBQXVIO1lBQ3ZILE9BQU8sdUJBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLEdBQUcsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFBO1NBQ3ZFO2FBQ0k7WUFDSCw2Q0FBNkM7WUFDN0MsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDaEUsT0FBTyx1QkFBYSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsR0FBRyxLQUFLLEdBQUcsUUFBUSxHQUFHLEdBQUcsR0FBRyxjQUFjLENBQUMsQ0FBQTtTQUM5RjtJQUNILENBQUM7SUFFRCxtQ0FBZ0IsR0FBaEI7UUFDRSxPQUFPLGtCQUFXLElBQUksQ0FBQyxNQUFNLDZCQUFtQixJQUFJLENBQUMsWUFBWSxxQkFBVyx1QkFBYSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsd0JBQWMsSUFBSSxDQUFDLE1BQU0sS0FBSyx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLHlCQUFlLElBQUksQ0FBQyxRQUFRLHlCQUFlLElBQUksQ0FBQyxRQUFRLDZCQUFtQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBRyxDQUFBO0lBQ2hXLENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQyxBQTNFRCxJQTJFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXN0Tm9kZVN0YXR1cyBmcm9tIFwiLi90ZXN0Tm9kZVN0YXR1c1wiXG5pbXBvcnQgUmVwb3J0ZXJVdGlscyBmcm9tIFwiLi9yZXBvcnRlclV0aWxzXCJcblxuZXhwb3J0IHR5cGUgTm9kZVR5cGUgPSBcInN1aXRlXCIgfCBcInRlc3RcIiB8IFwic3RlcFwiXG5cbi8qKlxuICogUmVwcmVzZW50cyBiYXNpYyBUZXN0IE5vZGUgZnJvbSB0ZXN0IGZyYW1ld29ya3NcbiAqIEBzZWUge0BsaW5rIGNvbS5pbnRlbGxpai5leGVjdXRpb24udGVzdGZyYW1ld29yay5zbS5ydW5uZXIuZXZlbnRzLlRyZWVOb2RlRXZlbnQgVHJlZU5vZGVFdmVudH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgVGVzdE5vZGUge1xuXG4gIC8qKlxuICAgKiBUaXRsZSBvZiB0aGUgdGVzdCBjYXNlXG4gICAqIEBleGFtcGxlXG4gICAqICAgaXQoJ3RpdGxlJywgKCkgPT4ge3Rlc3RpbmcoKX0pXG4gICAqL1xuICBhYnN0cmFjdCByZWFkb25seSB0aXRsZTogc3RyaW5nO1xuICAvKipcbiAgICogTG9jYXRpb24gaW4gZmlsZSwgc2VwYXJldGVkIGJ5ICcuJ1xuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBsb2NhdGlvbiBpcyAnU3VpdGUnXG4gICAqIGRlc2NyaWJlKCdTdWl0ZScsICgpID0+IHtcbiAgICogICAvLyBsb2NhdGlvbiBpcyAnU3VpdGUudGVzdDEnXG4gICAqICAgaXQoJ3Rlc3QxJywgKCkgPT4gey8vIGNvbnNvbGUuZXIoKX0pXG4gICAqIH0pXG4gICAqL1xuICBhYnN0cmFjdCByZWFkb25seSBsb2NhdGlvbkluRmlsZTogc3RyaW5nO1xuXG4gIGFic3RyYWN0IHJlYWRvbmx5IG5vZGVUeXBlOiBOb2RlVHlwZVxuXG4gIGdldCBwcm90b2NvbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm5vZGVUeXBlXG4gIH1cblxuICBnZXQgbm9kZUlkKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMubmF0aXZlRWxlbWVudFtcIm5vZGVJZFwiXVxuICB9XG5cbiAgZ2V0IHBhcmVudE5vZGVJZCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm5hdGl2ZUVsZW1lbnRbXCJwYXJlbnROb2RlSWRcIl1cbiAgfVxuXG4gIGdldCBzdGF0dXMoKTogVGVzdE5vZGVTdGF0dXMge1xuICAgIHJldHVybiB0aGlzLm5hdGl2ZUVsZW1lbnRbXCJ0ZXN0Tm9kZVN0YXR1c1wiXVxuICB9XG5cbiAgc2V0IHN0YXR1cyhzdGF0dXM6IFRlc3ROb2RlU3RhdHVzKSB7XG4gICAgdGhpcy5uYXRpdmVFbGVtZW50W1widGVzdE5vZGVTdGF0dXNcIl0gPSBzdGF0dXNcbiAgfVxuXG4gIGFic3RyYWN0IGdldCBkdXJhdGlvbigpOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEFic29sdXRlIHBhdGggb2YgZmlsZSBjb250YWluaW5nIHRlc3QgY2FzZVxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0IGFic29sdXRlRmlsZVBhdGgoKTogc3RyaW5nO1xuXG4gIHNldFVwVGVzdE5vZGUobm9kZUlkOiBudW1iZXIsIHBhcmVudE5vZGVJdDogbnVtYmVyKSB7XG4gICAgdGhpcy5uYXRpdmVFbGVtZW50W1wibm9kZUlkXCJdID0gbm9kZUlkXG4gICAgdGhpcy5uYXRpdmVFbGVtZW50W1wicGFyZW50Tm9kZUlkXCJdID0gcGFyZW50Tm9kZUl0XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG5hdGl2ZUVsZW1lbnQpIHtcbiAgfVxuXG4gIGNvbXBvc2VMb2NhdGlvbkhpbnQocGF0aEVsZW1lbnRzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHBhdGhFbGVtZW50cy5tYXAocCA9PiBSZXBvcnRlclV0aWxzLmVzY2FwZUF0dHJpYnV0ZVZhbHVlKHApLnJlcGxhY2UoXCIuXCIsIFwiXFxcXC5cIikpLmpvaW4oXCIuXCIpXG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0TG9jYXRpb25IaW50KHByb3RvY29sOiBzdHJpbmcsIGZpbGVQYXRoOiBzdHJpbmcsIGxvY2F0aW9uSW5GaWxlPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAobG9jYXRpb25JbkZpbGUgPT0gbnVsbCB8fCBsb2NhdGlvbkluRmlsZS50cmltKCkubGVuZ3RoID09IDApIHtcbiAgICAgIC8vIERvbid0IG5lZWQgdG8gZXNjYXBlIGRvdHMgaW4gdGhlIHBhdGggZm9yIGZpbGVzLCBzZWUgY29tL2ludGVsbGlqL2V4ZWN1dGlvbi90ZXN0ZnJhbWV3b3JrL3NtL0ZpbGVVcmxQcm92aWRlci5qYXZhOjc4XG4gICAgICByZXR1cm4gUmVwb3J0ZXJVdGlscy5lc2NhcGVBdHRyaWJ1dGVWYWx1ZShwcm90b2NvbCArIFwiOi8vXCIgKyBmaWxlUGF0aClcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBCdXQgdGhpcyBlc2NhcGUgbmVjZXNzYXJ5IGZvciBzdWl0ZXMvdGVzdHNcbiAgICAgIGZpbGVQYXRoID0gZmlsZVBhdGgucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKS5yZXBsYWNlKC9cXC4vZywgJ1xcXFwuJylcbiAgICAgIHJldHVybiBSZXBvcnRlclV0aWxzLmVzY2FwZUF0dHJpYnV0ZVZhbHVlKHByb3RvY29sICsgXCI6Ly9cIiArIGZpbGVQYXRoICsgXCIuXCIgKyBsb2NhdGlvbkluRmlsZSlcbiAgICB9XG4gIH1cblxuICB0b0tleVZhbHVlU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBub2RlSWQ9JyR7dGhpcy5ub2RlSWR9JyBwYXJlbnROb2RlSWQ9JyR7dGhpcy5wYXJlbnROb2RlSWR9JyBuYW1lPScke1JlcG9ydGVyVXRpbHMuZXNjYXBlQXR0cmlidXRlVmFsdWUodGhpcy50aXRsZSl9JyBydW5uaW5nPScke3RoaXMuc3RhdHVzID09PSBUZXN0Tm9kZVN0YXR1cy5SdW5uaW5nID8gJ3RydWUnIDogJ2ZhbHNlJ30nIG5vZGVUeXBlPScke3RoaXMubm9kZVR5cGV9JyBkdXJhdGlvbj0nJHt0aGlzLmR1cmF0aW9ufScgbG9jYXRpb25IaW50PScke3RoaXMuZ2V0TG9jYXRpb25IaW50KHRoaXMucHJvdG9jb2wsIHRoaXMuYWJzb2x1dGVGaWxlUGF0aCwgdGhpcy5sb2NhdGlvbkluRmlsZSl9J2BcbiAgfVxufSJdfQ==