var ngModule = angular.module('AnswerController', []);

ngModule.controller('AnswerController', [
  '$scope',
  '$rootScope',
  '$meteor',
  '$state',
  '$stateParams',
  function($scope, $rootScope, $meteor, $state, $stateParams){
    window.io = $scope;

    $scope.$meteorSubscribe('questions');
    $scope.questions = $meteor.collection(Questions);
    $scope.waitingOn = $meteor.collection(Questions);

    var assignedQuestionId = $scope.currentGame.assignedQuestions[$rootScope.currentUser._id];
    $scope.question = $scope.$meteorObject(Questions, {gameId: $scope.currentGame._id, userId: assignedQuestionId, round: $scope.currentGame.round});

    $scope.questionsAnsweredInGameAndRound = $meteor.collection(function() {
      return Questions.find({gameId: $scope.currentGame._id, round: $scope.currentGame.round, answeredUserId: {$exists: true}});
    }, false);

    $scope.$watchCollection('questionsAnsweredInGameAndRound', function(){
      var currentGamePlayerIds = $scope.currentGame.players,
      questionsAnsweredPlayerIds = _.pluck($scope.questionsAnsweredInGameAndRound, 'answeredUserId');
      $scope.waitingOn = _.difference(currentGamePlayerIds,questionsAnsweredPlayerIds);
    });

    $scope.questionAnswered = !!$scope.$meteorObject(Questions, {
      answeredUserId: $rootScope.currentUser._id,
      gameId: $scope.currentGame._id,
      round: $scope.currentGame.round
    })._id;

    $scope.answerQuestion = function(answer){
      if(!answer){
        return alert('Answer the question please');
      }
      $scope.question.answeredUserId = $rootScope.currentUser._id;
      $scope.question.answer = answer;
      $scope.questionAnswered = true;
    };

}]);
