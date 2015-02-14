'use strict';

// Dashboards controller
angular.module('dashboards').controller('DashboardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Dashboards',
	function($scope, $stateParams, $location, Authentication, Dashboards) {

        $scope.productId = $stateParams.productId;

		$scope.authentication = Authentication;

		// Create new Dashboard
		$scope.create = function() {
			// Create new Dashboard object
			var dashboard = new Dashboards ({
				name: this.name,
                description: this.description,
                productId: this.productId
			});

			// Redirect after save
			dashboard.$save(function(response) {
				$location.path('dashboards/' + response._id);

				// Clear form fields
				$scope.name = '';
                $scope.description = '';
                $scope.productId = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Dashboard
		$scope.remove = function(dashboard) {
			if ( dashboard ) { 
				dashboard.$remove();

				for (var i in $scope.dashboards) {
					if ($scope.dashboards [i] === dashboard) {
						$scope.dashboards.splice(i, 1);
					}
				}
			} else {
				$scope.dashboard.$remove(function() {
					$location.path('dashboards');
				});
			}
		};

		// Update existing Dashboard
		$scope.update = function() {
			var dashboard = $scope.dashboard;

			dashboard.$update(function() {
				$location.path('dashboards/' + dashboard._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Dashboards
		$scope.find = function(productId) {
			$scope.dashboards = Dashboards.query({
                productId: productId
            });
		};

		// Find existing Dashboard
		$scope.findOne = function() {
			$scope.dashboard = Dashboards.get({ 
				dashboardId: $stateParams.dashboardId
			});
		};
	}
]);