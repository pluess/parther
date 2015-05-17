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
      {width: 10, height: 20},
      {width: 30, height: 40},
      {width: 50, height: 60}
    ];

    $scope.sheet = {
      x: 400,
      y: 300
    };

    $log.debug('init (debug)');
    $log.info('init (info) ');

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
      var list = cutlist2.evaluateCutlist($scope.parts, $scope.sheet);
      cutlistView.updateParts(list);
    };

    $scope.updateSheet = function() {
      cutlistView.updateSheet($scope.sheet);
      $scope.updateCutlist();
    };

    $scope.updateSheet();
    $scope.updateCutlist();

  }]);

