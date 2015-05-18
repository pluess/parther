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

      var sheetss = this.findAllPossibleCombinations(parts, [[new this.Sheet(0, 0, inSheet.x, inSheet.y)]]);

      var bestSheets = null;
      var bestRating = -1.0;
      angular.forEach(sheetss, function(sheets) {
        var newRating = this.rateCombination(sheets);
        if (newRating>bestRating) {
          bestRating = newRating;
          bestSheets = sheets;
        }
      });

      return bestSheets;
    };

    this.rateCombination = function(sheets) {
      if (sheets) {
        return 1.0;
      }
      return 1.0;
    };

    this.findAllPossibleCombinations = function(parts, sheetss) {
      for (var i = 0; i < parts.length; i++) {
        var nextSheetss = [];
        for (var j=0; j < sheetss.length; j++) {
          var indexes = this.findAllMatchingSheetIndexes(sheetss[j], parts[i]);
          if (indexes.length===0) {
            window.alert('no matching sheets found.');
          }
          for (var k=0; k<indexes.length; k++) {
            nextSheetss.push(this.placePart(sheetss[j], parts[i], indexes[k]));
          }
        }
        sheetss = nextSheetss;
      }

    };

    this.findAllMatchingSheetIndexes = function (sheets, part) {
      var indexes = [];
      var i = -1;
      do {
        i = this.findMatchingSheetIndex(sheets, part, i+1);
        if (i>-1) {
          indexes.push(i);
        }
        $log.debug(i);
      } while (i>-1);
      return indexes;
    };

    this.findMatchingSheetIndex = function (sheets, part, startIndex) {
      if (!startIndex) {
        startIndex = 0;
      }
      for (var i = startIndex; i < sheets.length; i++) {
        var sheet = sheets[i];
        if (sheet.x >= part.x && sheet.y >= part.y && sheet.usedBy === null) {
          return i;
        }
      }
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
