'use strict';

// Metrics controller
angular.module('metrics').controller('MetricsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Metrics',
	function($scope, $stateParams, $location, Authentication, Metrics) {
		$scope.authentication = Authentication;
        
        /* values for form drop downs*/
        $scope.metricTypes = ['Average', 'Maximum', 'Minimum', 'Last', 'Slope'];

        $scope.requirementOperatorOptions = [{alias: 'lower than', value: '<'}, {alias: 'higher than', value: '>'}, {alias: '', value: ''}];
        
        $scope.targets = [{text: ''}];

        $scope.thresholdValues = [ {alias: '', value: ''},
            {alias: '5% higher than', value: '0.05'},
            {alias: '10% higher than', value: '0.1'},
            {alias: '25% higher than', value: '0.25'},
            {alias: '50% higher than', value: '0.5'},
            {alias: '75% higher than', value: '0.75'},
            {alias: '5% less than', value: '-0.05'},
            {alias: '10% less than', value: '-0.1'},
            {alias: '25% less than', value: '-0.25'},
            {alias: '50% less than', value: '-0.5'},
            {alias: '75% less than', value: '-0.75'}
        ];


        $scope.addTarget = function() {

            $scope.targets.push( {text: ''});

        };

        $scope.removeTarget = function(index) {

            $scope.targets.splice(index, 1);

        };

        $scope.tags = [{text: ''}];


        $scope.addTag = function() {

            $scope.tags.push( {text: ''});

        };

        $scope.removeTag = function(index) {

            $scope.tags.splice(index, 1);

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