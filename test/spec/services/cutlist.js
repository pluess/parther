/* jshint jasmine: true */
/* jshint undef: true */

'use strict';


describe('Service: cutlist', function () {

  // load the service's module
  beforeEach(module('partherApp'));

  // instantiate service
  var cutlist;

  beforeEach(inject(function (_cutlist_) {
    cutlist = _cutlist_;
  }));

  var findPartinSheets = function (sheets, part) {
    var foundSheet = null;
    angular.forEach(sheets, function (s) {
      if (!foundSheet && s.usedBy === part) {
        foundSheet = s;
      }
    });
    return foundSheet;
  };

  describe('Sheet', function () {
    it('calculates area', function () {
      var s = new cutlist.Sheet(0, 0, 50, 50);
      expect(s.area()).toBe(2500);
    });
  });

  describe('Part', function () {
    it('calculates area', function () {
      var p = new cutlist.Part(50, 50, 'a Name');
      expect(p.area()).toBe(2500);
    });
  });

  describe('Rating', function() {
    it('considers null Ratings as lower than this', function() {
      var sheets1 = [
        new cutlist.Sheet(0, 0, 10, 10),
        new cutlist.Sheet(0, 0, 50, 100),
        new cutlist.Sheet(0, 0, 200, 50),
        new cutlist.Sheet(0, 0, 1000, 1000)
      ];
      var rating1 = new cutlist.Rating(sheets1);

      expect(rating1.compareTo(null)).toBeGreaterThan(0);
    });

    it('getArea finds difference', function() {
      var sheets1 = [
        new cutlist.Sheet(0, 0, 10, 10),
        new cutlist.Sheet(0, 0, 50, 100),
        new cutlist.Sheet(0, 0, 200, 50),
        new cutlist.Sheet(0, 0, 1000, 1000)
      ];
      sheets1[3].usedBy = 'used'; // dummy
      var rating1 = new cutlist.Rating(sheets1);
      var sheets2 = [
        new cutlist.Sheet(0, 0, 10, 10),
        new cutlist.Sheet(0, 0, 50, 100),
        new cutlist.Sheet(0, 0, 200, 50),
        new cutlist.Sheet(0, 0, 1000, 1000)
      ];
      sheets2[2].usedBy = 'used'; // dummy
      var rating2 = new cutlist.Rating(sheets2);

      expect(rating1.compareTo(rating2)).toBeLessThan(0);
    });

    it('getNofEmptySheets finds difference', function() {
      var sheets1 = [
        new cutlist.Sheet(0, 0, 10, 10),
        new cutlist.Sheet(0, 0, 50, 100),
        new cutlist.Sheet(0, 0, 200, 50),
        new cutlist.Sheet(0, 0, 1000, 1000)
      ];
      sheets1[0].usedBy = 'used'; // dummy
      sheets1[1].usedBy = 'used'; // dummy
      var rating1 = new cutlist.Rating(sheets1);
      var sheets2 = [
        new cutlist.Sheet(0, 0, 10, 10),
        new cutlist.Sheet(0, 0, 50, 100),
        new cutlist.Sheet(0, 0, 200, 50),
        new cutlist.Sheet(0, 0, 1000, 1000)
      ];
      sheets2[0].usedBy = 'used'; // dummy
      var rating2 = new cutlist.Rating(sheets2);

      expect(rating1.compareTo(rating2)).toBeLessThan(0);
    });

    it('getNofEmptySheets finds equal ratings', function() {
      var sheets1 = [
        new cutlist.Sheet(0, 0, 10, 10),
        new cutlist.Sheet(0, 0, 50, 100),
        new cutlist.Sheet(0, 0, 200, 50),
        new cutlist.Sheet(0, 0, 1000, 1000)
      ];
      sheets1[0].usedBy = 'used'; // dummy
      var rating1 = new cutlist.Rating(sheets1);
      var sheets2 = [
        new cutlist.Sheet(0, 0, 10, 10),
        new cutlist.Sheet(0, 0, 50, 100),
        new cutlist.Sheet(0, 0, 200, 50),
        new cutlist.Sheet(0, 0, 1000, 1000)
      ];
      sheets2[0].usedBy = 'used'; // dummy
      var rating2 = new cutlist.Rating(sheets2);

      expect(rating1.compareTo(rating2)).toBe(0);
    });
  });

  describe('find matching sheet', function () {

    it('with unused sheets', function () {
      var sheets = [
        new cutlist.Sheet(0, 0, 10, 10),
        new cutlist.Sheet(0, 0, 50, 100),
        new cutlist.Sheet(0, 0, 200, 50),
        new cutlist.Sheet(0, 0, 1000, 1000)
      ];

      expect(cutlist.findMatchingSheetIndex(sheets, new cutlist.Part(5, 5, 'a Name'))).toBe(0);
      expect(cutlist.findMatchingSheetIndex(sheets, new cutlist.Part(50, 100, 'a Name'))).toBe(1);
      expect(cutlist.findMatchingSheetIndex(sheets, new cutlist.Part(100, 100, 'a Name'))).toBe(3);
      expect(cutlist.findMatchingSheetIndex(sheets, new cutlist.Part(1001, 1, 'a Name'))).toBe(-1);
    });

    it('with used sheets', function () {
      var sheets = [
        new cutlist.Sheet(0, 0, 10, 10),
        new cutlist.Sheet(0, 0, 50, 100),
        new cutlist.Sheet(0, 0, 200, 50),
        new cutlist.Sheet(0, 0, 1000, 1000)
      ];
      var part = new cutlist.Part(5, 5, 'a Name');

      sheets[0].usedBy = part;
      sheets[1].usedBy = part;
      sheets[2].usedBy = part;
      sheets[3].usedBy = part;

      expect(cutlist.findMatchingSheetIndex(sheets, new cutlist.Part(5, 5, 'a Name'))).toBe(-1);
      expect(cutlist.findMatchingSheetIndex(sheets, new cutlist.Part(50, 100, 'a Name'))).toBe(-1);
      expect(cutlist.findMatchingSheetIndex(sheets, new cutlist.Part(100, 100, 'a Name'))).toBe(-1);
      expect(cutlist.findMatchingSheetIndex(sheets, new cutlist.Part(1001, 1, 'a Name'))).toBe(-1);
    });

    it('in first sheet which is bigger or equal to part', function () {
      var partA = new cutlist.Part(10, 20, 'Part A');
      var partB = new cutlist.Part(30, 40, 'Part A');
      var sheets = [
        new cutlist.Sheet(0, 0, 10, 20),
        new cutlist.Sheet(10, 0, 390, 20),
        new cutlist.Sheet(0, 20, 30, 40),
        new cutlist.Sheet(20, 30, 370, 40),
        new cutlist.Sheet(0, 60, 400, 240)
      ];
      sheets[0].usedBy = partA;
      sheets[2].usedBy = partB;

      var part = new cutlist.Part(5, 5, 'new Part');

      var index = cutlist.findMatchingSheetIndex(sheets, part);

      expect(index).toBe(1);
    });

  });

  describe('find all matching sheets', function () {
    it('with used sheets', function () {
      var sheets = [
        new cutlist.Sheet(0, 0, 10, 10),
        new cutlist.Sheet(0, 0, 50, 100),
        new cutlist.Sheet(0, 0, 200, 50),
        new cutlist.Sheet(0, 0, 1000, 1000)
      ];
      var part = new cutlist.Part(5, 5, 'a Name');

      sheets[0].usedBy = part;
      sheets[2].usedBy = part;

      var indexes = cutlist.findAllMatchingSheetIndexes(sheets, new cutlist.Part(5, 5, 'a Name'));
      expect(indexes.length).toBe(2);
      expect(indexes).toEqual([1, 3]);

    });
  });

  describe('place part', function () {

    var totalArea = function (sheets) {
      var area = 0;
      angular.forEach(sheets, function (s) {
        area += s.area();
      });
      return area;
    };

    it('in identical sheet', function () {
      var sheets = [
        new cutlist.Sheet(0, 0, 50, 100)
      ];
      var part = new cutlist.Part(50, 100, 'a Name');
      var expectedArea = totalArea(sheets);

      var result = cutlist.placePart(sheets, part, 0);
      expect(result.length).toBe(sheets.length);
      expect(result[0]).toBe(result[0]);

      expect(sheets[0].xorigin).toBe(result[0].xorigin);
      expect(sheets[0].yorigin).toBe(result[0].yorigin);

      expect(totalArea(result)).toBe(expectedArea);
    });

    it('smaller than sheet (x axis)', function () {

      var sheets = [
        new cutlist.Sheet(0, 0, 100, 25),
        new cutlist.Sheet(0, 25, 100, 50)
      ];
      var part = new cutlist.Part(25, 25, 'a Name');
      var expectedArea = totalArea(sheets);

      var result = cutlist.placePart(sheets, part, 0);
      var placedSheet = findPartinSheets(result, part);

      expect(result.length).toBe(sheets.length + 1);
      expect(placedSheet).not.toBeNull();
      expect(placedSheet.x).toBe(part.x);
      expect(placedSheet.y).toBe(part.y);
      expect(placedSheet.xorigin).toBe(0);
      expect(placedSheet.yorigin).toBe(0);
      expect(result[2].xorigin).toBe(25);
      expect(result[2].yorigin).toBe(0);

      expect(totalArea(result)).toBe(expectedArea);

    });

    it('smaller than sheet (y axis)', function () {

      var sheets = [
        new cutlist.Sheet(0, 0, 25, 100),
        new cutlist.Sheet(0, 25, 100, 50)
      ];
      var part = new cutlist.Part(25, 25, 'a Name');
      var expectedArea = totalArea(sheets);

      var result = cutlist.placePart(sheets, part, 0);
      var placedSheet = findPartinSheets(result, part);

      expect(result.length).toBe(sheets.length + 1);
      expect(placedSheet).not.toBeNull();
      expect(placedSheet.x).toBe(part.x);
      expect(placedSheet.y).toBe(part.y);
      expect(placedSheet.xorigin).toBe(0);
      expect(placedSheet.yorigin).toBe(0);
      expect(result[2].xorigin).toBe(0);
      expect(result[2].yorigin).toBe(25);

      expect(totalArea(result)).toBe(expectedArea);

    });

    it('smaller than sheet (both axis)', function () {

      var sheets = [
        new cutlist.Sheet(0, 0, 100, 100),
        new cutlist.Sheet(0, 100, 100, 50)
      ];
      var part = new cutlist.Part(25, 25, 'a Name');
      var expectedArea = totalArea(sheets);

      var result = cutlist.placePart(sheets, part, 0);
      var placedSheet = findPartinSheets(result, part);

      expect(result.length).toBe(sheets.length + 2);
      expect(placedSheet).not.toBeNull();
      expect(placedSheet.x).toBe(part.x);
      expect(placedSheet.y).toBe(part.y);
      expect(placedSheet.xorigin).toBe(0);
      expect(placedSheet.yorigin).toBe(0);
      expect(result[2].xorigin).toBe(25);
      expect(result[2].yorigin).toBe(0);
      expect(result[3].xorigin).toBe(0);
      expect(result[3].yorigin).toBe(25);

      expect(totalArea(result)).toBe(expectedArea);

    });

  });

  describe('findAllPossibleCombinations', function() {
    it('with 1 5x5 parts', function() {
      var sheetss = [[new cutlist.Sheet(0, 0, 100, 100)]];
      var parts = [
        new cutlist.Part(5, 5, 'A')
      ];
      var resultss = cutlist.findAllPossibleCombinationsForParts(parts, sheetss);
      expect(resultss.length).toBe(1);
      expect(resultss[0].length).toBe(3);

      expect(findPartinSheets(resultss[0], parts[0])).not.toBeNull();
    });

    it('with 2 5x5 parts', function() {
      var sheetss = [[new cutlist.Sheet(0, 0, 100, 100)]];
      var parts = [
        new cutlist.Part(5, 5, 'A'),
        new cutlist.Part(5, 5, 'B')
      ];
      var resultss = cutlist.findAllPossibleCombinationsForParts(parts, sheetss);
      expect(resultss.length).toBe(2);

      angular.forEach(resultss, function(results) {
        expect(findPartinSheets(results, parts[0])).not.toBeNull();
        expect(findPartinSheets(results, parts[1])).not.toBeNull();
      });
    });

    it('with 3 5x5 parts', function() {
      var sheetss = [[new cutlist.Sheet(0, 0, 100, 100)]];
      var parts = [
        new cutlist.Part(5, 5, 'A'),
        new cutlist.Part(5, 5, 'B'),
        new cutlist.Part(5, 5, 'C')
      ];
      var resultss = cutlist.findAllPossibleCombinationsForParts(parts, sheetss);
      expect(resultss.length).toBe(5);

      angular.forEach(resultss, function(results) {
        expect(findPartinSheets(results, parts[0])).not.toBeNull();
        expect(findPartinSheets(results, parts[1])).not.toBeNull();
        expect(findPartinSheets(results, parts[2])).not.toBeNull();
      });
    });
  });

  describe('evaluateCutlis', function () {
    it('places parts correctly', function () {
      var parts = [
        {width: 5, height: 5},
        {width: 5, height: 5},
        {width: 5, height: 5}
      ];

      var sheet = {
        x: 100,
        y: 100
      };

      var sheets = cutlist.evaluateCutlist(parts, sheet);

      expect(sheets.length).toBe(5);
    });
  });

});
