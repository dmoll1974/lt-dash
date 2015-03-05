'use strict';

// Dashboards tab controller
angular.module('dashboards').controller('DashboardsTabController', function(){
    this.tab = 1;

    this.setTab = function(newValue){
        this.tab = newValue;
    };

    this.isSet = function(tabName){
        return this.tab === tabName;
    };
});
