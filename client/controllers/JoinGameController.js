var ngModule = angular.module('JoinGameController', []);

ngModule.controller('JoinGameController', [
  '$scope',
  '$rootScope',
  '$meteor',
  '$state',
  '$stateParams',
  function($scope, $rootScope, $meteor, $state, $stateParams){
    window.io = $scope;
    
    $rootScope.mainHeading = "Join Game";
    $rootScope.backState = {state: 'home'};

    $scope.games = $meteor.collection(Games);

    $scope.joinGame = function(game){
      game.players.push($rootScope.currentUser._id);
      $scope.games
        .save(game)
        .then(function(data){
          $rootScope.currentGame = game;
          $state.go('game.question');
        }, function(err){
          alert('An error occurred.'+err);
        });
    };
}]);
