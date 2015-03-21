'use strict';

angular.module('graphs').factory('Tags', [
	function() {

        var Tags = {
            setTags: setTags//,
            //createHighstockSeries: createHighstockSeries

        };

        return Tags;

        function setTags (metrics){

            var tags = [];

            _.each(metrics, function(metric){

                _.each(metric.tags, function(tag){

                    if(_.indexOf(tags, tag.text) === -1) tags.push(tag.text);

                })

            })

            return tags;
        }
	}
]);
