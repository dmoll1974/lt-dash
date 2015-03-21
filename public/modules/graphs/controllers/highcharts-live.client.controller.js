'use strict';

angular.module('graphs').controller('HighchartsLiveController', ['$scope', 'Interval', 'Graphite', 'TestRuns', '$q','$http', '$log',
    function($scope, Interval, Graphite, TestRuns, $q, $http, $log) {


        $scope.$watch('group.isOpen', function (newVal, oldVal) {

            if (newVal === false) Interval.clearIntervalForMetric($scope.metric._id);

        });

        $scope.chart = {
            options: {
                chart: {
                    type: 'line',
                    zoomType: 'x',
                    events: {
                        load: function () {

                            /* Clear interval that might be already running for this metric */
                            Interval.clearIntervalForMetric($scope.metric._id);

                            var intervalId = setInterval(function () {
                                //TODO  check of isOpen = true
                                Graphite.getData('-10min', 'now', $scope.metric.targets, 900).then(function (series) {

                                    /* update series */
                                    _.each(series, function (serie) {

                                        _.each($scope.config.series, function (existingSerie, i) {


                                            if (serie.name === existingSerie.name) {

                                                var newDatapoints = _.filter(serie.data, function (newDataPoint) {

                                                    var isNew = true;
                                                    _.each(existingSerie.data, function (existingDataPoint) {

                                                        if (newDataPoint[0] === existingDataPoint[0]) isNew = false;

                                                    })

                                                    return isNew;

                                                })

                                                if (newDatapoints.length > 0) {

                                                    _.each(newDatapoints, function (datapoint) {

                                                        $scope.config.series[i].data.push([datapoint[0], datapoint[1]]);
                                                    })

                                                }

                                                return;
                                            }
                                        })


                                    })

                                });

                                console.log('intervalIds:' + Interval.active)
                            }, 10000);

                            Interval.active.push({intervalId: intervalId, metricId: $scope.metric._id});

                        }
                    }
                },
                rangeSelector: {
                    buttons: [{
                        count: 10,
                        type: 'minute',
                        text: '10M'
                    }, {
                        count: 30,
                        type: 'minute',
                        text: '30M'
                    }, {
                        count: 1,
                        type: 'hour',
                        text: '1H'
                    },
                        {
                            type: 'all',
                            text: 'All'
                        }],
                    inputEnabled: false,
                    selected: 3
                }

            },
            series: [],

            title: {
                text: 'Hello'
            },
            xAxis: {minRange: 10000, type: 'datetime' },
            loading: false,
            useHighStocks: true

    }


        $scope.initConfig = function (config, metric) {
            //debugger;

            $scope.metric = metric;
            $scope.config = angular.copy(config);
            $scope.config.title.text = metric.alias;
            Graphite.getData('-10min', 'now', metric.targets, 900).then(function (series) {

                _.each(series, function(serie, i){

                    $scope.config.series.push({name: serie.name, data: serie.data});

                })
            });


        }
    }
]);
