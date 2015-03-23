'use strict';

angular.module('graphs').controller('GraphsController', ['$scope', '$rootScope', '$state', 'Dashboards','Graphite','TestRuns','$log', 'Tags',
	function($scope, $rootScope, $state, Dashboards, Graphite, TestRuns, $log, Tags) {

        /* Zoom lock enabled by default */
        $scope.zoomLock = true;

        $scope.dashboard = Dashboards.selected;

        $scope.metrics = Dashboards.selected.metrics;

        /* Get tags used in metrics */
        $scope.tags = Tags.setTags($scope.metrics);

        /* default zoom range for live graphs */
        $scope.zoomRange = '-10min';

        /* Set tag based on tabs*/
        $scope.setTag = function (tag){

            $scope.value = tag;
        };




	}
]);
