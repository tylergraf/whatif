var ngModule = angular.module('CreateGameController', []);

ngModule.controller('CreateGameController', [
  '$scope',
  '$rootScope',
  '$meteor',
  '$state',
  '$stateParams',
  function($scope, $rootScope, $meteor, $state, $stateParams){
    $rootScope.mainHeading = "Create Game";
    $rootScope.backState = {state: 'home'};

    $scope.games = $meteor.collection(Games);

    $scope.createGame = function(newGame){
      $scope.newGameObj = {
        name: newGame.name,
        players: [$rootScope.currentUser._id],
        passcode: null,
        state: 'notStarted',
        round: 1,
        creator: $rootScope.currentUser._id,
        createdAt: new Date().getTime() // current time
      };
      $scope.games
        .save($scope.newGameObj)
        .then(function(data){
          $scope.newGameObj._id = data[0]._id;

          $rootScope.currentGame = $meteor.collection(function() {
            return Games.find({players:{$in: [$rootScope.currentUser._id]}});
          }, false)[0];
          $state.go('game.question');
        }, function(err){
          alert('An error occurred.'+err);
        });
    };
}]);
