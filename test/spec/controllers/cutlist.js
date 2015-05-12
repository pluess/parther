'use strict';

describe('Controller: CutlistCtrl', function () {

  // load the controller's module
  beforeEach(module('partherApp'));

  var cutlistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    cutlistCtrl = $controller('CutlistCtrl', {
      $scope: scope
    });
  }));

  it('addPart should add a part to the cutlist', function () {
    var len = scope.parts.length;
    scope.addPart(100, 200);

    expect(scope.parts.length).toBe(len+1);
    expect(scope.parts[len].length).toBe(100);
    expect(scope.parts[len].width).toBe(200);
  });

  it('removePart should remove a part from the cutlist', function () {
    var len = scope.parts.length;
    scope.removePart(2);

    expect(scope.parts.length).toBe(len-1);
  });

  it('generateCutList should align parts along the x axis', function() {
    var x = 0;
    angular.forEach(scope.cutlist, function(item) {
      expect(x).toBe(item.x);
      x += item.width;
    });
  });
});
