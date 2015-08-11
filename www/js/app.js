// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });

    app.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/connect')
        $stateProvider.state('connect', {
            url: '/connect',
            views: {
                connect: {
                    templateUrl: 'views/connectTemplate.html'//,
                    controller:'ConnectController'
                }
            }
        })
        $stateProvider.state('calendar', {
            url: '/calendar',
            views: {
                calendar: {
                    templateUrl: 'views/calendarTemplate.html'//,
                    controller:'CalendarController'
                }
            }
        })
        $stateProvider.state('message', {
            url: '/message',
            views: {
                message: {
                    templateUrl: 'views/messageTemplate.html'//,
                    controller:'MessageController'
                }
            }
        })
        $stateProvider.state('profile', {
            url: '/profile',
            views: {
                profile: {
                    templateUrl: 'views/profileTemplate.html'//,
                    controller:'ProfileController'
                }
            }
        })
    });

    app.controller('CalendarController',['$scope', function($scope) {
        $scope.greeting = 'Hola!';
    }]);
    app.controller('ProfileController',['$scope', function($scope) {
        $scope.greeting = 'Hola!';
    }]);
    app.controller('MessageController',['$scope', function($scope) {
        $scope.greeting = 'Hola!';
    }]);
    app.controller('ConnectController',['$scope', function($scope) {
        $scope.greeting = 'Hola!';
    }]);

