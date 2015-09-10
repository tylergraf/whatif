var ngModule = angular.module('GameController', ['GameServices']);

ngModule.controller('GameController', [
  '$scope',
  '$rootScope',
  '$meteor',
  'GameService',
  '$state',
  '$stateParams',
  function($scope, $rootScope, $meteor, GameService, $state, $stateParams){
    window.io = $scope;
    $scope.$meteorSubscribe('games');


    $scope.$watchCollection('currentGame', function(newVal, oldVal){
      // if game ends or player leaves game
      if(oldVal.players && !newVal.players){
        console.log('no more game or not in game anymore');
        $state.go('home');
      }
      $rootScope.mainHeading = 'Round '+$scope.currentGame.round;

    });

    $meteor.autorun($scope, function() {
      if ($scope.getReactively('currentUser')) {
        $scope.currentGame = $scope.$meteorObject(Games, {players:{$in: [$scope.getReactively('currentUser')._id]}});

        if($scope.currentGame.state){
          return $state.go('game.'+$scope.currentGame.state);
        } else {
          // not in game
          console.log('Not in game');
          $state.go('home');
        }
      }
    });

    // return false;
  //   var watches = [];
  //
  //   var isJoinOrCreate = ($state.current.name === 'game.create' || $state.current.name === 'game.join');
  //
  //   GameService
  //     .getCurrent($rootScope.currentUser._id)
  //     .then(setupGame);
  //
  //   function setupGame(game){
  //     $scope.game = game;
  //
  //
  //
  //   if(!$rootScope.currentGame && !isJoinOrCreate){
  //     return $state.go('home');
  //   }
  //
  //   // This is here because it could get through if it's a join or create page
  //   if($rootScope.currentGame){
  //
  //
  //     if($state.current.name.indexOf($rootScope.currentGame.state) === -1){
  //       return $state.go('game.'+$rootScope.currentGame.state);
  //     }
  //
  //     $scope.questions = $meteor.collection(function() {
  //       return Questions.find({});
  //     }, false);
  //
  //     $scope.questionsInGameAndRound = $meteor.collection(function() {
  //       return Questions.find({gameId: $rootScope.currentGame._id, round: $rootScope.currentGame.round});
  //     }, false);
  //
  //     function handleWaitingOn(){
  //       var waitingOn;
  //       var currentGamePlayerIds = $rootScope.currentGame.players;
  //
  //       if($rootScope.currentGame.state === 'question'){
  //
  //         var questionsAskedPlayerIds = _.pluck($scope.questionsInGameAndRound, 'userId');
  //         $scope.waitingOn = _.difference(currentGamePlayerIds,questionsAskedPlayerIds);
  //
  //       } else if($rootScope.currentGame.state === 'answer'){
  //
  //         var questionsAnsweredPlayerIds = _.pluck($scope.questionsInGameAndRound, 'answeredUserId');
  //         $scope.waitingOn = _.difference(currentGamePlayerIds,questionsAnsweredPlayerIds);
  //       }
  //
  //
  //       if($scope.waitingOn && !$scope.waitingOn.length){
  //         var stateFlow = {
  //           question: 'answer',
  //           answer: 'read'
  //         };
  //         $rootScope.currentGame.state = stateFlow[$rootScope.currentGame.state];
  //         $scope.games.save($rootScope.currentGame);
  //         $state.go('game.'+$rootScope.currentGame.state);
  //       }
  //     }
  //
  //     $scope.$watchCollection('questionsInGameAndRound', handleWaitingOn);
  //     $scope.$watch(function($scope) {
  //       return $scope.questionsInGameAndRound.
  //         map(function(bigObject) {
  //           return bigObject.answer;
  //         });
  //     }, handleWaitingOn, true);
  //     // $scope.$watchCollection('questionsInGameAndRound.answer', handleWaitingOn);
  //
  //     var stateWatch = $scope.$watch(function(){
  //       return $rootScope.currentGame.state;
  //     }, handleWaitingOn);
  //
  //     var playersWatch = $scope.$watchCollection(function(){
  //       return $rootScope.currentGame.players;
  //     }, handleWaitingOn);
  //   }
    $scope.leaveGame = function(){
      // unwatch currentGame on rootscope
      // stateWatch();
      // playersWatch();

      $scope.currentGame.players = _.reject($scope.currentGame.players, function(p){
        return p === $rootScope.currentUser._id;
      });

    };
  // }

}]);
