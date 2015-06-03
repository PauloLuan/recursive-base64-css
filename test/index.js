var should = require('chai').should(),
    module = require('../index');

describe('#replaceContent', function () {
    it('should replace teste123teste to teste654teste ', function () {
        module.replaceContent('teste123teste', '123', '654').should.equal('teste654teste');
    });
});