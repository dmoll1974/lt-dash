'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var dashboards = require('../../app/controllers/dashboards.server.controller');

	// Dashboards Routes
	app.route('/dashboards')
		.get(dashboards.list)
		.post(users.requiresLogin, dashboards.create);

	app.route('/dashboards/:dashboardId')
		.get(dashboards.read)
		.put(users.requiresLogin, dashboards.hasAuthorization, dashboards.update)
		.delete(users.requiresLogin, dashboards.hasAuthorization, dashboards.delete);

	// Finish by binding the Dashboard middleware
	app.param('dashboardId', dashboards.dashboardByID);
};
