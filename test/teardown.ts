/**
 * @file Jest global teardown hook for the extension test suite.
 */

/**
 * Runs once after the Jest suite finishes. There are no external services to
 * tear down.
 * @example
 * ```ts
 * // Registered in jest.config.mjs as globalTeardown.
 * await teardown();
 * ```
 */
export default async function teardown(): Promise<void> {
  // No external services to tear down.
}
