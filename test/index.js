var should = require('chai').should(),
    module = require('../index');

describe('#replaceContent', function () {
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