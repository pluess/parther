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

    var sheet = {
      x: 2500,
      y: 1200
    };

    this.setSheet = function(s) {
      sheet.x = s.x;
      sheet.y = s.y;
    };

    this.getSheet = function() {
      return sheet;
    };

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
