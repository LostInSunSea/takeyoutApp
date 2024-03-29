// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
    .config(function($stateProvider, $urlRouterProvider) {

      $stateProvider
          .state('tabs', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
          })
          .state('tabs.connect', {
            url: "/connect",
            views: {
              'connect-tab': {
                templateUrl: "templates/connect.html",
                controller: 'ConnectTabCtrl'
              }
            }
          })
          .state('tabs.connect3', {
            url: "/setup",
            views: {
              'connect-tab': {
                templateUrl: "templates/setup.html",
                controller: 'SetupTabCtrl'
              }
            }
          })
          .state('tabs.calendar', {
            url: "/calendar",
            views: {
              'calendar-tab': {
                templateUrl: "templates/calendar.html",
                controller: 'CalendarTabCtrl'
              }
            }
          })
          .state('tabs.messages', {
            url: "/messages",
            views: {
              'messages-tab': {
                templateUrl: "templates/messages.html",
                controller: "MessagesTabCtrl"
              }
            }
          })
          .state('tabs.me', {
            url: "/me",
            views: {
              'me-tab': {
                templateUrl: "templates/me.html",
                controller: "MeTabCtrl"
              }
            }
          })
          .state('tabs.connect2', {
            url: "/connect2",
            views: {
              'connect-tab': {
                templateUrl: "templates/connect2.html",
                controller: "NewTripTabCtrl"
              }
            }
          })
          .state('login', {
            url: "/",
            views: {
              'login': {
                templateUrl: "templates/login.html"
              }
            }
          })
      $urlRouterProvider.otherwise("/login");
    })