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
    "name": { type: String, uppercase: true },
    "description": String,
    "metrics": [
        { type: Schema.Types.ObjectId, ref: "Metric"}
    ],
    "granularity": {type: Number, default: 15},
    "metricsRegexWily": [String],
    "hosts": [String],
    "applications": [String],
    "instances": Number,
    "tags": {type:[{text: String}], default: [{text: 'Load'},{text: 'JVM'}, {text: 'DB'}, {text:'CPU'}, {text:'Frontend'}, {text: 'JDBC'}, {text: 'GC'}, {text: 'Heap'}, {text: 'Sessions'}, {text: 'Threads'}]}
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