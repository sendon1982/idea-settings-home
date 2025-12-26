import { Runner } from 'mocha';
declare class CypressReporter {
    constructor(runner: Runner);
    private normalizeError;
}
export = CypressReporter;
