'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Event = mongoose.model('Event'),
    Testrun = mongoose.model('Testrun'),
    Dashboard = mongoose.model('Dashboard'),
    Product = mongoose.model('Product'),
    _ = require('lodash'),
    graphite = require('./graphite.server.controller'),
    utils = require('./utils.server.controller'),
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

            var testRuns = createTestrunFromEvents(events);

            /* persist test runs */
            var persistedTestruns = [];

            async.forEachLimit(testRuns, 16, function (testRun, callback) {

                getAndPersistTestRunById(req.params.productName, req.params.dashboardName, testRun.testRunId, function(persistedTestRun){

                    persistedTestruns.push(persistedTestRun);
                    callback();


                });
            }, function (err) {
            if (err) return next(err);

            res.jsonp(persistedTestruns.sort(utils.dynamicSort('-start')));

        });


        }

    });
};

exports.testRunById = function(req, res) {

    getAndPersistTestRunById(req.params.productName, req.params.dashboardName, req.params.testRunId, function(testRun){

        res.jsonp(testRun);
    });

}
function getAndPersistTestRunById(productName, dashboardName, testRunId, callback){


    Testrun.findOne( { $and: [ { productName: productName }, { dashboardName: dashboardName }, { testRunId: testRunId } ] } ).exec(function(err, testrun) {

        if(testrun){

            callback(testrun.toObject());

        }else{

            Event.find({ $and: [
                { productName: productName },
                { dashboardName: dashboardName },
                { testRunId: testRunId }
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

                    getDataForTestrun(productName, dashboardName, testrun[0].start, testrun[0].end, function (metrics) {

                        saveTestrun(testrun[0], metrics, function (savedTestrun) {

                            callback(savedTestrun.toObject());

                        });

                    });

                }
            });
        }
    });
};

function getDataForTestrun(productName, dashboardName, start, end, callback){

    Product.findOne({name: productName}).exec(function(err, product){
        if(err) console.log(err);

        Dashboard.findOne( { $and: [ { productId: product._id }, { name: dashboardName } ] } ).populate('metrics').exec(function(err, dashboard){

            if(err) console.log(err);
            var metrics = [];

            // _.each(dashboard.metrics, function(metric){

            async.forEachLimit(dashboard.metrics, 16, function (metric, callback) {

                var targets = [];

                async.forEachLimit(metric.targets, 16, function (target, callback) {

                    graphite.getGraphiteData(Math.round(start / 1000), Math.round(end / 1000), target, 900, function(body){

                        _.each(body, function(target){

                            targets.push({
                                target: target.target,
                                value: calculateAverage(target.datapoints)
                            });

                        })
                        callback();
                    });

                }, function (err) {
                    if (err) return next(err);

                    metrics.push({
                        _id: metric._id,
                        tags: metric.tags,
                        alias: metric.alias,
                        type: metric.type,
                        benchmarkValue: metric.benchmarkValue,
                        benchmarkOperator: metric.benchmarkOperator,
                        requirementValue: metric.requirementValue,
                        requirementOperator: metric.requirementOperator,
                        targets: targets
                    });

                    targets = [];
                    callback();

                });
            }, function (err) {
                if (err) return next(err);

                callback(metrics);

            });

        });
    });
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

    var persistTestrun = new Testrun();

    persistTestrun.productName = testrun.productName;
    persistTestrun.dashboardName = testrun.dashboardName;
    persistTestrun.testRunId = testrun.testRunId;
    persistTestrun.start = testrun.start;
    persistTestrun.end = testrun.end;
    persistTestrun.baseline = testrun.baseline;
    persistTestrun.buildResultKey = testrun.buildResultKey;

    var metricsIncludingReqs = setMetricRequirementResults(metrics);

    _.each(metricsIncludingReqs, function(metric, i){

        persistTestrun.metrics.push({
            _id: metric._id,
            tags: metric.tags,
            alias: metric.alias,
            type: metric.type,
            metricMeetsRequirement: metric.metricMeetsRequirement
        });

        _.each(metric.targets, function(target){

            persistTestrun.metrics[i].targets.push({
                targetMeetsRequirement: target.targetMeetsRequirement,
                target: target.target,
                value: target.value
            })
        })

    })

    persistTestrun.testrunMeetsRequirement = setTestrunRequirementResults(persistTestrun.metrics)
    persistTestrun.save(function(err) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(persistTestrun);
        }
    });


}

function setTestrunRequirementResults(metrics){

    var testrunMeetsRequirement = true;

    _.each(metrics, function(metric){

        if(metric.metricMeetsRequirement === false) {

            testrunMeetsRequirement = false;
            return;
        }
    })

    return testrunMeetsRequirement;
}
function setMetricRequirementResults(metrics){

    var updatedMetrics = [];
    var updatedTargets = [];

    _.each(metrics, function(metric){

        if(metric.requirementValue) {

            var metricMeetsRequirement = true;

            _.each(metric.targets, function (target) {

                var targetMeetsRequirement = evaluateRequirement(target.value, metric.requirementOperator, metric.requirementValue);

                if (targetMeetsRequirement === false) metricMeetsRequirement = false;

                updatedTargets.push({
                    targetMeetsRequirement: targetMeetsRequirement,
                    target: target.target,
                    value: target.value
                })
            })

            updatedMetrics.push({
                _id: metric._id,
                tags: metric.tags,

                alias: metric.alias,
                type: metric.type,
                benchmarkOperator: metric.benchmarkOperator,
                benchmarkValue: metric.benchmarkValue,
                requirementOperator: metric.requirementOperator,
                requirementValue: metric.requirementValue,
                metricMeetsRequirement: metricMeetsRequirement,
                targets: updatedTargets
            });

            updatedTargets = [];
        }
    })

    return updatedMetrics;
}

function evaluateRequirement(value, requirementOperator, requirementValue){

    var requirementResult;

    if((requirementOperator === "<" && value > requirementValue) || requirementOperator === ">" && value < requirementValue){

        var requirementResult = false;

    }else{

        var requirementResult = true;
    }

    return requirementResult;
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
exports.runningTest = function (req, res){

    var currentTime = new Date();
    var anyEventFound = false;

    Event.find({ $and: [ { productName: req.params.productName }, { dashboardName: req.params.dashboardName } ] }).sort({eventTimestamp: -1}).lean().exec(function(err, events){

        if(err) throw err;

        for(var i=0;i<events.length;i++) {

            if (events[i].eventDescription === 'start') {

                var endEventFound = false;
                var tooOld = false;
                var anyEventFound = true;

                for (var j = 0; j < events.length; j++) {

                    if (events[i].testRunId == events[j].testRunId && events[j].eventDescription === 'end')
                        endEventFound = true;

                }


                if (endEventFound == false && (currentTime.getTime() - events[i].eventTimestamp.getTime()  < 176400000)) {

                    var returnEvent = events[i];
                    /* Only show Gatling details if testrun duration < 8 hours */
                    //if (currentTime.getTime() - events[i].timestamp.getTime()  < 28800000) {
                    //
                    //    returnEvent.showGatlingDetails = true;
                    //
                    //}else{
                    //
                    //    returnEvent.showGatlingDetails = false;
                    //
                    //}

                    res.jsonp(returnEvent);
                    break;

                /* If running test is older than 48 hours, leave it*/
                } else if( (currentTime.getTime() - events[i].eventTimestamp.getTime()) > 176400000){
                    tooOld = true
                }


            }
        }

        if (endEventFound === true || tooOld === true || anyEventFound === false ) {
            res.jsonp(null);

        }


    });

}
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
