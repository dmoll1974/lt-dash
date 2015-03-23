'use strict';

angular.module('graphs').controller('GraphsController', ['$scope', '$rootScope', '$state', 'Dashboards','Graphite','TestRuns','$log', 'Tags',
	function($scope, $rootScope, $state, Dashboards, Graphite, TestRuns, $log, Tags) {

        $scope.zoomLock = true;

        if ($scope.zoomLock){

            $scope.from = TestRuns.zoomFrom;
            $scope.until = TestRuns.zoomUntil;
        }

        $scope.$watch(function(scope) { return TestRuns.zoomFrom},
            function() {

                //if(newVal !== oldVal) {

                    $scope.from = TestRuns.zoomFrom;
                    $scope.until = TestRuns.zoomUntil;
                //}
            }
        );

        $scope.metrics = Dashboards.selected.metrics;

        $scope.tags = Tags.setTags($scope.metrics);

        $scope.tabs = [];


        $scope.zoomRange = '-10min';





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

        $scope.value = 'All';



	}
]);
