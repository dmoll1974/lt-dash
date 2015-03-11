'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var dashboards = require('../../app/controllers/dashboards.server.controller');

	// Dashboards Routes
	app.route('/dashboards/:productName')
		.get(dashboards.list)
		.post(users.requiresLogin, dashboards.create);

	app.route('/dashboards/:productName/:dashboardName')
		.get(dashboards.read)

    app.route('/dashboards/:dashboardId')
        .put(dashboards.update) // users.requiresLogin, dashboards.hasAuthorization,
        .delete(users.requiresLogin, dashboards.hasAuthorization, dashboards.delete);

    // Finish by binding the Dashboard middleware
	app.param('dashboardId', dashboards.dashboardByID);
//    app.param('dashboardName', dashboards.dashboardByName);
    app.param('productName', dashboards.dashboardByProductName);
};
