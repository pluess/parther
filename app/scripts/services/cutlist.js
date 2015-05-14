'use strict';

/**
 * @ngdoc service
 * @name partherApp.cutlist
 * @description
 * # cutlist
 * Service in the partherApp.
 */
angular.module('partherApp')
  .service('cutlist', function () {

    this.generateCutList = function(parts) {
      var x = 0;
      var cutlist = [];
      angular.forEach(parts, function(part) {
        var item = part;
        item.x = x;
        item.y = 0;
        x += part.width;
        cutlist.push(item);
      });
      return cutlist;
    };

  });
