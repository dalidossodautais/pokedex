import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect method with methods from @testing-library/jest-dom
expect.extend(matchers);

// Run cleanup after each test case
afterEach(() => {
  cleanup();
});
