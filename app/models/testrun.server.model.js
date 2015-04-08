'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Testrun Schema
 */
var TestrunSchema = new Schema({
    "productName": { type: String, uppercase: true },
    "dashboardName": { type: String, uppercase: true },
    "testRunId": String,
    "start": Date,
    "end": Date,
    "baseline",
    "Metrics":[{
        alias: String,
        type: String,
        metricRequirementResult: String,
        metricBenchmarkResultFixed: String,
        metricBenchmarkResultPrevious: String,
        annotation: String,
        targets: [{
            targetRequirementResult: String,
            targetBenchmarkResultFixed: String,
            targetBenchmarkResultPrevious: String,
            target: String,
            value: Number
        }]

    }]
});

TestrunSchema.index({ testRunId: 1, dashboardId:1}, { unique: true });

mongoose.model('Testrun', TestrunSchema);