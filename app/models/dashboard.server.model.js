'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Dashboard Schema
 */

var dashboardSchema = new mongoose.Schema({
    "productId": { type: Schema.Types.ObjectId, ref: "Product"},
    "name": String,
    "description": String,
    "metrics": [
        { type: Schema.Types.ObjectId, ref: "Metric"}
    ],
    "granularity": {type: Number, default: 15},
    "metricsRegexWily": [String],
    "hosts": [String],
    "applications": [String],
    "instances": Number,
    "tags": {type:[String], default: ['Load', 'JVM', 'DB', 'CPU', 'Frontend', 'JDBC', 'GC', 'Heap', 'Sessions', 'Threads', 'Misc']}
});

dashboardSchema.pre('remove', function(next){
    this.model('Product').update(
        {_id: this.productId},
        {$pull: {dashboards: this._id}},
        {multi: true},
        next
    );
});

dashboardSchema.pre('save', function(next){
    this.model('Product').update(
        {_id: this.productId},
        {$addToSet: {dashboards: this._id}},
        next
    );
});

dashboardSchema.index({ name: 1, productId: 1}, { unique: true });

mongoose.model('Dashboard', dashboardSchema);