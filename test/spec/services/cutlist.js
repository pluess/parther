'use strict';

describe('Service: cutlist', function () {

  // load the service's module
  beforeEach(module('partherApp'));

  // instantiate service
  var cutlist;
  beforeEach(inject(function (_cutlist_) {
    cutlist = _cutlist_;
  }));

  it('should do something', function () {
    expect(!!cutlist).toBe(true);
  });

  it('generateCutList should align parts along the x axis', function() {
    var parts = [
      {width: 10, height: 20},
      {width: 30, height: 40},
      {width: 50, height: 60}
    ];
    var list = cutlist.generateCutList(parts);
    expect(list[2].x).toBe(40);
  });

});
