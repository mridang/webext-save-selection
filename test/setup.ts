/**
 * @file Jest global setup hook for the extension test suite.
 */

/**
 * Runs once before the Jest suite starts. The suite needs no external services,
 * so nothing is started here.
 * @example
 * ```ts
 * // Registered in jest.config.mjs as globalSetup.
 * await setup();
 * ```
 */
export default async function setup(): Promise<void> {
  // No external services are required for the test suite.
}
