'use strict';

angular.module('graphs').factory('Tags', [
	function() {

        var Tags = {
            setTags: setTags//,
            //createHighstockSeries: createHighstockSeries

        };

        return Tags;

        function setTags (metrics, productName, dashBoardName, testRunId){

            var tags = [];

            tags.push({text: 'All', route: {productName: productName, dashboardName: dashBoardName, tag: 'All'}});

            _.each(metrics, function(metric){

                _.each(metric.tags, function(tag){

                    if(tagExists(tags, tag)) tags.push({text: tag.text, route: {productName: productName, dashboardName: dashBoardName, tag: tag.text, testRunId: testRunId}});

                })

            })

            return tags;
        }

        function tagExists(existingTags, newTag){

            var isNew = true;

            _.each(existingTags, function(existingTag){

                if(existingTag.text === newTag.text) isNew = false;
            })

            return isNew;
        }
	}
]);
