var ngModule = angular.module('NotStartedController', []);

ngModule.controller('NotStartedController', [
  '$scope',
  '$rootScope',
  '$meteor',
  '$state',
  '$stateParams',
  function($scope, $rootScope, $meteor, $state, $stateParams){

    $scope.startGame = function(currentGame){
      currentGame.state = 'question';
    };
}]);
