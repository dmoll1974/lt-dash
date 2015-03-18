'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    errorHandler = require('./errors.server.controller'),
    requestjson = require('request-json'),
    config = require('../../config/config')

/**
 * Create a Graphite
 */
exports.getData = function(req, res) {

    var from = req.query.from;
    var until = req.query.until;
    var targets = req.query.target;
    var maxDataPoints = req.query.maxDataPoints;

    var graphiteTargetUrl = createUrl(from, until, targets, maxDataPoints);

    var client = requestjson.createClient(config.graphiteHost);

    client.get(graphiteTargetUrl, function (err, response, body) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(body);
        }

    });
};

function createUrl(from, until, targets, maxDataPoints){

    var graphiteTargetUrl = '/render?format=json&from=' + from + "&until=" + until + "&maxDataPoints=" + maxDataPoints;

    if (_.isArray(targets)){
        _.each(targets, function(target){

            graphiteTargetUrl += '&target=' + target;

        });
    }else{

        graphiteTargetUrl += '&target=' + targets;
    }

    return graphiteTargetUrl;
}

