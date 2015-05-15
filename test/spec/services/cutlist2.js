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
    parts = [
      {width: 10, height: 20},
      {width: 30, height: 40},
      {width: 50, height: 60}
    ];
    sheet = {
      x: 500,
      y: 500
    };

  }));

  it('aligns parts horiotontally', function () {
    var sheets = cutlist2.evaluateCutlis(parts, sheet, 2);
    expect(sheets).toEqual(jasmine.any(Array));
    expect(sheets.length).toBe(3);
    expect(sheets[2].xorigin).toBe(40);
    expect(sheets[2].usedBy.x).toBe(parts[2].width);
    expect(sheets[2].usedBy.y).toBe(parts[2].height);
  });

});
