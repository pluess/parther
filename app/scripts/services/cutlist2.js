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

<<<<<<< HEAD
=======
    this.Rating = function(sheets) {
      this.sheets = sheets;
      this.areaOfBiggestSheet = 0;
      this.nofEmptySheets = 0;
    };

    this.Rating.prototype.getArea = function() {
      if (this.areaOfBiggestSheet===0) {
        this.areaOfBiggestSheet = areaOfBiggestSheet(this.sheets);
      }
      return this.areaOfBiggestSheet;
    };

    this.Rating.prototype.getNofEmptySheets = function() {
      if (this.nofEmptySheets===0) {
        this.nofEmptySheets = nofEmptySheets(this.sheets);
      }
      return this.nofEmptySheets;
    };

    /**
     * @param otherRating Rating
     * @return 0< if this is lower, 0 if they are equal, 0> if this is higher than the given rating.
     */
    this.Rating.prototype.compareTo = function (otherRating) {
      if (otherRating===null) {
        return 1;
      }
      if (this.getArea()<otherRating.getArea()) {
        return -1;
      }
      else if (this.getArea()===otherRating.getArea()) {
        return this.getNofEmptySheets()-otherRating.getNofEmptySheets();
      }
      else {
        return 1;
      }
    };

>>>>>>> 2ee4d2b99af0d07e61938b91da60d3f832c9c9de
    this.evaluateCutlist = function (inParts, inSheet/*, kerf*/) {
      var parts = [];
      var that = this;
      angular.forEach(inParts, function (inPart) {
        parts.push(new that.Part(inPart.width, inPart.height, inPart.name));
      });

      var partss = permutations(parts);
      var sheetss = [];
      angular.forEach(partss, function(p) {
        var sss = that.findAllPossibleCombinationsForParts(p, [
          [new that.Sheet(0, 0, inSheet.x, inSheet.y)]
        ]);
        angular.forEach(sss, function(ss) {
          sheetss.push(ss);
        });
      });

<<<<<<< HEAD
      var bestSheets = null;
      var bestRating = -1;
      angular.forEach(sheetss, function (sheets) {
        var newRating = that.rateCombination(sheets);
        if (newRating > bestRating) {
          bestRating = newRating;
          bestSheets = sheets;
        }
      });

      return bestSheets;
=======
      var bestRating = null;
      angular.forEach(sheetss, function (sheets) {

        var newRating = new that.Rating(sheets);

        if (newRating.compareTo(bestRating)>0) {
          bestRating = newRating;
        }
      });

      return bestRating.sheets;
>>>>>>> 2ee4d2b99af0d07e61938b91da60d3f832c9c9de
    };

    this.rateCombination = function (sheets) {
      return areaOfBiggestSheet(sheets);
    };

    this.findAllPossibleCombinationsForParts = function (parts, sheetss) {
      for (var i = 0; i < parts.length; i++) {
        var nextSheetss = [];
        for (var j = 0; j < sheetss.length; j++) {
          var indexes = this.findAllMatchingSheetIndexes(sheetss[j], parts[i]);
          if (indexes.length === 0) {
            window.alert('no matching sheets found.');
          }
          for (var k = 0; k < indexes.length; k++) {
            nextSheetss.push(this.placePart(sheetss[j], parts[i], indexes[k]));
          }
        }
        sheetss = nextSheetss;
      }
      return sheetss;
    };

    this.findAllMatchingSheetIndexes = function (sheets, part) {
      var indexes = [];
      var i = -1;
      do {
        i = this.findMatchingSheetIndex(sheets, part, i + 1);
        if (i > -1) {
          indexes.push(i);
        }
        $log.debug(i);
      } while (i > -1);
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

    function areaOfBiggestSheet(sheets) {
      var biggestArea = 0;
      angular.forEach(sheets, function (s) {
<<<<<<< HEAD
        var area = s.area();
        if (area > biggestArea) {
          biggestArea = area;
=======
        if (s.usedBy===null) {
          var area = s.area();
          if (area > biggestArea) {
            biggestArea = area;
          }
>>>>>>> 2ee4d2b99af0d07e61938b91da60d3f832c9c9de
        }
      });
      return biggestArea;
    }

<<<<<<< HEAD
=======
    function nofEmptySheets(sheets) {
      var nof = 0;
      angular.forEach(sheets, function (s) {
        if (s.usedBy===null) {
          nof++;
        }
      });
      return nof;
    }

>>>>>>> 2ee4d2b99af0d07e61938b91da60d3f832c9c9de
    function permutations(list) {
      // Empty list has one permutation
      if (list.length === 0) {
        return [
          []
        ];
      }

      var result = [];

      for (var i = 0; i < list.length; i++) {
        // Clone list (kind of)
        var copy = Object.create(list);

        // Cut one element from list
        var head = copy.splice(i, 1);

        // Permute rest of list
        var rest = permutations(copy);

        // Add head to each permutation of rest of list
        for (var j = 0; j < rest.length; j++) {
          var next = head.concat(rest[j]);
          result.push(next);
        }
      }

      return result;
    }

  }]);
