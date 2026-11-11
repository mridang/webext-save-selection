/**
 * @file Knip configuration that excludes this config file from unused-file checks.
 */
export default {
  ignore: ['knip.config.ts'],
  ignoreDependencies: [/^@semantic-release\//],
};
