"use strict";
exports.__esModule = true;
exports.serverLogger = exports.createLoggerFromEnv = exports.LogLevel = exports.LoggerImpl = exports.isLogEnabled = void 0;
var fs = require("fs");
exports.isLogEnabled = process.env["TSS_LOG"];
var LoggerImpl = /** @class */ (function () {
    function LoggerImpl(logFilename, level, ts_impl) {
        this.logFilename = logFilename;
        this.level = level;
        this.ts_impl = ts_impl;
        this.fd = -1;
        this.seq = 0;
        this.inGroup = false;
        this.firstInGroup = true;
    }
    LoggerImpl.prototype.hasLevel = function (level) {
        if (level == this.ts_impl.server.LogLevel.verbose) {
            return this.level == "verbose";
        }
        if (level == this.ts_impl.server.LogLevel.normal) {
            return true;
        }
        return undefined;
    };
    LoggerImpl.prototype.getLogFileName = function () {
        return this.logFilename;
    };
    LoggerImpl.padStringRight = function (str, padding) {
        return (str + padding).slice(0, padding.length);
    };
    LoggerImpl.prototype.close = function () {
        if (this.fd >= 0) {
            fs.close(this.fd);
        }
    };
    LoggerImpl.prototype.group = function (logGroupEntries) {
    };
    LoggerImpl.prototype.perftrc = function (s) {
        this.msg(s, "Perf");
    };
    LoggerImpl.prototype.info = function (s) {
        this.msg(s, "Info");
    };
    LoggerImpl.prototype.err = function (s) {
        this.msg(s, "Err");
    };
    LoggerImpl.prototype.startGroup = function () {
        this.inGroup = true;
        this.firstInGroup = true;
    };
    LoggerImpl.prototype.endGroup = function () {
        this.inGroup = false;
        this.seq++;
        this.firstInGroup = true;
    };
    LoggerImpl.prototype.loggingEnabled = function () {
        return !!this.logFilename;
    };
    LoggerImpl.prototype.isVerbose = function () {
        return this.loggingEnabled() && (this.level == "verbose");
    };
    LoggerImpl.prototype.msg = function (s, type) {
        if (type === void 0) { type = "Err"; }
        if (this.fd < 0) {
            if (this.logFilename) {
                try {
                    this.fd = fs.openSync(this.logFilename, "w");
                }
                catch (e) {
                    serverLogger(e.message + " " + e.stack);
                    this.logFilename = null;
                }
            }
        }
        if (this.fd >= 0) {
            s = s + "\n";
            var prefix = LoggerImpl.padStringRight(type + " " + this.seq.toString(), "          ");
            if (this.firstInGroup) {
                s = prefix + s;
                this.firstInGroup = false;
            }
            if (!this.inGroup) {
                this.seq++;
                this.firstInGroup = true;
            }
            var buf = new Buffer(s);
            fs.writeSync(this.fd, buf, 0, buf.length, null);
        }
        else if (type == "Err") {
            serverLogger(s, true);
        }
    };
    return LoggerImpl;
}());
exports.LoggerImpl = LoggerImpl;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["terse"] = 0] = "terse";
    LogLevel[LogLevel["normal"] = 1] = "normal";
    LogLevel[LogLevel["requestTime"] = 2] = "requestTime";
    LogLevel[LogLevel["verbose"] = 3] = "verbose";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
function parseLoggingEnvironmentString(logEnvStr) {
    if (!logEnvStr) {
        return {};
    }
    var logEnv = { logToFile: true };
    var args = logEnvStr.split(" ");
    var len = args.length - 1;
    for (var i = 0; i < len; i += 2) {
        var option = args[i];
        var _a = getEntireValue(i + 1), value = _a.value, extraPartCounter = _a.extraPartCounter;
        i += extraPartCounter;
        if (option && value) {
            switch (option) {
                case "-file":
                    logEnv.file = value;
                    break;
                case "-level":
                    var level = getLogLevel(value);
                    logEnv.detailLevel = level !== undefined ? level : LogLevel.normal;
                    break;
                case "-traceToConsole":
                    logEnv.traceToConsole = value.toLowerCase() === "true";
                    break;
                case "-logToFile":
                    logEnv.logToFile = value.toLowerCase() === "true";
                    break;
            }
        }
    }
    return logEnv;
    function getEntireValue(initialIndex) {
        var pathStart = args[initialIndex];
        var extraPartCounter = 0;
        if (pathStart.charAt(0) === '"' &&
            pathStart.charAt(pathStart.length - 1) !== '"') {
            for (var i = initialIndex + 1; i < args.length; i++) {
                pathStart += " ";
                pathStart += args[i];
                extraPartCounter++;
                if (pathStart.charAt(pathStart.length - 1) === '"')
                    break;
            }
        }
        return { value: stripQuotes(pathStart), extraPartCounter: extraPartCounter };
    }
    function getLogLevel(level) {
        if (level) {
            var l = level.toLowerCase();
            for (var name in LogLevel) {
                if (isNaN(+name) && l === name.toLowerCase()) {
                    return LogLevel[name];
                }
            }
        }
        return undefined;
    }
}
function createLoggerFromEnv(ts_impl) {
    var fileName = undefined;
    var detailLevel = LogLevel.normal;
    if (exports.isLogEnabled) {
        try {
            var logEnv = parseLoggingEnvironmentString(exports.isLogEnabled);
            if (logEnv.file) {
                fileName = stripQuotes(logEnv.file);
            }
            else {
                fileName = process.cwd() + "/.log" + process.pid.toString();
            }
            if (logEnv.detailLevel) {
                detailLevel = logEnv.detailLevel;
            }
        }
        catch (e) {
            serverLogger(e.message + " " + e.stack, true);
        }
    }
    return new LoggerImpl(fileName, detailLevel.toString(), ts_impl);
}
exports.createLoggerFromEnv = createLoggerFromEnv;
function stripQuotes(a) {
    if (a.charAt(0) === '"' && a.charAt(a.length - 1) === '"') {
        return a.substr(1, a.length - 2);
    }
    return a;
}
function serverLogger(message, force) {
    if (exports.isLogEnabled || force) {
        console.error("Process: " + message);
    }
}
exports.serverLogger = serverLogger;
//# sourceMappingURL=logger-impl.js.map