'use strict';

/**
 * @ngdoc function
 * @name partherApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the partherApp
 */
angular.module('partherApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
