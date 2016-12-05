var gulp = require('gulp'),
    util = require('gulp-util'),
    bootlint = require('gulp-bootlint'),
    reporter = require('../'),
    assert = require('assert');

var oldOut = process.stdout.write;

it('should contain DOCTYPE declaration', function (done) {
    lesshintTest(function (consoleOutput) {
        assert(consoleOutput.includes("DOCTYPE declaration"));
        console.log(consoleOutput);
        done();
    });
});

function lesshintTest(test) {
    var out = '';

    process.stdout.write = function (str) {
        var oldWrite = process.stdout.write;
        out = out + str;
    };

    gulp
        .src(['test/test-input*.html'], { base: '.' })
        .pipe(bootlint(reporter))
        .on('finish', function (callback) {
            var stripped = util.colors.stripColor(out || '');
            process.stdout.write = oldOut;
            test(stripped);
        });
}