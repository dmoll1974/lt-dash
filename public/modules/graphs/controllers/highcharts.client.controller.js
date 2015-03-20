'use strict';

angular.module('graphs').controller('HighchartsController', ['$scope','Graphite', 'TestRuns', '$q','$http', '$log',
	function($scope, Graphite, TestRuns, $q, $http, $log) {


        //$scope.$watch('series', function(newSeries) {
        //
        //    _.each(newSeries, function(serie, i){
        //
        //        $scope.config.series[i].data = serie.data;
        //
        //    })
        //
        //
        //    $scope.config.series = newSeries;
        //})

        function createChartSeries (graphiteData){

            var series = [];
            for (var j = 0; j < graphiteData.length; j++) {

                var data = [];

                for (var i = 0; i < graphiteData[j].datapoints.length; i++) {

                    if (graphiteData[j].datapoints[i][0] !== null)
                        data.push([graphiteData[j].datapoints[i][1] * 1000, graphiteData[j].datapoints[i][0]]);
                    else
                        data.push([graphiteData[j].datapoints[i][1] * 1000, 0]);
                }

                series.push({
                    name: graphiteData[j].target,
                    data: data,
                    tooltip: {
                        valueDecimals: 2
                    }
                });
            }
            return series;
        }



            function getData(from, until, targets, maxDataPoints) {

                var urlEncodedTargetUrl = '';
                var fromSeconds = Math.round(from / 1000);
                var untilSeconds = Math.round(until /1000);


                _.each(targets, function(target){

                    urlEncodedTargetUrl = urlEncodedTargetUrl + '&target=' + encodeURI(target);

                });

                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.jsonp('/graphite?' + urlEncodedTargetUrl + '&from=' + fromSeconds + '&until=' + untilSeconds + '&maxDataPoints=' + maxDataPoints + '&callback=JSON_CALLBACK')
                    .success(function(graphiteData) {
                        deferred.resolve(
                            createChartSeries(graphiteData)
                        )

                    }).error(function(msg, code) {
                        deferred.reject(msg);
                        $log.error(msg, code);
                    });

                return promise;
            }



        $scope.initConfig = function (config, metric) {
            //debugger;

            $scope.config = angular.copy(config);
            $scope.config.title.text = metric.alias;
            getData(TestRuns.selected.start, TestRuns.selected.end, metric.targets, 900).then(function (series) {

                _.each(series, function(serie, i){

                    $scope.config.series.push({name: serie.name, data: serie.data});
                    //$scope.config.series[i].data = serie.data;
                    //$scope.config.series[i].name = serie.name;

                })
            });


        }

    }

]);
