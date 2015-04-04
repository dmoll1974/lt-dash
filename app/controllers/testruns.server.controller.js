'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Event = mongoose.model('Event'),
    _ = require('lodash');

/**
 * select test runs for dashboard
 */
exports.testRunsForDashboard = function(req, res) {
    Event.find( { $and: [ { productName: req.params.productName }, { dashboardName: req.params.dashboardName } ] } ).sort('-eventTimestamp').exec(function(err, storedEvents) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {

            var events = [];
            for (var i=0;i<storedEvents.length;i++){

                events.push({"id" : storedEvents[i].toObject()._id, "eventTimestamp" : storedEvents[i].toObject().eventTimestamp.getTime() , "baseline" : storedEvents[i].toObject().baseline, "eventDescription" : storedEvents[i].toObject().eventDescription, "testRunId" : storedEvents[i].toObject().testRunId, "productName" : storedEvents[i].toObject().productName, "dashboardName" : storedEvents[i].toObject().dashboardName, "buildResultkey" : storedEvents[i].toObject().buildResultkey});

            }

            res.jsonp(createTestrunFromEvents(events));
        }
    });
};

exports.testRunById = function(req, res) {
    Event.find( { $and: [ { productName: req.params.productName }, { dashboardName: req.params.dashboardName }, { testRunId: req.params.testRunId } ] } ).sort('-eventTimestamp').exec(function(err, storedEvents) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {

            var events = [];
            for (var i=0;i<storedEvents.length;i++){

                events.push({"id" : storedEvents[i].toObject()._id, "eventTimestamp" : storedEvents[i].toObject().eventTimestamp.getTime() , "baseline" : storedEvents[i].toObject().baseline, "eventDescription" : storedEvents[i].toObject().eventDescription, "testRunId" : storedEvents[i].toObject().testRunId, "productName" : storedEvents[i].toObject().productName, "dashboardName" : storedEvents[i].toObject().dashboardName, "buildResultkey" : storedEvents[i].toObject().buildResultkey});

            }

            res.jsonp(createTestrunFromEvents(events));
        }
    });
};


function createTestrunFromEvents(events) {

    var testRuns = [];


    for (var i = 0; i < events.length; i++) {

        if (events[i].eventDescription === 'start') {

            for ( var j = 0; j < events.length; j++) {

                if (events[j].eventDescription  === 'end' && events[j].testRunId == events[i].testRunId ) {

                    if(events[i].buildResultKey) {

                        testRuns.push({start: events[i].eventTimestamp, end: events[j].eventTimestamp, productName: events[i].productName, dashboardName: events[i].dashboardName, testRunId: events[i].testRunId, buildResultKey: events[i].buildResultKey, eventIds: [events[i].id, events[j].id]});
                    }else{

                        testRuns.push({start: events[i].eventTimestamp, end: events[j].eventTimestamp, productName: events[i].productName, dashboardName: events[i].dashboardName, testRunId: events[i].testRunId, eventIds: [events[i].id, events[j].id]});
                    }

                    break;
                }

            }
        }
    }


    return testRuns;
}

/**
 * Show the current Testrun
 */
exports.read = function(req, res) {

};

/**
 * Update a Testrun
 */
exports.update = function(req, res) {

};

/**
 * Delete an Testrun
 */
exports.delete = function(req, res) {

};

/**
 * List of Testruns
 */
exports.list = function(req, res) {

};
