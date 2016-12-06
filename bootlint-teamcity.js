var tsm = require('teamcity-service-messages');
var path = require('path');

var REPORTER = 'BootLint';

var reportStore = {};

function getFilePath(file) {
    return path.relative(file.base, file.history[0]);
}

module.exports = {
    reportFn: (file, lint, isError, isWarning, errorLocation) => {
        'use strict';
        var filePath = getFilePath(file);

        if (!reportStore[filePath]) {
            reportStore[filePath] = {};
        }
        if (!reportStore[filePath][lint.id]) {
            reportStore[filePath][lint.id] = [];
        }

        let error = {
            id: lint.id,
            message: lint.message,
            lint: lint,
            isError: isError,
            isWarning: isWarning,
            hasLocation: !!errorLocation
        };
        if (errorLocation) {
            error.line = errorLocation.line;
            error.col = errorLocation.column;
        }
        reportStore[filePath][lint.id].push(error);
    },
    summaryReportFn: (file, errorCount, warningCount) => {
        'use strict';
        tsm.testSuiteStarted({ name: REPORTER });
        
        var filePath = getFilePath(file);
        tsm.testSuiteStarted({ name: filePath });

        if (errorCount > 0 || warningCount > 0) {
            for (let errorRule in reportStore[filePath]) {
                tsm.testSuiteStarted({ name: errorRule });
                for (let error of reportStore[filePath][errorRule]) {
                    var name = (error.hasLocation ? ("line " + error.line + ", col " + error.col + ", ") : '') + error.message;
                    tsm.testStarted({ name: name })
                        .testFailed({
                            name: name
                        })
                        .testFinished({ name: name });
                }
                tsm.testSuiteFinished({ name: errorRule });
            }
        }

        //Clear reportStore of this file
        reportStore[filePath] = undefined;

        tsm.testSuiteFinished({ name: filePath });
        tsm.testSuiteFinished({ name: REPORTER });
    }
};