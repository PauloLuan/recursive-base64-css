'use strict';
/**
 * Recursive CSS base64 inline
 * https://github.com/PauloLuan/recursive-base64-css
 *
 * Copyleft (c) 2015 Paulo Luan
 * Licensed under the MIT license.
 */

var assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    mime = require('mime'),
    glob = require('glob'),
    _ = require('lodash'),
    mkdirp = require('mkdirp'),
    Q = require('q'),
    self;

module.exports = {
    init: function (destinationPath, options) {
        var deferred = Q.defer();
        self = this;

        options = options || {};
        options.path = destinationPath;

        try {
            self.verifyOptions(options);

            self.getAllCssFiles(destinationPath)
                .then(function (files) {
                    _.forEach(files, function (cssPath, key) {
                        assert.equal(fs.existsSync(cssPath), true, 'path should exist');

                        var content = fs.readFileSync(cssPath).toString('utf-8');
                        var inlinedContent = self.inlineCssImages(content, cssPath);

                        self.writeFileToOutputFolder(cssPath, inlinedContent);
                        deferred.resolve(inlinedContent);
                    });
                });

        } catch (exception) {
            deferred.reject(exception);
            console.log('error: ', exception);
        }

        return deferred.promise;
    },

    verifyOptions: function (options) {
        assert(options, 'base64: missing options');
        assert.equal(typeof options, 'object', 'base64: options should be object');
        assert(options.path, 'base64: missing path');
        assert.equal(typeof options.path, 'string', 'base64: path should be a string');
    },

    /**
     *
     * Search recursivelly into a directory and returns all files that matches the searched file extension (.css).
     *
     * @param destinationPath - the css path
     * @return {Promisse.<string[]>} files - the css files.
     * @rejects {ValidationError} if the input is too long
     */
    getAllCssFiles: function (destinationPath) {
        var deferred = Q.defer();

        var destPath = path.join(destinationPath + '/**/*.css');
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

    inlineCssImages: function (content, cssPath) {
        var tags = self.getAllImagesTags(content);

        /* each all url tag items */
        _.forEach(tags, function (value, index) {
            var imagePath = self.getQuotedContent(value); // gets only the quoted content, that is the path of the image
            var resolvedPath = path.resolve(path.dirname(cssPath), imagePath);
            assert.equal(fs.existsSync(resolvedPath), true, 'path should exist.');
            var base64 = self.imageToBase64(resolvedPath);
            content = self.replaceContent(content, value, base64);
        });

        return content;
    },

    getQuotedContent: function (text) {
        var match = text.match(/\((.*?)\)/);
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
        var outputPath = path.resolve('output');
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
     * @return {string}
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
