/**
 * Recursive CSS base64 inline
 * https://github.com/PauloLuan/recursive-base64-css
 *
 * Copyleft (c) 2015 Paulo Luan
 * Licensed under the MIT license.
 */

var assert = require("assert");
var path = require("path");
var fs = require("fs");
var glob = require("glob");
var _ = require("lodash");
var Q = require("q");

module.exports = {
    init: function (destinationPath, options) {
        options = options || {};

        assert(destinationPath, 'base64: missing path');
        assert.equal(typeof destinationPath, 'string', 'base64: path should be a string');
        assert(options, 'base64: missing options');
        assert.equal(typeof options, 'object', 'base64: options should be object');
    },

    getAllCssFiles: function (destinationPath) {
    	var deferred = Q.defer();

        var destPath = path.join(destinationPath + "/*.css");
        glob(destPath, function (er, files) {
            if (err) {
                console.log("Error: ", err);
            } else {
            	deferred.resolve(files);
            }
        });

        return deferred.promise;
    },

    inlineCssImages: function (cssFile) {

    },

    /**
     * Converts an image to base64 string.
     *
     * @param  {String} imagePath - the path of the image that will be converted
     * @return {String} base64 - the string representation of the image
     */
    imageToBase64: function (imagePath) {
        var fileData = fs.readFileSync(path.join(imagePath));
        var fileBase64 = new Buffer(fileData).toString('base64');
        var fileMime = mime.lookup(imagePath);
        var base64 = 'url(data:' + fileMime + ';base64,' + fileBase64 + ')';
        return base64;
    }
};
