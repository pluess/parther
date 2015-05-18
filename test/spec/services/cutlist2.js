/* jshint jasmine: true */
/* jshint undef: true */

'use strict';


describe('Service: cutlist2', function () {

  // load the service's module
  beforeEach(module('partherApp'));

  // instantiate service
  var cutlist2;

  beforeEach(inject(function (_cutlist2_) {
    cutlist2 = _cutlist2_;
  }));

  describe('Sheet', function () {
    it('calculates area', function () {
      var s = new cutlist2.Sheet(0, 0, 50, 50);
      expect(s.area()).toBe(2500);
    });
  });

  describe('Part', function () {
    it('calculates area', function () {
      var p = new cutlist2.Part(50, 50, 'a Name');
      expect(p.area()).toBe(2500);
    });
  });

  describe('find matching sheet', function () {

    it('with unused sheets', function () {
      var sheets = [
        new cutlist2.Sheet(0, 0, 10, 10),
        new cutlist2.Sheet(0, 0, 50, 100),
        new cutlist2.Sheet(0, 0, 200, 50),
        new cutlist2.Sheet(0, 0, 1000, 1000)
      ];

      expect(cutlist2.findMatchingSheetIndex(sheets, new cutlist2.Part(5, 5, 'a Name'))).toBe(0);
      expect(cutlist2.findMatchingSheetIndex(sheets, new cutlist2.Part(50, 100, 'a Name'))).toBe(1);
      expect(cutlist2.findMatchingSheetIndex(sheets, new cutlist2.Part(100, 100, 'a Name'))).toBe(3);
      expect(cutlist2.findMatchingSheetIndex(sheets, new cutlist2.Part(1001, 1, 'a Name'))).toBe(-1);
    });

    it('with used sheets', function () {
      var sheets = [
        new cutlist2.Sheet(0, 0, 10, 10),
        new cutlist2.Sheet(0, 0, 50, 100),
        new cutlist2.Sheet(0, 0, 200, 50),
        new cutlist2.Sheet(0, 0, 1000, 1000)
      ];
      var part = new cutlist2.Part(5, 5, 'a Name');

      sheets[0].usedBy = part;
      sheets[1].usedBy = part;
      sheets[2].usedBy = part;
      sheets[3].usedBy = part;

      expect(cutlist2.findMatchingSheetIndex(sheets, new cutlist2.Part(5, 5, 'a Name'))).toBe(-1);
      expect(cutlist2.findMatchingSheetIndex(sheets, new cutlist2.Part(50, 100, 'a Name'))).toBe(-1);
      expect(cutlist2.findMatchingSheetIndex(sheets, new cutlist2.Part(100, 100, 'a Name'))).toBe(-1);
      expect(cutlist2.findMatchingSheetIndex(sheets, new cutlist2.Part(1001, 1, 'a Name'))).toBe(-1);
    });

    it('in first sheet which is bigger or equal to part', function () {
      var partA = new cutlist2.Part(10, 20, 'Part A');
      var partB = new cutlist2.Part(30, 40, 'Part A');
      var sheets = [
        new cutlist2.Sheet(0, 0, 10, 20),
        new cutlist2.Sheet(10, 0, 390, 20),
        new cutlist2.Sheet(0, 20, 30, 40),
        new cutlist2.Sheet(20, 30, 370, 40),
        new cutlist2.Sheet(0, 60, 400, 240)
      ];
      sheets[0].usedBy = partA;
      sheets[2].usedBy = partB;

      var part = new cutlist2.Part(5, 5, 'new Part');

      var index = cutlist2.findMatchingSheetIndex(sheets, part);

      expect(index).toBe(1);
    });

  });

  describe('find all matching sheets', function () {
    it('with used sheets', function () {
      var sheets = [
        new cutlist2.Sheet(0, 0, 10, 10),
        new cutlist2.Sheet(0, 0, 50, 100),
        new cutlist2.Sheet(0, 0, 200, 50),
        new cutlist2.Sheet(0, 0, 1000, 1000)
      ];
      var part = new cutlist2.Part(5, 5, 'a Name');

      sheets[0].usedBy = part;
      sheets[2].usedBy = part;

      var indexes = cutlist2.findAllMatchingSheetIndexes(sheets, new cutlist2.Part(5, 5, 'a Name'));
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

    var findPartinSheets = function (sheets, part) {
      var foundSheet = null;
      angular.forEach(sheets, function (s) {
        if (!foundSheet && s.usedBy === part) {
          foundSheet = s;
        }
      });
      return foundSheet;
    };

    it('in identical sheet', function () {
      var sheets = [
        new cutlist2.Sheet(0, 0, 50, 100)
      ];
      var part = new cutlist2.Part(50, 100, 'a Name');
      var expectedArea = totalArea(sheets);

      var result = cutlist2.placePart(sheets, part, 0);
      expect(result.length).toBe(sheets.length);
      expect(result[0]).toBe(result[0]);

      expect(sheets[0].xorigin).toBe(result[0].xorigin);
      expect(sheets[0].yorigin).toBe(result[0].yorigin);

      expect(totalArea(result)).toBe(expectedArea);
    });

    it('smaller than sheet (x axis)', function () {

      var sheets = [
        new cutlist2.Sheet(0, 0, 100, 25),
        new cutlist2.Sheet(0, 25, 100, 50)
      ];
      var part = new cutlist2.Part(25, 25, 'a Name');
      var expectedArea = totalArea(sheets);

      var result = cutlist2.placePart(sheets, part, 0);
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
        new cutlist2.Sheet(0, 0, 25, 100),
        new cutlist2.Sheet(0, 25, 100, 50)
      ];
      var part = new cutlist2.Part(25, 25, 'a Name');
      var expectedArea = totalArea(sheets);

      var result = cutlist2.placePart(sheets, part, 0);
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
        new cutlist2.Sheet(0, 0, 100, 100),
        new cutlist2.Sheet(0, 100, 100, 50)
      ];
      var part = new cutlist2.Part(25, 25, 'a Name');
      var expectedArea = totalArea(sheets);

      var result = cutlist2.placePart(sheets, part, 0);
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

  xdescribe('evaluateCutlis', function () {
    it('places parts correctly', function () {
      var parts = [
        {width: 10, height: 20},
        {width: 30, height: 40},
        {width: 50, height: 60}
      ];

      var sheet = {
        x: 2500,
        y: 1200
      };

      var sheets = cutlist2.evaluateCutlist(parts, sheet);
      var counter = 0;
      angular.forEach(parts, function (p) {
        angular.forEach(sheets, function (s) {
          if (p.width === s.x && p.height === s.y && s.usedBy !== null) {
            counter++;
          }
        });
      });
      expect(counter).toBe(parts.length);

    });
  });

});
