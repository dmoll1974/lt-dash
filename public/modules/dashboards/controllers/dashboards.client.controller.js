'use strict';

// Dashboards controller
angular.module('dashboards').controller('DashboardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Dashboards', 'Products',
	function($scope, $stateParams, $location, Authentication, Dashboards, Products) {

        $scope.productId = $stateParams.productId;

		$scope.authentication = Authentication;

		// Create new Dashboard
		$scope.create = function() {
			// Create new Dashboard object
            var dashboard = {};
            dashboard.name = this.name;
            dashboard.description = this.description;

            Dashboards.create(dashboard, $stateParams.productName).success(function(dashboard){


                $location.path('browse/' + $stateParams.productName + '/' + dashboard.name);

                Products.fetch().success(function(products){
                    $scope.products = Products.items;

                });

                // Clear form fields
                $scope.name = '';
                $scope.description = '';
                $scope.productName = '';

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
            dashboard.productName = $stateParams.productName;
			dashboard.$update(function() {
				$location.path('dashboards/' + dashboard._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Dashboards
		$scope.find = function() {
			$scope.dashboards = Dashboards.query({
                dashboardName: $stateParams.dashboardName,
                productName: $stateParams.productName
            });
		};

		// Find existing Dashboard
		$scope.findOne = function() {
			$scope.dashboard = Dashboards.get({ 
				dashboardName: $stateParams.dashboardName,
                productName: $stateParams.productName
			});
		};
	}
]);