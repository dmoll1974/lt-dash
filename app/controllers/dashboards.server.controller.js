'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Dashboard = mongoose.model('Dashboard'),
    Product = mongoose.model('Product'),
	_ = require('lodash');


function getProductName(productId, callback){
    
    Product.findOne({_id: productId}).exec(function(err, product){
        if (err) return next(err);
        if (! product) return new Error('Failed to load ProductId ' + productId);
        callback(product.name)
        
    });
    
}
/**
 * Create a Dashboard
 */
exports.create = function(req, res) {
	var dashboard = new Dashboard(req.body);
	dashboard.user = req.user;


    dashboard.productId = req.product._id;

    dashboard.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(dashboard);
        }
    });

};


/**
 * Update a Dashboard
 */
exports.update = function(req, res) {
	var dashboard = req.dashboard ;

	dashboard = _.extend(dashboard , req.body);

	dashboard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dashboard);
		}
	});
};

/**
 * Delete an Dashboard
 */
exports.delete = function(req, res) {
	var dashboard = req.dashboard ;

	dashboard.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dashboard);
		}
	});
};

/**
 * List of Dashboards
 */
exports.list = function(req, res) { 
	Dashboard.find().sort('-created').populate('metrics').exec(function(err, dashboards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dashboards);
		}
	});
};

/**
 * Show the current Dashboard
 */
exports.read = function(req, res) {
    Dashboard.findOne({productId: req.product._id, name: req.params.dashboardName}).populate('metrics').exec(function(err, dashboard){
        if (err) return next(err);
        if (! dashboard) return next(new Error('Failed to load Dashboard ' + req.params.dashboardName));
        res.jsonp(dashboard);
    })

};

/**
 * Dashboard middleware
 */
exports.dashboardByID = function(req, res, next, id) { 
	Dashboard.findById(id).populate('user', 'displayName').exec(function(err, dashboard) {
		if (err) return next(err);
		if (! dashboard) return next(new Error('Failed to load Dashboard ' + id));
		req.dashboard = dashboard ;
		next();
	});
};

exports.dashboardByProductName = function(req, res, next, productName) {
    Product.findOne({name: productName}).exec(function(err, product) {
        if (err) return next(err);
        if (! product) return next(new Error('Failed to load Product ' + productName));
        req.product = product ;
        next();
    });
};


/**
 * Dashboard authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.dashboard.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
