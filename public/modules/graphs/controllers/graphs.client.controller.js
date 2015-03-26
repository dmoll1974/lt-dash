'use strict';

angular.module('graphs').controller('GraphsController', ['$scope', '$rootScope', '$state', '$stateParams', 'Dashboards','Graphite','TestRuns','$log', 'Tags',
	function($scope, $rootScope, $state, $stateParams, Dashboards, Graphite, TestRuns, $log, Tags) {

        /* Zoom lock enabled by default */
        $scope.zoomLock = true;

        $scope.init = function(){

                Dashboards.get($stateParams.productName, $stateParams.dashboardName).then(function (dashboard){

                        $scope.dashboard = Dashboards.selected;

                        $scope.metrics = Dashboards.selected.metrics;

                        /* Get tags used in metrics */
                        $scope.tags = Tags.setTags($scope.metrics);

                })

                /* Get test run based on $stateParams*/
                if($stateParams.testRunId) {
                        if (JSON.stringify(TestRuns.selected) === '{}') TestRuns.getTestRunById($stateParams.productName, $stateParams.dashboardName, $stateParams.testRunId);
                }


        };

        /* default zoom range for live graphs */
        $scope.zoomRange = '-10min';

        /* Set tag based on tabs*/
        $scope.setTag = function (tag){

            $scope.value = tag;
        };






	}
]);
