import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import i18n from 'olsk-rollup-i18n';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

import pathPackage from 'path';
import globPackage from 'glob';

export default globPackage.sync(['os-app/**/rollup-start.js'], {
  matchBase: true,
}).filter(function (e) {
  return !e.match(/node_modules|__external/ig);
}).map(function (e, i) {
  let outputFunction = function (inputData) {
    return inputData;
  };

  try {
    outputFunction = require(pathPackage.join(__dirname, pathPackage.dirname(e), 'rollup-config-custom.js')).OLSKRollupConfigCustomFor;
  } catch(e) {
    if (!e.message.match(/Cannot find module .*rollup-config-custom\.js/)) {
      throw e;
    }
  }

  return outputFunction({
    input: pathPackage.join(pathPackage.dirname(e), 'rollup-start.js'),
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'Main',
      file: pathPackage.join(pathPackage.dirname(e), '__compiled/ui-behaviour.js'),
    },
    onwarn: (warning, handler) => {
      if (['a11y-accesskey', 'a11y-autofocus'].indexOf(warning.pluginCode) !== -1) return;

      handler(warning);
    },
    plugins: [
      svelte({
        // enable run-time checks when not in production
        dev: !production,

        // extract component CSS into separate file for better performance
        css: function (css) {
          return css.write(pathPackage.join(pathPackage.dirname(e), '__compiled/ui-style.css'));
        }
      }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration —
      // consult the documentation for details:
      // https://github.com/rollup/rollup-plugin-commonjs
      resolve({
        browser: true
      }),
      commonjs(),
      i18n({
        baseDirectory: 'os-app',
      }),

      // Watch the `public` directory and refresh the
      // browser on changes when not in production
      !production && livereload({
        watch: pathPackage.join(pathPackage.dirname(e), '__compiled'),
        port: 5000 + i,
      }),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser()
    ],
  });
});
