'use strict';

/**
 * @ngdoc function
 * @name partherApp.controller:CutlistCtrl
 * @description
 * # CutlistCtrl
 * Controller of the partherApp
 */
angular.module('partherApp')
  .controller('CutlistCtrl', ['$scope', 'cutlistView', 'cutlist', function ($scope, cutlistView, cutlist) {
    $scope.parts = [
      {width: 10, height: 20},
      {width: 30, height: 40},
      {width: 50, height: 60}
    ];

    $scope.sheet = {
      x: 2500,
      y: 1200
    };

    $scope.addPart = function (w, h) {
      if (!h || !w) {
        window.alert('Please enter length and width');
        return;
      }
      $scope.parts.push({width: w, height: h});
      $scope.width = '';
      $scope.height = '';
      $scope.updateCutlist();
    };

    $scope.removePart = function (i) {
      $scope.parts.splice(i, 1);
      $scope.updateCutlist();
    };

    $scope.updateCutlist = function () {
      var list = cutlist.generateCutList($scope.parts);
      cutlistView.updateParts(list);
    };

    $scope.updateSheet = function() {
      cutlist.setSheet($scope.sheet);
      cutlistView.updateSheet($scope.sheet);
      $scope.updateCutlist();
    };

    $scope.updateSheet();
    $scope.updateCutlist();

  }]);

