'use strict';

angular.module('graphs').controller('GraphsController', ['$scope', 'Dashboards','Graphite','TestRuns',
	function($scope, Dashboards, Graphite, TestRuns) {

        $scope.metrics = Dashboards.selected.metrics;


        //

        $scope.chart = {
            options: {
                chart: {
                    type: 'line',
                    zoomType: 'x'
                }
                ,
                rangeSelector: {
                    enabled: false
                }

            },
            series: [
            ],
            title: {
                text: 'Hello'
            },
            //xAxis: {currentMin: 0, currentMax: 10, minRange: 1},
            loading: false,
            useHighStocks: true
        }




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
