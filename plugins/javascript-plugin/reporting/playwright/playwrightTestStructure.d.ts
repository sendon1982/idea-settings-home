import TestEventsHandler from "../core/testEventsHandler";
import { TestStep } from "@playwright/test/reporter";
export default class PlaywrightTestStructure extends TestEventsHandler {
    private stepId;
    startStep(step: TestStep): void;
    finishStep(step: TestStep): void;
    private isTestStepLocatable;
}
