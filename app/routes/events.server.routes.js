'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var events = require('../../app/controllers/events.server.controller');

	// Events Routes
	app.route('/events')
		.get(events.list)
		.post( events.create); //users.requiresLogin,

//    app.route('/events-product/:productName')
//        .get(events.eventsForProduct)

    app.route('/events-dashboard/:productName/:dashboardName')
        .get(events.eventsForDashboard)
    
	app.route('/events/:eventId')
		.get(events.read)
		.put(events.update) //users.requiresLogin, events.hasAuthorization,
		.delete(users.requiresLogin, events.hasAuthorization, events.delete);

	// Finish by binding the Event middleware
	app.param('eventId', events.eventByID);
};
