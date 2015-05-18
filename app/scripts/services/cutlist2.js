'use strict';

/**
 * @ngdoc service
 * @name partherApp.cutlist2
 * @description
 * # cutlist2
 * Service in the partherApp.
 */
angular.module('partherApp')
  .service('cutlist2', ['$log', function ($log) {

    this.Sheet = function (xorigin, yorigin, x, y) {
      this.xorigin = xorigin;
      this.yorigin = yorigin;
      this.x = x;
      this.y = y;
      this.xkerf = 0;
      this.ykerf = 0;
      this.usedBy = null; // set to a Part
      this.rotated = false;
    };

    this.Sheet.prototype.area = function () {
      return this.x * this.y;
    };

    this.Part = function (x, y, name) {
      this.name = name;
      this.x = x;
      this.y = y;
    };

    this.Part.prototype.area = function () {
      return this.x * this.y;
    };

    this.evaluateCutlist = function (inParts, inSheet/*, kerf*/) {
      var parts = [];
      var that = this;
      angular.forEach(inParts, function (inPart) {
        parts.push(new that.Part(inPart.width, inPart.height, inPart.name));
      });

      var sheets = [];
      var sheet = new this.Sheet(0, 0, inSheet.x, inSheet.y);
      sheets.push(sheet);

      for (var i = 0; i < parts.length; i++) {
        var index = this.findMatchingSheetIndex(sheets, parts[i]);
        if (index < 0) {
          break;
        }
        sheets = this.placePart(sheets, parts[i], index);
      }

      return sheets;
    };

    this.findMatchingSheetIndex = function (sheets, part) {
      $log.debug('findMatchingSheetIndex: sheets=');
      $log.debug(sheets);
      $log.debug('findMatchingSheetIndex: part=');
      $log.debug(part);

      for (var i = 0; i < sheets.length; i++) {
        var sheet = sheets[i];
        if (sheet.x >= part.x && sheet.y >= part.y && sheet.usedBy === null) {
          $log.debug('findMatchingSheetIndex:'+i);
          return i;
        }
      }

      $log.debug('findMatchingSheetIndex: -1');
      return -1;
    };

    this.placePart = function (inSheets, part, index) {
      var s = inSheets[index];

      // part and sheet are identical
      if (s.x === part.x && s.y === part.y) {
        s.usedBy = part;
        return inSheets;
      }

      var newSheets = [];
      angular.forEach(inSheets, function (sheet, i) {
        if (i !== index) {
          newSheets.push(sheet);
        }
      });

      // new sheet with part size
      var partSheet = new this.Sheet(s.xorigin, s.yorigin, part.x, part.y);
      partSheet.usedBy = part;
      newSheets.push(partSheet);

      // new left over x necessary
      if (s.x > part.x) {
        newSheets.push(new this.Sheet(s.xorigin + part.x, s.yorigin, s.x - part.x, part.y));
      }

      // new left over y necessary
      if (s.y > part.y) {
        newSheets.push(new this.Sheet(s.xorigin, s.yorigin + part.y, s.x, s.y - part.y));
      }

      return newSheets;

    };

  }]);
