/* jshint jasmine: true */

'use strict';

describe('Controller: CutlistCtrl', function () {

  // load the controller's module
  beforeEach(module('partherApp'));

  var cutlistCtrl,
    scope,
    log,
    cutlistView,
    cutlist;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$log_) {
    cutlistView = jasmine.createSpyObj('cutlistView', ['setParts', 'setUp', 'drawSheet']);
    cutlist = jasmine.createSpyObj('cutlist', ['evaluateCutlist']);
    scope = $rootScope.$new();
    log = _$log_;
    cutlistCtrl = $controller('CutlistCtrl', {
      $scope: scope, $log:log, cutlist:cutlist, cutlistView:cutlistView
    });
  }));

  it('addPart should add a part to the cutlist', function () {
    var len = scope.parts.length;
    scope.addPart(100, 200, 'some name');

    expect(scope.parts.length).toBe(len+1);
    expect(scope.parts[len].width).toBe(100);
    expect(scope.parts[len].height).toBe(200);
  });

  it('removePart should remove a part from the cutlist', function () {
    var len = scope.parts.length;
    scope.removePart(2);

    expect(scope.parts.length).toBe(len-1);
   });

});
