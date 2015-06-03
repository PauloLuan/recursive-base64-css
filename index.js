/**
 * Recursive CSS base64 inline
 * https://github.com/PauloLuan/recursive-base64-css
 *
 * Copyleft (c) 2015 Paulo Luan
 * Licensed under the MIT license.
 */

var assert = require("assert")
var path = require("path")
var fs = require("fs")
var glob = require("glob")

module.exports = {
	init: function(destinationPath, options) {
		options = options || {};

		assert(destinationPath, 'base64: missing path');
		assert.equal(typeof destinationPath, 'string', 'base64: path should be a string');
		assert(options, 'base64: missing options');
		assert.equal(typeof options, 'object', 'base64: options should be object');
	}
};
