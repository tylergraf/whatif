var app = angular.module('whatif', ['angular-meteor','ui.router','RouteControllers','Components','ui.bootstrap']);

app.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'client/views/home.ng.html',
        controller: 'HomeController',
        params: {currentGame: false},
        resolve: {
          games: ["$meteor", function($meteor){
            return $meteor.subscribe('games');
          }]
        }
      })
      .state('createGame', {
        url: '/create',
        templateUrl: 'client/views/createGame.ng.html',
        controller: 'CreateGameController',
        resolve: {
          currentUser: ["$meteor",'$rootScope', function($meteor,$rootScope){
            return $meteor.requireUser();
          }]
        }
      })
      .state('joinGame', {
        url: '/join',
        templateUrl: 'client/views/joinGame.ng.html',
        controller: 'JoinGameController',
        resolve: {
          currentUser: ["$meteor",'$rootScope', function($meteor,$rootScope){
            return $meteor.requireUser();
          }],
          games: ["$meteor", function($meteor){
            return $meteor.subscribe('games');
          }],
          users: ["$meteor", function($meteor){
            return $meteor.subscribe('users');
          }]
        }
      })
      .state('game', {
        url: '/game',
        templateUrl: 'client/views/game.ng.html',
        controller: 'GameController',
        resolve: {
          currentUser: ["$meteor",'$rootScope', function($meteor,$rootScope){
            return $meteor.requireUser();
          }],
          games: ["$meteor", function($meteor){
            return $meteor.subscribe('games');
          }],
          users: ["$meteor", function($meteor){
            return $meteor.subscribe('users');
          }],
          questions: ["$meteor", function($meteor){
            return $meteor.subscribe('questions');
          }],
          actions: ["$meteor", function($meteor){
            return $meteor.subscribe('actions');
          }]
        }
      })
      .state('game.notStarted', {
        url: '/not-started',
        templateUrl: 'client/views/not-started.ng.html',
        controller: 'NotStartedController'
      })
      .state('game.question', {
        url: '/question',
        templateUrl: 'client/views/question.ng.html',
        controller: 'QuestionController',
        resolve: {
          currentUser: ["$meteor", function($meteor){
            return $meteor.requireUser();
          }]
        }
      })
      .state('game.answer', {
        url: '/answer',
        templateUrl: 'client/views/answer.ng.html',
        controller: 'AnswerController',
        resolve: {
          currentUser: ["$meteor", function($meteor){
            return $meteor.requireUser();
          }],
          questions: ["$meteor", function($meteor){
            return $meteor.subscribe('questions');
          }]
        }
      })
      .state('game.read', {
        url: '/read',
        templateUrl: 'client/views/read.ng.html',
        controller: 'ReadController',
        resolve: {
          currentUser: ["$meteor", function($meteor){
            return $meteor.requireUser();
          }]
        }
      })


      $urlRouterProvider.otherwise("/");
}]);

app.run([
    '$rootScope',
    '$state',
    '$window',
    '$location',
    '$meteor',
    function($rootScope, $state, $window, $location, $meteor){
      $window.rs = $rootScope;
      $rootScope.header = {};
      $rootScope.header.heading = 'fun';
      $rootScope.$on('$stateChangeError', function(evt, toState, toParams, fromState, fromParams, error){

        if (error === "AUTH_REQUIRED") {
          $state.go('home');
        }

      });


}]);
