'use strict';

/**
 * @ngdoc function
 * @name partherApp.controller:CutlistCtrl
 * @description
 * # CutlistCtrl
 * Controller of the partherApp
 */
angular.module('partherApp')
  .controller('CutlistCtrl', ['$scope', '$log', 'cutlistView', 'cutlist', function ($scope, $log, cutlistView, cutlist) {
    $scope.parts = [
      {width: 10, height: 20, name: 'Part A'},
      {width: 30, height: 40, name: 'Part B'},
      {width: 50, height: 60, name: 'Part C'}
    ];

    $scope.sheet = {
      x: 400,
      y: 300
    };

    $scope.cutlist = [];

    $scope.addPart = function (w, h, n) {
      if (!h || h<0 || w<0 || !w || !n ) {
        window.alert('Please enter valid name, length and width');
        return;
      }
      $scope.parts.push({width: w, height: h, name: n});
      $scope.width = '';
      $scope.height = '';
      $scope.name = '';

      cutlistView.drawParts($scope.parts);
      cutlistView.drawSheet($scope.sheet);
    };

    $scope.removePart = function (i) {
      $scope.parts.splice(i, 1);

      cutlistView.drawParts($scope.parts);
      cutlistView.drawSheet($scope.sheet);
    };

    $scope.updateSheet = function() {
      cutlistView.drawSheet($scope.sheet);
    };

    cutlistView.setUp();
    cutlistView.drawParts($scope.parts);
    cutlistView.drawSheet($scope.sheet);
  }]);

