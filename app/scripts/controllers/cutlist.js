'use strict';

/**
 * @ngdoc function
 * @name partherApp.controller:CutlistCtrl
 * @description
 * # CutlistCtrl
 * Controller of the partherApp
 */
angular.module('partherApp')
  .controller('CutlistCtrl', ['$scope', 'cutlistView', function ($scope, cutlistView) {
    $scope.parts = [
      {length: 10, width: 20},
      {length: 30, width: 40},
      {length: 50, width: 60}
    ];

    $scope.addPart = function (l, w) {
      if (!l || !w) {
        window.alert('Please enter length and width');
        return;
      }
      $scope.parts.push({length: l, width: w});
      $scope.length = '';
      $scope.width = '';
      $scope.generateCutList();
    };

    $scope.removePart = function (i) {
      $scope.parts.splice(i, 1);
      $scope.generateCutList();
    };

    $scope.generateCutList = function() {
      var x = 0;
      $scope.cutlist = [];
      angular.forEach($scope.parts, function(part) {
        var item = part;
        item.x = x;
        item.y = 0;
        x += part.width;
        $scope.cutlist.push(item);
      });
      cutlistView.updateView($scope.cutlist);
    };

    $scope.generateCutList();

  }]);

