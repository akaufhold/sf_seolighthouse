/* global
    require, module
*/
const _StyleLintPlugin = require("stylelint-bare-webpack-plugin");
const StyleLintPlugin = new _StyleLintPlugin({
  configFile: "stylelint.config.js",
});

module.exports = {
  StyleLintPlugin: StyleLintPlugin,
};