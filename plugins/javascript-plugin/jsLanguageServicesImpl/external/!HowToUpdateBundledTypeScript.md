# How to update bundled TypeScript

1. Check that the target TypeScript version has no major reported issues
2. Find a commit with the previous bundled TypeScript update, it will serve as a helpful example
3. Create a project with a dependency on the target TypeScript version in some temporary folder, for example `hello`
4. From `hello/node_modules/typescript/lib`, copy into the bundle all `lib.*` files, and all other files that already exist in the bundle
5. Update `diagnosticMessages.json` from the TypeScript source code of the target version, for example: https://raw.githubusercontent.com/microsoft/TypeScript/v5.4.3/src/compiler/diagnosticMessages.json
6. Update `TypeScriptLibraries.BUNDLED_LIB_VERSION` to the target TypeScript version
7. Increment `JSFileElementType.BASE_VERSION`
8. Run WebStorm, compare the version in the Settings, which is taken from the `TypeScriptLibraries.BUNDLED_LIB_VERSION`, with the version displayed in the LSP Widget, which is taken from the server response
9. Run service tests that are not included in the Safe Push
   * Note: some failures are expected, check https://buildserver.labs.intellij.net/project/ijplatform_master_WebStorm_TypeScriptServiceTests
   * `TypeScriptServiceTestSuite`
   * `TypeScriptServiceEvaluationSuite`
   * `VolarServiceTest` TODO to be renamed
   * `VolarServiceDocumentationTest` TODO to be renamed
10. Run tests that were updated in the previous bundle update commit
11. Safe Push