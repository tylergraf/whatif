var ngModule = angular.module('QuestionController', []);

ngModule.controller('QuestionController', [
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

    $scope.questionsInGameAndRound = $meteor.collection(function() {
      return Questions.find({gameId: $scope.currentGame._id, round: $scope.currentGame.round});
    }, false);

    $scope.$watchCollection('questionsInGameAndRound', function(){
      var currentGamePlayerIds = $scope.currentGame.players,
      questionsAskedPlayerIds = _.pluck($scope.questionsInGameAndRound, 'userId');

      $scope.waitingOn = _.difference(currentGamePlayerIds,questionsAskedPlayerIds);
    });

    $meteor.autorun($scope, function() {
      if ($scope.getReactively('currentUser')) {
        $scope.question = $scope.$meteorObject(Questions, {
          userId: $scope.getReactively('currentUser')._id,
          gameId: $scope.getReactively('currentGame')._id,
          round: $scope.getReactively('currentGame').round,
        });
      }
    });

    $scope.questionAsked = !!$scope.question.question;

    $scope.askQuestion = function(question){

      var newQuestion = {
        gameId: $scope.currentGame._id,
        question: question.question,
        userId: $rootScope.currentUser._id,
        round: $scope.currentGame.round,
        answer: null,
        createdAt: new Date() // current time
      };
      $scope.questions
        .save(newQuestion)
        .then(function(data){
          $scope.question = '';
          $scope.questionAsked = true;
        });
    };

}]);
