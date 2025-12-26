"use strict";
exports.__esModule = true;
exports.getService = void 0;
var logger_impl_1 = require("./logger-impl");
var util_1 = require("./util");
/**
 * Provide service for old & new integration (ts-complier-host-impl)
 */
function getService(state) {
    if (state.serverFolderPath == null) {
        throw new Error('Service file is empty');
    }
    var serviceFolderPathWithSlash = state.serverFolderPath;
    var lastChar = serviceFolderPathWithSlash.charAt(serviceFolderPathWithSlash.length - 1);
    if (lastChar != '/' && lastChar != '\\') {
        serviceFolderPathWithSlash = serviceFolderPathWithSlash + "/";
    }
    var yarnPnp = loadWithYarnPnp(serviceFolderPathWithSlash, state.packageJson);
    if (yarnPnp != null)
        return yarnPnp;
    var tsVersion = getVersion(serviceFolderPathWithSlash, require);
    var targets = tsVersion[0] >= 5 ? ["tsserver", "tsserverlibrary"] : ["tsserverlibrary", "tsserver"];
    (0, logger_impl_1.serverLogger)("TypeScript version [".concat(tsVersion.join(","), "]: use ").concat(targets[0], " by default for require()."));
    var fromRequire = loadWithRequire(serviceFolderPathWithSlash, targets);
    if (fromRequire != null)
        return fromRequire;
    return evaluateInContext(serviceFolderPathWithSlash, targets);
}
exports.getService = getService;
function evaluateInContext(serviceFolderPathWithSlash, targets) {
    var data = getFilePathIfExists(serviceFolderPathWithSlash, targets);
    if (!data) {
        throw new Error('Cannot find tsserverlibrary.js or tsserver.js file in ' + serviceFolderPathWithSlash);
    }
    var filePath = data.path;
    var context = null;
    var vm = require('vm');
    context = createContext(context, vm);
    vm.runInNewContext(data.data, context);
    if (!context || !context.ts) {
        throw new Error('Cannot find server implementation in the file ' + filePath);
    }
    return {
        ts: context.ts,
        serverFilePath: filePath
    };
}
function loadWithYarnPnp(serviceFolderPathWithSlash, packageJson) {
    if (packageJson == null)
        return null;
    if ((process.versions).pnp == null)
        return null;
    var newRequirePath = (process.versions).pnp != null ?
        packageJson :
        packageJson.substring(0, packageJson.length - "/package.json".length);
    var newRequire = createRequire(newRequirePath);
    var tsVersion = [4];
    try {
        tsVersion = requireParseVersion("".concat(serviceFolderPathWithSlash, "/package.json"), newRequire);
    }
    catch (e) {
        (0, logger_impl_1.serverLogger)("Error parsing version: ".concat(e));
    }
    var targets = tsVersion[0] >= 5 ? ["tsserver", "tsserverlibrary"] : ["tsserverlibrary", "tsserver"];
    (0, logger_impl_1.serverLogger)("TypeScript version [".concat(tsVersion.join(","), "]: use ").concat(targets[0], " by default for yarn pnp."));
    for (var _i = 0, targets_1 = targets; _i < targets_1.length; _i++) {
        var target = targets_1[_i];
        try {
            var path = serviceFolderPathWithSlash + "lib/" + target;
            (0, logger_impl_1.serverLogger)("Yarn require is used " + newRequirePath, true);
            var tsService = newRequire(path);
            if (tsService != null && tsService.version != null) {
                var resolvePath = newRequire.resolve(path);
                return {
                    ts: tsService,
                    serverFilePath: resolvePath
                };
            }
        }
        catch (ignored) {
        }
    }
    return null;
}
function requireParseVersion(pathWithPackageJson, requireFunction) {
    var packageVersion = requireFunction(pathWithPackageJson).version;
    if (packageVersion) {
        var parsed = (0, util_1.parseNumbersInVersion)(packageVersion);
        if (parsed)
            return parsed;
    }
    return [4];
}
function getVersion(serviceFolderPathWithSlash, requireFunction) {
    var pathWithPackageJson = serviceFolderPathWithSlash + "../package.json";
    try {
        //bundled version
        if (serviceFolderPathWithSlash.endsWith("external/"))
            return [5];
        return requireParseVersion(pathWithPackageJson, requireFunction);
    }
    catch (e) {
        (0, logger_impl_1.serverLogger)("Error parsing version (".concat(pathWithPackageJson, "): ") + e);
    }
    //default version (4)
    return [4];
}
function loadWithRequire(serviceFolderPath, targets) {
    for (var _i = 0, targets_2 = targets; _i < targets_2.length; _i++) {
        var target = targets_2[_i];
        try {
            var resolvePath = serviceFolderPath + target + ".js";
            var tsService = require(resolvePath);
            if (tsService != null) {
                if (!tsService.version) {
                    // typescript 5.5 launches service from tsserver, but it doesn't export the api,
                    // which is exported from tsserverlibrary.
                    continue;
                }
                //the main issue with the solution that we don't "real" start place
                //let's try to guess
                var fs = require('fs');
                if (fs != null && !fs.existsSync(serviceFolderPath + "lib.d.ts")) {
                    var nodeModulesCandidate = tsService.getDirectoryPath(tsService.getDirectoryPath(serviceFolderPath));
                    //possibly "real" typescript is used
                    if (fs.existsSync(nodeModulesCandidate + "/typescript/lib/lib.d.ts")) {
                        resolvePath = nodeModulesCandidate + "/typescript/lib/" + target + ".js";
                    }
                }
                (0, logger_impl_1.serverLogger)("Require is used " + serviceFolderPath, true);
                return {
                    ts: tsService,
                    serverFilePath: resolvePath
                };
            }
        }
        catch (e) {
            //skip, try to load the services directly
        }
    }
    return null;
}
function createRequire(contextPath) {
    var module = require('module');
    if (typeof module.createRequire === 'function') {
        // https://nodejs.org/api/module.html#module_module_createrequire_filename
        // Implemented in Yarn PnP: https://next.yarnpkg.com/advanced/pnpapi/#requiremodule
        return module.createRequire(contextPath);
    }
    // noinspection JSDeprecatedSymbols
    if (typeof module.createRequireFromPath === 'function') {
        // Use createRequireFromPath (a deprecated version of createRequire) to support Node.js 10.x
        // noinspection JSDeprecatedSymbols
        return module.createRequireFromPath(contextPath);
    }
    throw Error('Function module.createRequire is unavailable in Node.js ' + process.version +
        ', Node.js >= 12.2.0 is required');
}
function getFilePathIfExists(serviceFolderPathWithSlash, targets) {
    var fs = require('fs');
    for (var _i = 0, targets_3 = targets; _i < targets_3.length; _i++) {
        var target = targets_3[_i];
        var pathToServicesFile = serviceFolderPathWithSlash + target + ".js";
        if (fs.existsSync(pathToServicesFile)) {
            (0, logger_impl_1.serverLogger)("File content load for ".concat(target, " is used"), true);
            return {
                data: fs.readFileSync(pathToServicesFile, 'utf-8'),
                path: pathToServicesFile
            };
        }
    }
    return null;
}
function createContext(context, vm) {
    context = vm.createContext();
    context.module = module;
    context.require = require;
    context.process = process;
    context.__dirname = __dirname;
    context.__filename = __filename;
    context.Buffer = Buffer;
    context.setTimeout = setTimeout;
    context.setInterval = setInterval;
    context.setInterval = setInterval;
    context.setImmediate = setImmediate;
    context.global = global;
    context.console = console;
    context.clearTimeout = clearTimeout;
    context.clearInterval = clearInterval;
    context.clearImmediate = clearImmediate;
    context.exports = exports;
    return context;
}
//# sourceMappingURL=service-loader.js.map