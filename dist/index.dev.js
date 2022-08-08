"use strict";

var _reactNative = require("react-native");

var _App = _interopRequireDefault(require("./src/App"));

var _app = require("./app.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
 * @Author: zegobuilder zegobuilder@zego.im
 * @Date: 2022-08-03 17:12:22
 * @LastEditors: zegobuilder zegobuilder@zego.im
 * @LastEditTime: 2022-08-04 14:25:43
 * @FilePath: /grett/roomkit_reactnative_demo/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

/**
 * @format
 */
_reactNative.AppRegistry.registerComponent(_app.name, function () {
  return _App["default"];
});