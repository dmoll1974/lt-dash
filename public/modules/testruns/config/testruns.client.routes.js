'use strict';

//Setting up route
angular.module('testruns').config(['$stateProvider',
	function($stateProvider) {
		// Testruns state routing
		$stateProvider.
		state('viewTestruns', {
			url: '/testruns/:productName/:dashboardName',
			templateUrl: 'modules/testruns/views/testruns.client.view.html'
		});
	}
]);
