var should = require('should'),
    fixtures = require('./fixtures'),
    kette = require('../');


describe('kette', function () {

    it('it should have all keys within result', function (done) {
        kette(fixtures.simple, {formId: 12}).
            parallel('form', 'keyB').
            waterfall(
            'clientNotation',
            'clientNotation2').
            exec(function (error, result) {
                should.not.exist(error);
                result.should.have.keys(['form', 'keyB', 'clientNotation', 'clientNotation2', 'formId']);

                done();
            });
    });

    it('should do waterfall in currect order', function (done) {
        kette(fixtures.waterfall, {sequence: []}).
            waterfall(
            'drop1',
            'drop2',
            'drop3').
            exec(function (error, result) {
                should.not.exist(error);
                result.sequence.should.eql([1, 2, 3]);
                done();
            });
    });

    it('should be reuseable after exec', function (done) {
        var chain = kette(fixtures.waterfall, {sequence: []});

        chain.waterfall(
            'drop1',
            'drop2',
            'drop3').
            exec(function (error, result) {
                should.not.exist(error);
                chain.waterfall('drop3', 'drop2', 'drop1').exec(function (error, result) {
                    result.sequence.should.eql([1, 2, 3, 3, 2, 1]);
                    done();
                });

            });
    });

    it('it should handle exceptions within parallel', function (done) {
        kette(fixtures.simple, {formId: 12}).
            parallel('form', 'notExistingKey').
            parallel(
            'clientNotation',
            'clientNotation2').
            exec(function (error, result) {
                should.exist(error);
                error.message.toString().should.containEql('notExistingKey');
                done();
            });
    });

    it('it should handle exceptions within waterfall', function (done) {
        kette(fixtures.simple, {formId: 12}).
            parallel('form').
            parallel(
            'clientNotation',
            'clientNotation3').
            exec(function (error, result) {
                should.exist(error);
                error.message.toString().should.containEql('clientNotation3');
                done();
            });
    });

});
