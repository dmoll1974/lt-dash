'use strict';

//Setting up route
angular.module('graphs').config(['$stateProvider',
	function($stateProvider) {
		// Graphs state routing
		$stateProvider.
		state('viewGraphs', {
			url: '/graphs/:productName/:dashboardName/:testRunId',
			templateUrl: 'modules/graphs/views/graphs.client.view.html'
		}).
        state('viewLiveGraphs', {
            url: '/graphs-live/:productName/:dashboardName',
            templateUrl: 'modules/graphs/views/graphs-live.client.view.html'
        });
	}
]);
