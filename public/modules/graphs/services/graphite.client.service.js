'use strict';

angular.module('graphs').factory('Graphite', ['$http','$q',
	function($http, $q) {

        var Graphite = {
            getData: getData//,
            //createHighstockSeries: createHighstockSeries

        };

        return Graphite;

        function getData(from, until, targets, maxDataPoints) {

            var urlEncodedTargetUrl = '';
            var fromSeconds = Math.round(from / 1000);
            var untilSeconds = Math.round(until /1000);


            _.each(targets, function(target){

                urlEncodedTargetUrl = urlEncodedTargetUrl + '&target=' + encodeURI(target);

            });

            var deferred = $q.defer();

            $http.get('/graphite?' + urlEncodedTargetUrl + '&from=' + fromSeconds + '&until=' + untilSeconds + '&maxDataPoints=' + maxDataPoints)
                .success(function(graphiteData) {
                    deferred.resolve(
                        createChartSeries(graphiteData)
                    )

                }).error(function(msg, code) {
                    deferred.reject(msg);
                    $log.error(msg, code);
                });

            return deferred.promise;
        }

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
    }
]);
