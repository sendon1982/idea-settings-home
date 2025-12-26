"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.initCommandNamesForSessionProvider = exports.tryHandleTsServerCommand = void 0;
/**
 * This file is intended to highlight that we decouple compilation steps of legacy `tsLanguageService` and new `tscplugin`.
 *
 * After tinkering here, you need to recompile both directories.
 */
// @ts-ignore
var ide_commands_1 = require("tsc-ide-plugin/ide-commands");
__createBinding(exports, ide_commands_1, "tryHandleTsServerCommand");
__createBinding(exports, ide_commands_1, "initCommandNamesForSessionProvider");
//# sourceMappingURL=tsc-plugin-adapter.js.map