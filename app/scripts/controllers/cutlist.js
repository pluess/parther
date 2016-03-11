'use strict';

/**
 * @ngdoc function
 * @name partherApp.controller:CutlistCtrl
 * @description
 * # CutlistCtrl
 * Controller of the partherApp
 */
angular.module('partherApp')
  .controller('CutlistCtrl', ['$scope', '$log', 'cutlistView', 'cutlist2', function ($scope, $log, cutlistView, cutlist2) {
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
      if (!h || !w) {
        window.alert('Please enter length and width');
        return;
      }
      $scope.parts.push({width: w, height: h, name: n});
      $scope.width = '';
      $scope.height = '';
      $scope.name = '';
    };

    $scope.removePart = function (i) {
      $scope.parts.splice(i, 1);
    };

    $scope.updateCutlist = function () {
      $scope.cutlist = cutlist2.evaluateCutlist($scope.parts, $scope.sheet);
      cutlistView.updateParts($scope.cutlist);
    };

    $scope.updateSheet = function() {
      cutlistView.updateSheet($scope.sheet);
      $scope.updateCutlist();
    };

    $log.debug('init (debug)');

    $scope.updateSheet();
    $scope.updateCutlist();

  }]);

