'use strict';

// Metrics controller
angular.module('metrics').controller('MetricsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Metrics', 'Dashboards',
	function($scope, $stateParams, $location, Authentication, Metrics, Dashboards) {
		$scope.authentication = Authentication;

//        $scope.dashboard = Dashboards.selected().tags;
        
        $scope.targets = [{text: ''}];


        $scope.addTarget = function() {

            $scope.targets.push( {text: ''});

        };

        $scope.removeTarget = function(index) {

            $scope.targets.splice(index, 1);

        };

        $scope.tags = [];

        $scope.loadTags = function(query) {
            return Dashboards.selected().tags;
        };


        // Create new Metric
		$scope.create = function() {
			// Create new Metric object
			var metric = new Metrics ({
				name: this.name
			});

			// Redirect after save
			metric.$save(function(response) {
				$location.path('metrics/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Metric
		$scope.remove = function(metric) {
			if ( metric ) { 
				metric.$remove();

				for (var i in $scope.metrics) {
					if ($scope.metrics [i] === metric) {
						$scope.metrics.splice(i, 1);
					}
				}
			} else {
				$scope.metric.$remove(function() {
					$location.path('metrics');
				});
			}
		};

		// Update existing Metric
		$scope.update = function() {
			var metric = $scope.metric;

			metric.$update(function() {
				$location.path('metrics/' + metric._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Metrics
		$scope.find = function() {
			$scope.metrics = Metrics.query();
		};

		// Find existing Metric
		$scope.findOne = function() {
			$scope.metric = Metrics.get({ 
				metricId: $stateParams.metricId
			});
		};
	}
]);