'use strict';

angular.module('graphs').controller('GraphsController', ['$scope', '$rootScope', '$state', '$stateParams', 'Dashboards','Graphite','TestRuns','$log', 'Tags',
	function($scope, $rootScope, $state, $stateParams, Dashboards, Graphite, TestRuns, $log, Tags) {

        $scope.value = $stateParams.tag;

        /* Zoom lock enabled by default */
        $scope.zoomLock = true;

        $scope.init = function(){

                Dashboards.get($stateParams.productName, $stateParams.dashboardName).then(function (dashboard){

                        $scope.dashboard = Dashboards.selected;

                        $scope.metrics = Dashboards.selected.metrics;

                        /* Get tags used in metrics */
                        $scope.tags = Tags.setTags($scope.metrics, $stateParams.productName, $stateParams.dashboardName);

                })




        };

        /* default zoom range for live graphs */
        $scope.zoomRange = '-10min';

        /* Set active tab */
        $scope.isActive = function (tag){

           return  $scope.value === tag;
        };






	}
]);
