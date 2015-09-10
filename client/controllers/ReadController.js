var ngModule = angular.module('ReadController', []);

ngModule.controller('ReadController', [
  '$scope',
  '$rootScope',
  '$meteor',
  '$state',
  '$stateParams',
  function($scope, $rootScope, $meteor, $state, $stateParams){
    window.io = $scope;

    $scope.$meteorSubscribe('questions');
    $scope.questions = $meteor.collection(Questions);

    var assignedQuestionId = $scope.currentGame.assignedQuestions[$rootScope.currentUser._id];
    $scope.question = $scope.$meteorObject(Questions, {gameId: $scope.currentGame._id, userId: assignedQuestionId, round: $scope.currentGame.round});

    $scope.nextRound = function(game){
      game.round++;
      game.state = 'question';
    };
}]);
