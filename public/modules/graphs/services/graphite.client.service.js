'use strict';

angular.module('graphs').factory('Graphite', ['$http','$q', '$log',
	function($http, $q, $log) {

        var Graphite = {
            getData: getData//,
            //createHighstockSeries: createHighstockSeries

        };

        return Graphite;

        function createChartSeries (graphiteData){

            var series = [];
            for (var j = 0; j < graphiteData.length; j++) {

                var data = [];

                for (var i = 0; i < graphiteData[j].datapoints.length; i++) {

                    if (graphiteData[j].datapoints[i][0] !== null)
                        data.push([graphiteData[j].datapoints[i][1] * 1000, graphiteData[j].datapoints[i][0]]);
                    //else
                    //    data.push([graphiteData[j].datapoints[i][1] * 1000, 0]);
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

            var queryFrom = /^\d+$/.test(from) ?  Math.round(from / 1000) : from;
            var queryUntil = /^\d+$/.test(until) ?  Math.round(until / 1000) : until;

            _.each(targets, function(target){

                urlEncodedTargetUrl = urlEncodedTargetUrl + '&target=' + encodeURI(target);

            });

            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.jsonp('/graphite?' + urlEncodedTargetUrl + '&from=' + queryFrom + '&until=' + queryUntil + '&maxDataPoints=' + maxDataPoints + '&callback=JSON_CALLBACK')
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



    function convertTime(inputTime){

        var outputTime;
        var inputTimePattern = new RegExp(/-([0-9]+)(h|d|w|mon|min|y|2)/);
        var numberOf = (inputTime.match(inputTimePattern)) ? inputTime.match(inputTimePattern)[1] : "";
        var timeUnit = (inputTime.match(inputTimePattern)) ? inputTime.match(inputTimePattern)[2] : "";
        if (inputTime == "now"){

            outputTime = new Date().getTime();
        }else {

            switch (timeUnit) {


                case "s":

                    outputTime = new Date() - numberOf
                    break;

                case "min":

                    outputTime = new Date() - (numberOf * 60 * 1000)
                    break;

                case "h":

                    outputTime = new Date() - (numberOf * 3600 * 1000)
                    break;


                case "d":

                    outputTime = new Date() - (numberOf * 3600 * 24 * 1000)
                    break;

                case "w":

                    outputTime = new Date() - (numberOf * 3600 * 24 * 7 * 1000)
                    break;

                case "mon":

                    outputTime = new Date() - (numberOf * 3600 * 24 * 7 * 30 * 1000)
                    break;

                default:

                    outputTime = Math.round(inputTime / 1000);
                    break;
            }
        }

        return outputTime;

         }

    }
]);
