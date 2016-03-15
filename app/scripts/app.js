'use strict';

/**
 * @ngdoc overview
 * @name partherApp
 * @description
 * # partherApp
 *
 * Main module of the application.
 */
angular
  .module('partherApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/cutlist', {
        templateUrl: 'views/cutlist.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
