'use strict';

angular.module('graphs').controller('HighchartsController', ['$scope','Graphite', 'TestRuns', '$q','$http', '$log',
	function($scope, Graphite, TestRuns, $q, $http, $log) {

        $scope.group = {isOpen : false};

        $scope.$watch('value', function (newVal, oldVal) {

            if (newVal !== 'All') $scope.group.isOpen = true;

        });

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
            xAxis: {
                minRange: 10000,
                events: {
                    setExtremes: function(e) {

                        var from = (typeof e.min == 'undefined' && typeof e.max == 'undefined')? TestRuns.selected.start : Math.round(e.min);
                        var until = (typeof e.min == 'undefined' && typeof e.max == 'undefined')? TestRuns.selected.end : Math.round(e.max);

                        $scope.config.loading = true;

                        Graphite.getData(from, until, $scope.metric.targets, 900).then(function (series) {

                            //_.each(series, function(serie, i){

                                //$scope.config.series.push({name: serie.name, data: serie.data});

                            //})
                            $scope.config.series = series;
                            $scope.config.loading = false;
                        });
                    }
                }
            },
            loading: true,
            useHighStocks: true
        }



        $scope.initConfig = function (config, metric) {
            //debugger;

            $scope.config = angular.copy(config);
            $scope.config.title.text = metric.alias;
            Graphite.getData(TestRuns.selected.start, TestRuns.selected.end, metric.targets, 900).then(function (series) {

                _.each(series, function(serie, i){

                    $scope.config.series.push({name: serie.name, data: serie.data});
                    $scope.config.loading = false;

                })
            });


        }

    }

]);
