'use strict';

//Setting up route
angular.module('dashboards').config(['$stateProvider',
	function($stateProvider) {
		// Dashboards state routing
		$stateProvider.
		state('listDashboards', {
			url: '/dashboards',
			templateUrl: 'modules/dashboards/views/list-dashboards.client.view.html'
		}).
		state('createDashboard', {
			url: '/dashboards/create',
			templateUrl: 'modules/dashboards/views/create-dashboard.client.view.html'
		}).
		state('viewDashboard', {
			url: '/dashboards/:dashboardId',
			templateUrl: 'modules/dashboards/views/view-dashboard.client.view.html'
		}).
		state('editDashboard', {
			url: '/dashboards/:dashboardId/edit',
			templateUrl: 'modules/dashboards/views/edit-dashboard.client.view.html'
		});
	}
]);