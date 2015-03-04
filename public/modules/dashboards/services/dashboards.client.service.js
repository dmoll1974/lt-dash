'use strict';

//Dashboards service used to communicate Dashboards REST endpoints
angular.module('dashboards').factory('Dashboards', ['$http',
	function($http) {

        var Dashboards = {
//            items : [],
//            'get' : getFn,
//            query : query,
//            fetch : fetch,
            create: create

        };

        return Dashboards;


        function create(dashboard, productName){
            return $http.post('/dashboards/' + productName, dashboard).success(function(dashboard){

            });
        }




//		return $resource('dashboards/:dashboardId', { dashboardId: '@_id'
//		}, {
//			update: {
//				method: 'PUT'
//			}
//		});
	}
]);