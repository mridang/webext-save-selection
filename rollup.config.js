import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

// noinspection JSUnusedGlobalSymbols
const zipPlugin = () => ({
  name: 'zip-plugin',
  async writeBundle() {
    await execAsync("cd dist && zip -r extension.zip . -x '*.zip'");
    console.log('Created dist/extension.zip');
  },
});

// noinspection JSUnusedGlobalSymbols
export default {
  input: 'src/background.ts',
  output: {
    file: 'dist/background.js',
    format: 'iife',
    name: 'TextSaverExtension',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: {
        module: 'ES2022',
        moduleResolution: 'bundler',
        importHelpers: false,
        declaration: false,
        sourceMap: true,
      },
    }),
    terser({
      sourceMap: true,
    }),
    copy({
      targets: [
        { src: 'manifest.json', dest: 'dist' },
        { src: 'icons', dest: 'dist' },
      ],
    }),
    zipPlugin(),
  ],
};
