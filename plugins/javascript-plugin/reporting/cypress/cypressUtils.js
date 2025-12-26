"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CypressUtils = /** @class */ (function () {
    function CypressUtils() {
    }
    // Cypress returns file paths on Windows incorrectly with mix of backslashes and froward slashes
    // e.g., C:\Users\Aqua\cypress-demo/cypress/e2e/1-getting-started/
    // The following code is a workaround for this problem
    CypressUtils.fixIfWindowsFilePath = function (absoluteFilePath) {
        var isWindowsPath = absoluteFilePath.includes(':\\');
        if (!isWindowsPath) {
            return absoluteFilePath;
        }
        return absoluteFilePath.replace(/\//g, '\\');
    };
    return CypressUtils;
}());
exports.default = CypressUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3lwcmVzc1V0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2N5cHJlc3MvY3lwcmVzc1V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7SUFBQTtJQVlBLENBQUM7SUFWQyxnR0FBZ0c7SUFDaEcsa0VBQWtFO0lBQ2xFLHNEQUFzRDtJQUN4QyxpQ0FBb0IsR0FBbEMsVUFBbUMsZ0JBQXdCO1FBQ3pELElBQU0sYUFBYSxHQUFHLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xCLE9BQU8sZ0JBQWdCLENBQUM7U0FDekI7UUFDRCxPQUFPLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQVpELElBWUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBDeXByZXNzVXRpbHMge1xuXG4gIC8vIEN5cHJlc3MgcmV0dXJucyBmaWxlIHBhdGhzIG9uIFdpbmRvd3MgaW5jb3JyZWN0bHkgd2l0aCBtaXggb2YgYmFja3NsYXNoZXMgYW5kIGZyb3dhcmQgc2xhc2hlc1xuICAvLyBlLmcuLCBDOlxcVXNlcnNcXEFxdWFcXGN5cHJlc3MtZGVtby9jeXByZXNzL2UyZS8xLWdldHRpbmctc3RhcnRlZC9cbiAgLy8gVGhlIGZvbGxvd2luZyBjb2RlIGlzIGEgd29ya2Fyb3VuZCBmb3IgdGhpcyBwcm9ibGVtXG4gIHB1YmxpYyBzdGF0aWMgZml4SWZXaW5kb3dzRmlsZVBhdGgoYWJzb2x1dGVGaWxlUGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBpc1dpbmRvd3NQYXRoID0gYWJzb2x1dGVGaWxlUGF0aC5pbmNsdWRlcygnOlxcXFwnKTtcbiAgICBpZiAoIWlzV2luZG93c1BhdGgpIHtcbiAgICAgIHJldHVybiBhYnNvbHV0ZUZpbGVQYXRoO1xuICAgIH1cbiAgICByZXR1cm4gYWJzb2x1dGVGaWxlUGF0aC5yZXBsYWNlKC9cXC8vZywgJ1xcXFwnKTtcbiAgfVxufVxuIl19