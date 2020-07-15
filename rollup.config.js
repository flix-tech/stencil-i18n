import rollupResolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

export default {
  input: 'dist/index.js',

  plugins: [
    rollupResolve({
      preferBuiltins: true,
    }),
  ],

  external: ['fs', 'path'],

  output: [
    {
      format: 'cjs',
      file: pkg.main,
    },
    {
      format: 'esm',
      file: pkg.module,
    },
  ],
};

(function (exports) {})({});
