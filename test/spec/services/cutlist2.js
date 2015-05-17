/* jshint jasmine: true */
/* jshint undef: true */

'use strict';


describe('Service: cutlist2', function () {

  // load the service's module
  beforeEach(module('partherApp'));

  // instantiate service
  var cutlist2,
    parts,
    sheet;

  beforeEach(inject(function (_cutlist2_) {
    cutlist2 = _cutlist2_;
  }));

  xit('aligns parts horiotontally', function () {
    parts = [
      {width: 10, height: 20},
      {width: 30, height: 40},
      {width: 50, height: 60}
    ];
    sheet = {
      x: 500,
      y: 500
    };

    var sheets = cutlist2.evaluateCutlis(parts, sheet, 2);
    expect(sheets).toEqual(jasmine.any(Array));
    expect(sheets.length).toBe(3);
    expect(sheets[2].xorigin).toBe(40);
    expect(sheets[2].usedBy.x).toBe(parts[2].width);
    expect(sheets[2].usedBy.y).toBe(parts[2].height);
  });

  describe('Sheet', function () {
    it('calculates area', function () {
      var s = new cutlist2.Sheet(0, 0, 50, 50);
      expect(s.area()).toBe(2500);
    });
  });

  describe('Part', function () {
    it('calculates area', function () {
      var p = new cutlist2.Part(50, 50);
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

      expect(cutlist2.findMatchingSheetIndex(sheets, new cutlist2.Part(5, 5))).toBe(0);
      expect(cutlist2.findMatchingSheetIndex(sheets, new cutlist2.Part(50, 100))).toBe(1);
      expect(cutlist2.findMatchingSheetIndex(sheets, new cutlist2.Part(100, 100))).toBe(3);
      expect(cutlist2.findMatchingSheetIndex(sheets, new cutlist2.Part(1001, 1))).toBe(-1);
    });

    it('with used sheets', function () {
      var sheets = [
        new cutlist2.Sheet(0, 0, 10, 10),
        new cutlist2.Sheet(0, 0, 50, 100),
        new cutlist2.Sheet(0, 0, 200, 50),
        new cutlist2.Sheet(0, 0, 1000, 1000)
      ];
      var part = new cutlist2.Part(5, 5);

      sheets[0].usedBy = part;
      sheets[1].usedBy = part;
      sheets[2].usedBy = part;
      sheets[3].usedBy = part;

      expect(cutlist2.findMatchingSheetIndex(sheets, new cutlist2.Part(5, 5))).toBe(-1);
      expect(cutlist2.findMatchingSheetIndex(sheets, new cutlist2.Part(50, 100))).toBe(-1);
      expect(cutlist2.findMatchingSheetIndex(sheets, new cutlist2.Part(100, 100))).toBe(-1);
      expect(cutlist2.findMatchingSheetIndex(sheets, new cutlist2.Part(1001, 1))).toBe(-1);
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
        new cutlist2.Sheet(0, 0, 50, 100)
      ];
      var part = new cutlist2.Part(50, 100);
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
      var part = new cutlist2.Part(25, 25);
      var expectedArea = totalArea(sheets);

      expect(part.placedIn).toBeNull();
      var result = cutlist2.placePart(sheets, part, 0);
      expect(result.length).toBe(sheets.length + 1);
      expect(part.placedIn).not.toBeNull();
      expect(part.placedIn.x).toBe(part.x);
      expect(part.placedIn.y).toBe(part.y);
      expect(part.placedIn.xorigin).toBe(0);
      expect(part.placedIn.yorigin).toBe(0);
      expect(result[2].xorigin).toBe(25);
      expect(result[2].yorigin).toBe(0);

      expect(totalArea(result)).toBe(expectedArea);

    });

    it('smaller than sheet (x axis)', function () {

      var sheets = [
        new cutlist2.Sheet(0, 0, 25, 100),
        new cutlist2.Sheet(0, 25, 100, 50)
      ];
      var part = new cutlist2.Part(25, 25);
      var expectedArea = totalArea(sheets);

      expect(part.placedIn).toBeNull();
      var result = cutlist2.placePart(sheets, part, 0);
      expect(result.length).toBe(sheets.length + 1);
      expect(part.placedIn).not.toBeNull();
      expect(part.placedIn.x).toBe(part.x);
      expect(part.placedIn.y).toBe(part.y);
      expect(part.placedIn.xorigin).toBe(0);
      expect(part.placedIn.yorigin).toBe(0);
      expect(result[2].xorigin).toBe(0);
      expect(result[2].yorigin).toBe(25);

      expect(totalArea(result)).toBe(expectedArea);

    });

    it('smaller than sheet (both axis)', function () {

      var sheets = [
        new cutlist2.Sheet(0, 0, 100, 100),
        new cutlist2.Sheet(0, 100, 100, 50)
      ];
      var part = new cutlist2.Part(25, 25);
      var expectedArea = totalArea(sheets);

      expect(part.placedIn).toBeNull();
      var result = cutlist2.placePart(sheets, part, 0);
      expect(result.length).toBe(sheets.length + 2);
      expect(part.placedIn).not.toBeNull();
      expect(part.placedIn.x).toBe(part.x);
      expect(part.placedIn.y).toBe(part.y);
      expect(part.placedIn.xorigin).toBe(0);
      expect(part.placedIn.yorigin).toBe(0);
      expect(result[2].xorigin).toBe(25);
      expect(result[2].yorigin).toBe(0);
      expect(result[3].xorigin).toBe(0);
      expect(result[3].yorigin).toBe(25);

      expect(totalArea(result)).toBe(expectedArea);

    });

  });

  describe('evaluateCutlis', function () {
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
