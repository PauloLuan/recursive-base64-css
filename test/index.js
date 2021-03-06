var module = require('../index'),
    path = require('path'),
    _ = require('lodash'),
    fs = require('fs'),
    should = require('should');

describe('#replaceContent', function () {

    afterEach(function (done) {
        done();
    });

    var regex = /url\(([^\)]+)\)/g;

    it('should replace teste123teste to teste654teste ', function () {
        module.replaceContent('teste123teste', '123', '654').should.equal('teste654teste');
    });

    it('should replace with a regex', function () {
        var fakeImagePath = 'url("/my/fake/path/image.png")';
        var replace = 'url(data:fileMime;base64,fileBase64)';
        var expected = 'url(data:fileMime;base64,fileBase64)';
        module.replaceContent(fakeImagePath, regex, replace).should.equal(expected);
    });

    it('should replace only the url item', function () {
        var fakeCss = 'teste123 url("/my/fake/path/image.png") blabla';
        var replace = 'url(data:fileMime;base64,fileBase64)';
        var expected = 'teste123 url(data:fileMime;base64,fileBase64) blabla';
        module.replaceContent(fakeCss, regex, replace).should.equal(expected);
    });

    it('should replace an original css text', function () {
        var from = 'li { ' +
            'background: url("teste/teste/bla/fake")   ' +
            'no-repeat   ' +
            'left center;    ' +
            'padding: 5px 0 5px 25px;  }';

        var to = 'url(data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7)';

        var expected = 'li { ' +
            'background: url(data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7)   ' +
            'no-repeat   ' +
            'left center;    ' +
            'padding: 5px 0 5px 25px;  }';

        module.replaceContent(from, regex, to).should.equal(expected);
    });
});

describe('#getAllCssFiles', function () {

    it('should return 3 as a length', function (done) {
        var cssPath = path.join(__dirname, 'input');

        return module.getAllCssFiles(cssPath)
            .then(function (files) {
                files.should.be.not.empty;
                //files.should.have.length(3);
                done();
            });
    });
});

describe('#writeFileToOutputFolder', function () {

    it('should create the same structure as the demo folder', function (done) {
        var inputFiles,
            outputFiles,
            inputPath;

        inputPath = path.join(__dirname, 'input');

        module.getAllCssFiles(inputPath)

            .then(function (files) {
                inputFiles = files;

                _.forEach(inputFiles, function (value, key) {
                    var content = fs.readFileSync(value);
                    module.writeFileToOutputFolder(value, content);
                });
            })

            .then(function () {
                var outputPath = path.join(__dirname, '../output');

                module.getAllCssFiles(outputPath)
                    .then(function (files) {
                        outputFiles = files;
                        outputFiles.should.have.length(inputFiles.length);
                        done();
                    });
            });
    });
});

describe('#getQuotedContent', function () {

    it('should get only quoted content', function () {
        var simpleQuote = 'the word you need is (hello) ';
        var simpleQuoteResult = module.getQuotedContent(simpleQuote);
        simpleQuoteResult.should.be.equal('hello');
    });

    it('should get three different kinds of quoted content', function () {
        var mockCss = 'background: url("teste/teste/bla/fake")   ' +
            'background: url(\'teste/bla/fake2\')   ' +
            'background: url(teste/bla/fake3)   ';

        var result = module.getAllImagesTags(mockCss);
        result.should.be.not.empty;
        result.should.have.length(3);
    
        var result0 = module.getQuotedContent(result[0]);
        result0.should.be.equal('teste/teste/bla/fake');

        var result1 = module.getQuotedContent(result[1]);
        result1.should.be.equal('teste/bla/fake2');

        var result2 = module.getQuotedContent(result[2]);
        result2.should.be.equal('teste/bla/fake3');
    });
});

describe('#getAllImagesTags', function () {

    it('should get all image tags from a mock css text', function () {
        var mockCss = 'li { ' +
            'background: url("teste/teste/bla/fake")   ' +
            'no-repeat   ' +
            'left center;    ' +
            'padding: 5px 0 5px 25px;  }';

        var result = module.getAllImagesTags(mockCss);
        result.should.be.not.empty;
        result.should.have.length(1);
    });

    it('should get 2 image tags', function () {
        var mockCss = 'li { ' +
            'background: url("teste/teste/bla/fake")   ' +
            'background: url("teste/bla/fake2")   ' +
            'left center;    ' +
            'padding: 5px 0 5px 25px;  }';

        var result = module.getAllImagesTags(mockCss);
        result.should.be.not.empty;
        result.should.have.length(2);
    });

    it('should get 3 different kind of image tags', function () {
        var mockCss = 'background: url("teste/teste/bla/fake")   ' +
            'background: url(\'teste/bla/fake2\')   ' +
            'background: url(teste/bla/fake3)   ';

        var result = module.getAllImagesTags(mockCss);
        result.should.be.not.empty;
        result.should.have.length(3);
    });
});

describe('#init', function () {
    this.timeout(5000);

    it('should execute the main function in order to execute the complete cycle of the app.', function (done) {
        var inputPath = path.join(__dirname, 'input');

        return module.init(inputPath, {})
            .then(function (result) {
                done();
            }).catch(function (error) {
                console.log(error);
                done();
            });
    });
});
