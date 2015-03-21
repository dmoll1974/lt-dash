'use strict';

angular.module('graphs').controller('GraphsController', ['$scope', 'Dashboards','Graphite','TestRuns','$log', 'Tags',
	function($scope, Dashboards, Graphite, TestRuns, $log, Tags) {

        $scope.metrics = Dashboards.selected.metrics;

        $scope.tags = Tags.setTags($scope.metrics);

        $scope.tabs = [];



        /* Tab controller */

        //$scope.$watch(function(scope) { return DashboardTabs.tabNumber },
        //    function() {
        //
        //        this.tab = DashboardTabs.tabNumber;
        //    }
        //);
//        this.tab = DashboardTabs.tabNumber;

        $scope.setTab = function(index){
            this.tabNumber = index;
            $scope.value = $scope.tags[index];
        }

        $scope.isSet = function(tabNumber){
            return this.tabNumber === tabNumber;
        };

        $scope.dashboard = Dashboards.selected;

        $scope.value = 'CPU';
        //





        //$scope.getData = function(from, until, targets, maxDataPoints){
        //
        //
        //    Graphite.getData(from, until, targets, maxDataPoints).success(function (graphiteData){
        //
        //        var series = [];
        //        for (var j = 0; j < graphiteData.length; j++) {
        //
        //            var data = [];
        //
        //            for (var i = 0; i < graphiteData[j].datapoints.length; i++) {
        //
        //                if (graphiteData[j].datapoints[i][0] !== null)
        //                    data.push([graphiteData[j].datapoints[i][1] * 1000, graphiteData[j].datapoints[i][0]]);
        //                else
        //                    data.push([graphiteData[j].datapoints[i][1] * 1000, 0]);
        //            }
        //
        //            series.push({
        //                name: graphiteData[j].target,
        //                data: data,
        //                tooltip: {
        //                    valueDecimals: 2
        //                }
        //            });
        //        }
        //
        //        return series;
        //    });
        //}



        //$scope.toggleLoading = function () {
        //    this.chartConfig.loading = !this.chartConfig.loading
        //}

	}
]);
