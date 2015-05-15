'use strict';

/**
 * @ngdoc service
 * @name partherApp.cutlist2
 * @description
 * # cutlist2
 * Service in the partherApp.
 */
angular.module('partherApp')
  .service('cutlist2', function () {

    function Sheet(x, y) {
      this.xorigin = 0;
      this.yorigin = 0;
      this.x = x;
      this.y = y;
      this.xkerf = 0;
      this.ykerf = 0;
      this.usedBy = null; // set to a Part
    }

    function Part(x, y) {
      this.x = x;
      this.y = y;
      this.placedIn = null; // set to Sheet
      this.rotated = false;
    }

    this.evaluateCutlis = function(inParts, inSheet, kerf) {
      var parts = [];
      angular.forEach(inParts, function(inPart) {
        parts.push(new Part(inPart.width, inPart.height));
      });

      var sheets = [];
      var x = 0;
      angular.forEach(parts, function(part) {
        var sheet = new Sheet(part.x, part.y);
        sheets.push(sheet);
        sheet.xorigin = x;
        x += part.x;
        sheet.usedBy = part;
        part.placedIn = sheet;
      });

      return sheets;
    };



  });
