'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Product Schema
 */

var ProductSchema = new mongoose.Schema({
    "name": String,
    "description": String,
    "dashboards": [
        { type: Schema.Types.ObjectId, ref: "Dashboard"}
    ],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }

});

ProductSchema.index({ name: 1}, { unique: true });



mongoose.model('Product', ProductSchema);