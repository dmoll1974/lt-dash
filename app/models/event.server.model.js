'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Event Schema
 */
var eventSchema = new mongoose.Schema({
    "productName": { type: String, uppercase: true },
    "dashboardName": { type: String, uppercase: true },
    "testRunId": String,
    "eventDescription": String,
    "eventTimestamp" : { type: Date, default: Date.now },
    "baseline": {type: String, default: 'none'},
    "buildResultKey": {type: String, default: 'MANUAL_TEST'}
});

eventSchema.index({ dashboardName: 1, testRunId: 1, eventDescription: 1}, { unique: true });

eventSchema.on('index', function(err) {
    if (err) {
        console.error('User index error: %s', err);
    } else {
        console.info('User indexing complete');
    }
});

mongoose.model('Event', eventSchema);