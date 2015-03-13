'use strict';

// Metrics controller
angular.module('metrics').controller('MetricsController', ['$scope', '$modal', '$log', '$rootScope', '$stateParams', '$state', '$location', 'Authentication', 'Metrics','Dashboards',
	function($scope, $modal, $log, $rootScope, $stateParams, $state, $location, Authentication, Metrics, Dashboards) {
		$scope.authentication = Authentication;

        $scope.productName = $stateParams.productName;

        $scope.dashboardName = $stateParams.dashboardName;

        /* values for form drop downs*/
        $scope.metricTypes = ['Average', 'Maximum', 'Minimum', 'Last', 'Slope'];

        $scope.requirementOperatorOptions = [{alias: 'lower than', value: '<'}, {alias: 'higher than', value: '>'}];
                
        $scope.targets = [''];

        $scope.metric = {};

        $scope.metric.dashboardId = Dashboards.selected._id;

        $scope.metric.targets = [''];

        $scope.enableBenchmarking = 'disabled';

        $scope.enableRequirement ='disabled';
        
        $scope.thresholdValues = [
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

            $scope.metric.targets.push('');

        };

        $scope.removeTarget = function(index) {

            $scope.metric.targets.splice(index, 1);

        };

        $scope.loadTags = function(query){

            var matchedTags = [];

            _.each(Dashboards.selected.tags, function(tag){

                if(tag.text.toLowerCase().match(query.toLowerCase()))
                    matchedTags.push(tag);
            });

                return matchedTags;

        };

        $scope.initCreateForm = function () {
            
           if (Metrics.clone.alias ) $scope.metric = Metrics.clone;
        };

        // Create new Metric
		$scope.create = function() {



            Dashboards.updateTags($scope.metric.tags);
                
            Dashboards.update().success(function(dashboard){});
                

            Metrics.create($scope.metric).success(function (metric) {

            /* reset cloned metric */
                Metrics.clone = {};
                
                $location.path('browse/' + $stateParams.productName + '/' + $stateParams.dashboardName);
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


            Metrics.update($scope.metric).success(function (metric) {

                $location.path('browse/' + $stateParams.productName + '/' + $stateParams.dashboardName);
            });
		};

		// Find a list of Metrics
		$scope.find = function() {
			$scope.metrics = Metrics.query();
		};

		// Find existing Metric
		$scope.findOne = function() {

            Metrics.get($stateParams.metricId).success(function(metric){

                $scope.metric = metric;

                /* set benchmark and requirement toggles */

                if($scope.metric.requirementValue)
                    $scope.enableRequirement ='enabled';

                if($scope.metric.benchmarkWarning)
                    $scope.enableBenchmarking = 'enabled';




            });
		};

       $scope.clone = function() {
           
           $scope.metric._id = undefined;

           Metrics.clone = $scope.metric;

           $state.go('createMetric',{"productName":$stateParams.productName, "dashboardName":$stateParams.dashboardName});
           
       } 
       $scope.cancel = function() {
           
          if ($rootScope.previousStateParams)
              $state.go($rootScope.previousState,$rootScope.previousStateParams);
          else
              $state.go($rootScope.previousState);



       }
        $scope.openDeleteConfirmation = function (size, index) {

            Metrics.selected = $scope.metric;

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size
            });

            modalInstance.result.then(function (metricId) {

                Metrics.delete(metricId).success(function(metric){

                    /* refresh dashboard*/
                    Dashboards.get($scope.productName, $scope.dashboardName).success(function(dashboard){

                        $scope.dashboard = Dashboards.selected;
                        
                        /* return to previuos state*/
                        $state.go($rootScope.previousState,$rootScope.previousStateParams);

                    });

                });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


    }
]).controller('ModalInstanceCtrl',['$scope','$modalInstance', 'Metrics', function($scope, $modalInstance, Metrics) {

    $scope.selectedMetric = Metrics.selected;

    $scope.ok = function () {
        $modalInstance.close($scope.selectedMetric._id);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}
]);