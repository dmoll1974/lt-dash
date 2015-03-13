'use strict';

//Dashboards service used to communicate Dashboards REST endpoints
angular.module('dashboards').factory('Dashboards', ['$http',
	function($http) {

        var Dashboards = {
//            items : [],
            'get' : getFn,
            selected: '',
            update: update,
//            query : query,
//            fetch : fetch,
            create: create

        };

        return Dashboards;


        function update(){
            return $http.put('/dashboards/' + Dashboards.selected._id, Dashboards.selected).success(function(dashboard){

            });
        }

        function create(dashboard, productName){
            return $http.post('/dashboards/' + productName, dashboard).success(function(dashboard){

            });
        }

        function getFn(productName, dashboardName){
            return $http.get('/dashboards/' + productName + '/' + dashboardName).success(function(dashboard){

                Dashboards.selected = dashboard;
            });
        }

        

    }
]).factory('DashboardTabs', ['$http',
    function($http) {

        var DashboardTabs = {
            setTab : setTab,
            tabNumber : 1,
            isSet : isSet 
        };

        return DashboardTabs;

        function isSet(tabNumber){
            
            return DashboardTabs.tabNumber === tabNumber;
            
        }

        function setTab(tabName){

            switch(tabName){

                case 'Test runs':
                    DashboardTabs.tabNumber = 1;
                    break;
                case 'Metrics':
                    DashboardTabs.tabNumber = 2;
                    break;
                case 'Events':
                    DashboardTabs.tabNumber = 3;
                    break;
                default:
                    DashboardTabs.tabNumber = 1;
                    break;
            }

        }

    }
]);