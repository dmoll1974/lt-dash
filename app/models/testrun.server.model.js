'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    config = require('../../config/config');


var testRunTargetSchema = new Schema({
    "targetMeetsRequirement": Boolean,
    "targetBenchmarkResultFixed": String,
    "targetBenchmarkResultPrevious": String,
    "target": String,
    "value": Number
});


mongoose.model('TestrunTarget', testRunTargetSchema);

var testRunMetricSchema = new Schema({
    "alias": String,
    "type": String,
    "tags": [{text: String}],
    "metricMeetsRequirement": Boolean,
    "metricBenchmarkResultFixed": String,
    "metricBenchmarkResultPrevious": String,
    "annotation": String,
    "targets": [testRunTargetSchema]

});


mongoose.model('TestrunMetric', testRunMetricSchema);


/**
 * Testrun Schema
 */
var TestrunSchema = new Schema({
    "productName": { type: String, uppercase: true },
    "dashboardName": { type: String, uppercase: true },
    "testRunId": String,
    "start": {type:Date, expires: config.graphiteRetentionPeriod},
    "end": Date,
    "baseline" : String,
    "testrunMeetsRequirement": Boolean,
    "buildResultKey": String,
    "metrics":[testRunMetricSchema]
    },
    {
        toObject: {getters: true}
    });

TestrunSchema.virtual('startEpoch').get(function() {
    return this.start.getTime();
});

TestrunSchema.virtual('endEpoch').get(function() {
    return this.end.getTime();
});

TestrunSchema.index({ testRunId: 1, dashboardId:1}, { unique: true });

mongoose.model('Testrun', TestrunSchema);


