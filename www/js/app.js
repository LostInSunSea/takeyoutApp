// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova' ,'ngCordovaOauth','starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  //setup the login page
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
    .state('tab.connect', {
      url: "/connect",
      views: {
        'connect-tab': {
          templateUrl: "templates/connect.html",
          controller: 'ConnectTabCtrl'
        }
      }
    })
    .state('setup', {
      url: "/setup",
      templateUrl: "templates/setup.html",
      controller: 'SetupTabCtrl'
    })
    .state('tab.user_profile', {
      url: "/user_profile",
      views: {
        'connect-tab': {
          templateUrl: "templates/user_profile.html",
          controller: 'MatchCtrl'
        }
      }
    })
    .state('tab.calendar', {
      url: "/calendar",
      views: {
        'calendar-tab': {
          templateUrl: "templates/calendar.html",
          controller: 'CalendarTabCtrl'
        }
      }
    })
	.state('tab.review', {
      url: "/review",
      views: {
        'calendar-tab': {
          templateUrl: "templates/review.html",
          controller: "ReviewUserCtrl"
        }
      }
    })
    .state('tab.messages', {
      url: "/messages",
      views: {
        'messages-tab': {
          templateUrl: "templates/messages.html",
          controller: "MessagesTabCtrl"
        }
      }
    })
    .state('tab.me', {
      url: "/me",
      views: {
        'me-tab': {
          templateUrl: "templates/me.html",
          controller: "MeTabCtrl"
        }
      }
    })
    .state('tab.connect2', {
      url: "/connect2",
      views: {
        'connect-tab': {
          templateUrl: "templates/connect2.html",
          controller: "NewTripTabCtrl"
        }
      }
    })
	.state('tab.add_meeting', {
      url: "/add_meeting",
      views: {
        'calendar-tab': {
          templateUrl: "templates/add_meeting.html",
          controller: "MakeMeetingCtrl"
        }
      }
    })
	.state('tab.friend_list', {
      url: "/friend_list",
      views: {
        'calendar-tab': {
          templateUrl: "templates/friend_list.html",
          controller: ""
        }
      }
    })
	.state('tab.trips', {
      url: "/trips",
      views: {
        'calendar-tab': {
          templateUrl: "templates/trips.html",
          controller: ""
        }
      }
    })
	.state('tab.requests', {
      url: "/requests",
      views: {
        'calendar-tab': {
          templateUrl: "templates/requests.html",
          controller: "RequestCtrl"
        }
      }
    })
	.state('tab.connect_empty', {
      url: "/connect_empty",
      views: {
        'connect-tab': {
          templateUrl: "templates/connect_empty.html",
          controller: ""
        }
      }
    })
	.state('tab.edit_profile', {
      url: "/edit_profile",
      views: {
        'me-tab': {
          templateUrl: "templates/edit_profile.html",
          controller: "EditProfileCtrl"
        }
      }
    })
	.state('tab.chat', {
      url: "/chat",
      views: {
        'messages-tab': {
          templateUrl: "templates/chat.html",
          controller: "ChatCtrl"
        }
      }
    })
      .state('tab.conversations', {
        url: "/conversations",
        views: {
          'messages-tab': {
            templateUrl: "templates/conversations.html",
            controller: "ConversationsCtrl"
          }
        }
      })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
