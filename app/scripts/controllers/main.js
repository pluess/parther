'use strict';

/**
 * @ngdoc function
 * @name partherApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the partherApp
 */
angular.module('partherApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
