'use strict';

//Setting up route
angular.module('dashboards').config(['$stateProvider',
	function($stateProvider) {
		// Dashboards state routing
		$stateProvider.
		state('listDashboards', {
			url: ':/dashboards/:productId',
			templateUrl: 'modules/dashboards/views/list-dashboards.client.view.html'
		}).
		state('createDashboard', {
			url: '/dashboards/create/:productId',
			templateUrl: 'modules/dashboards/views/create-dashboard.client.view.html'
		}).
		state('viewDashboard', {
			url: '/browse/:productId/:dashboardId',
			templateUrl: 'modules/dashboards/views/view-dashboard.client.view.html'
		}).
		state('editDashboard', {
			url: '/configure/:productId/:dashboardId',
			templateUrl: 'modules/dashboards/views/edit-dashboard.client.view.html'
		});
	}
]);