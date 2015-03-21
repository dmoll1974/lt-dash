'use strict';

angular.module('graphs').controller('HighchartsController', ['$scope','Graphite', 'TestRuns', '$q','$http', '$log',
	function($scope, Graphite, TestRuns, $q, $http, $log) {



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



        $scope.initConfig = function (config, metric) {
            //debugger;

            $scope.config = angular.copy(config);
            $scope.config.title.text = metric.alias;
            Graphite.getData(TestRuns.selected.start, TestRuns.selected.end, metric.targets, 900).then(function (series) {

                _.each(series, function(serie, i){

                    $scope.config.series.push({name: serie.name, data: serie.data});

                })
            });


        }

    }

]);
