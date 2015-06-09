'use strict';
/**
 * Recursive CSS base64 inline
 * https://github.com/PauloLuan/recursive-base64-css
 *
 * Copyleft (c) 2015 Paulo Luan
 * Licensed under the MIT license.
 */

var assert = require("assert"),
    path = require("path"),
    fs = require("fs"),
    mime = require('mime'),
    glob = require("glob"),
    _ = require("lodash"),
    mkdirp = require('mkdirp'),
    Q = require("q");

module.exports = {
    init: function (destinationPath, options) {
        options.path = destinationPath;
        options = options || {};

        try {
            verifyOptions(options);

            getAllCssFiles(destinationPath)
                .then(function (files) {
                    _.forEach(files, function (value, key) {
                        inlineCssImages(value);
                    });
                });

        } catch (exception) {
            console.log("error: ", exception);
        }
    },

    verifyOptions: function (options) {
        assert(options.path, 'base64: missing path');
        assert.equal(typeof destinationPath, 'string', 'base64: path should be a string');
        assert(options, 'base64: missing options');
        assert.equal(typeof options, 'object', 'base64: options should be object');
    },

    /**
     *
     * Search recursivelly into a directory and returns all files that matches the searched file extension (.css).
     *
     * @param destinationPath - the css path
     * @returns {Promisse.<string[]>} files - the css files.
     * @rejects {ValidationError} if the input is too long
     */
    getAllCssFiles: function (destinationPath) {
        var deferred = Q.defer();

        var destPath = path.join(destinationPath + "/**/*.css");
        glob(destPath, function (err, files) {
            if (err) {
                //console.log("Error: ", err);
                deferred.reject(err);
            } else {
                deferred.resolve(files);
            }
        });

        return deferred.promise;
    },

    inlineCssImages: function (cssFile) {
        var content = fs.readFileSync(cssFile);
        var tags = getAllImagesTags(content);

        _.forEach(tags, function (value, index) {
            var imagePath = getQuotedContent(value); // gets only the quoted content
            imageToBase64(imagePath);
        });
    },

    getQuotedContent: function (text) {
        var match = text.match(/\'(.*?)\'/) || text.match(/\"(.*?)\"/);
        if (match) match = match[1];
        return match;
    },

    getAllImagesTags: function (content) {
        var regex = /url\(([^\)]+)\)/g;
        var result = content.match(regex);
        return result;
    },

    /**
     *
     * Writes the content to a file on the output folder.
     *
     */
    writeFileToOutputFolder: function (filePath, content) {
        var outputPath = path.resolve("output");
        var relativeOutput = path.relative(path.resolve(), filePath);
        var outputFilePath = path.join(outputPath, relativeOutput);

        mkdirp.sync(path.dirname(outputFilePath));
        var text = content.toString('utf-8');
        fs.createWriteStream(outputFilePath).write(text);
    },

    /**
     *
     * Search and replace a text/regex on an input content.
     *
     * @param inputContent - hte input content of the file
     * @param findWhat - the searched text or regex
     * @param replaceWith - the expected text that will be the replace
     * @returns {string}
     */
    replaceContent: function (inputContent, findWhat, replaceWith) {
        var content = String(inputContent).replace(findWhat, replaceWith);
        return content;
    },

    /**
     * Converts an image to base64 string.
     *
     * @param  {String} imagePath - the path of the image that will be converted
     * @return {String} base64
     *      the string representation of the image, as following the base64 pattern:
     *      url(data:[<mime type>][;charset=<charset>][;base64],<encoded data>)
     *      for example: `url(data:image/gif;base64,R0lGODlhQAUjIQA7)`
     */
    imageToBase64: function (imagePath) {
        var fileData = fs.readFileSync(path.join(imagePath));
        var fileBase64 = new Buffer(fileData).toString('base64');
        var fileMime = mime.lookup(imagePath);
        var base64 = 'url(data:' + fileMime + ';base64,' + fileBase64 + ')';
        return base64;
    }
};
