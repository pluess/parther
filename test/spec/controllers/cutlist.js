'use strict';

describe('Controller: CutlistCtrl', function () {

  // load the controller's module
  beforeEach(module('partherApp'));

  var cutlistCtrl,
    scope,
    cutlistView,
    cutlist;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    cutlistView = jasmine.createSpyObj('cutlistView', ['updateView']);
    cutlist = jasmine.createSpyObj('cutlist', ['generateCutList']);
    scope = $rootScope.$new();
    cutlistCtrl = $controller('CutlistCtrl', {
      $scope: scope, cutlist:cutlist, cutlistView:cutlistView
    });
    spyOn(scope, 'updateCutlist').and.callThrough();
  }));

  it('addPart should add a part to the cutlist', function () {
    var len = scope.parts.length;
    scope.addPart(100, 200);

    expect(scope.parts.length).toBe(len+1);
    expect(scope.parts[len].length).toBe(100);
    expect(scope.parts[len].width).toBe(200);
    expect(scope.updateCutlist.calls.count()).toEqual(1);
  });

  it('removePart should remove a part from the cutlist', function () {
    var len = scope.parts.length;
    scope.removePart(2);

    expect(scope.parts.length).toBe(len-1);
    expect(scope.updateCutlist.calls.count()).toEqual(1);
  });

});
