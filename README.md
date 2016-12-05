bootlint-teamcity
=================

[![NPM version](https://img.shields.io/npm/v/bootlint-teamcity.svg)](https://www.npmjs.com/package/bootlint-teamcity)
[![MIT License](https://img.shields.io/github/license/SiCoe/bootlint-teamcity.svg)](https://github.com/SiCoe/bootlint-teamcity/blob/master/LICENSE)
[![Dependency Status](https://img.shields.io/david/SiCoe/bootlint-teamcity.svg)](https://david-dm.org/SiCoe/bootlint-teamcity)
[![devDependency Status](https://img.shields.io/david/dev/SiCoe/bootlint-teamcity.svg)](https://david-dm.org/SiCoe/bootlint-teamcity?type=dev)
[![GitHub issues](https://img.shields.io/github/issues/SiCoe/bootlint-teamcity.svg)](https://github.com/SiCoe/bootlint-teamcity/issues)

TeamCity reporter for [bootlint](https://github.com/twbs/bootlint) errors.

## Install

```shell
npm install --save-dev bootlint-teamcity
```

## Usage

Use the [gulp-bootlint](https://www.npmjs.com/package/gulp-bootlint) module
for [gulp](https://www.npmjs.com/package/gulp) to pipe in files to be analysed.

When run in [TeamCity](https://www.jetbrains.com/teamcity/) the errors will
show as failed test results and can therefore fail the build. 

`bootlint-teamcity` provides an object with a [`reportFn`](https://github.com/tschortsch/gulp-bootlint#optionsreportfn)
and a [`summaryReportFn`](https://github.com/tschortsch/gulp-bootlint#optionssummaryreportfn) function than can be used for the 
[Options](https://github.com/tschortsch/gulp-bootlint#options) object passed to `gulp-bootlint`.

```js
var gulp = require('gulp');
var bootlint = require('gulp-bootlint');
var bootlintTeamcity = require('bootlint-teamcity');

gulp.task('default', function () {
    gulp.src(['**/*.html'])
        .pipe(bootlint(bootlintTeamcity));
```

If other bootlint options are required, the two `bootlint-teamcity` functions can be set within the options object.

Note: both functions are required

```js
var gulp = require('gulp');
var bootlint = require('gulp-bootlint');
var bootlintTeamcity = require('bootlint-teamcity');

gulp.task('default', function () {
    gulp.src(['**/*.html'])
        .pipe(bootlint({
            stoponerror: true,
            stoponwarning: true,
            loglevel: 'debug',
            disabledIds: ['W009', 'E007'],
            issues: fileIssues,
            reportFn: bootlintTeamcity.reportFn,
            summaryReportFn: bootlintTeamcity.summaryReportFn
        }));
```

Errors are grouped by file and then by [bootlint problem id](https://github.com/twbs/bootlint/wiki)
when displayed in TeamCity *Build Log* or *Tests* tab.
