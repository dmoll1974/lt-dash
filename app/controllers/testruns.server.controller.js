'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Event = mongoose.model('Event'),
    Testrun = mongoose.model('Testrun'),
    Dashboard = mongoose.model('Dashboard'),
    _ = require('lodash'),
    graphite = require('./graphite.server.controller'),
    async = require('async');

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

                events.push({"id" : storedEvents[i].toObject()._id, "eventTimestamp" : storedEvents[i].toObject().eventTimestamp.getTime() , "baseline" : storedEvents[i].toObject().baseline, "eventDescription" : storedEvents[i].toObject().eventDescription, "testRunId" : storedEvents[i].toObject().testRunId, "productName" : storedEvents[i].toObject().productName, "dashboardName" : storedEvents[i].toObject().dashboardName, "buildResultKey" : storedEvents[i].toObject().buildResultKey});

            }

            res.jsonp(createTestrunFromEvents(events));
        }
    });
};

exports.testRunById = function(req, res) {

    Testrun.find( { $and: [ { productName: req.params.productName }, { dashboardName: req.params.dashboardName }, { testRunId: req.params.testRunId } ] } ).exec(function(err, testrun) {

        if(testrun!= null){

            res.jsonp(testrun);

        }else{

            Event.find({ $and: [
                { productName: req.params.productName },
                { dashboardName: req.params.dashboardName },
                { testRunId: req.params.testRunId }
            ] }).sort('-eventTimestamp').exec(function (err, storedEvents) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {

                    var events = [];
                    for (var i = 0; i < storedEvents.length; i++) {

                        events.push({"id": storedEvents[i].toObject()._id, "eventTimestamp": storedEvents[i].toObject().eventTimestamp.getTime(), "baseline": storedEvents[i].toObject().baseline, "eventDescription": storedEvents[i].toObject().eventDescription, "testRunId": storedEvents[i].toObject().testRunId, "productName": storedEvents[i].toObject().productName, "dashboardName": storedEvents[i].toObject().dashboardName, "buildResultKey": storedEvents[i].toObject().buildResultKey});

                    }

                    var testrun = createTestrunFromEvents(events);

                    getDataForTestrun(req.params.productName, req.params.dashboardName, testrun[0].start, testrun[0].end, function (metrics) {

                        saveTestrun(testrun[0], metrics, function (savedTestrun) {

                            res.jsonp(savedTestrun);

                        });

                    });

                }
            });
        }
    });
};

function getDataForTestrun(productName, dashboardName, start, end, callback){

    Dashboard.findQ( { $and: [ { productName: productName }, { dashboardName: dashboardName } ] } ).populate('metrics').then(function(dashboard){

        var metrics = [];

        _.each(dashboard.metrics, function(metric){

            var targets = [];

            async.forEachLimit(metric.targets, 5, function (target, callback) {

                graphite.getGraphiteData(start, end, target, 900, function(body){

                    targets.push({
                        target: body.target,
                        value: calculateAverage(body.datapoints)
                    });

                    callback();
                });

            }}, function (err) {
                if (err) return next(err);

                metrics.push({
                    alias: metric.alias,
                    type: metric.type,
                    benchmarkValue: metric.benchmarkValue,
                    benchmarkOperator: metric.benchmarkOperator,
                    requirementValue: metric.requirementValue,
                    requirementOperator: metric.requirementOperator,
                    targets: targets
                });

                targets = [];

            });
        })

        callback(metrics);
    })

}

function calculateAverage(datapoints){
    var count = 0;
    var total = 0;

    _.each(datapoints, function(datapoint){

        if(datapoint != null){

            count++;
            total += datapoint[0];

        }

    })

    return Math.round((total / (count)) * 100)/100;
}

function saveTestrun(testrun, metrics, callback){

    var persistTestrun = {};

    persistTestrun.productName = testrun.productName;
    persistTestrun.dashboardName = testrun.dashboardName;
    persistTestrun.testRunId = testrun.dashboardName;
    persistTestrun.start = testrun.dashboardName;
    persistTestrun.end = testrun.dashboardName;
    persistTestrun.baseline = testrun.dashboardName;

    persistTestrun.metrics(setRequirementResults(metrics));

    persistTestrun.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            callback(persistTestrun);
        }
    });


}

function setRequirementResults(metrics){

    var updatedMetrics = [];
    var updatedTargets = [];

    _.each(metrics, function(metric){

        var metricRequirementResult = 'ok';

        _.each(metric.targets, function(target){

            var targetRequirementResult = evaluateRequirement(target.value, metric.requirementOperator, metric.requirementValue);

            if (targetRequirementResult === 'issue') metricRequirementResult = 'issue';

            updatedTargets.push({
                targetRequirementResult: targetRequirementResult ,
                target: target.target,
                value: target.value
            })
        })

        updatedMetrics.push({
            alias: metric.alias,
            type: metric.type,
            metricRequirementResult: metricRequirementResult,
            targets: updatedTargets
        });

        updatedTargets = [];

    })

    return updatedMetrics;
}

function evaluateRequirement(value, requirementOperator, requirementValue){

    var requirementResult = (value requirementOperator requirementValue)? 'ok' : 'issue';


}

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
