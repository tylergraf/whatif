var ngModule = angular.module('HomeController', []);

ngModule.controller('HomeController', [
  '$rootScope',
  '$scope',
  '$meteor',
  '$state',
  '$stateParams',
  function($rootScope, $scope, $meteor, $state, $stateParams){
    // Set up header
    $rootScope.mainHeading = "What If?";
    $rootScope.backState = false;

    $scope.$meteorSubscribe('games');

    $scope.$watch('currentGame', function(newVal){
      if(newVal.players){
        console.log('redirecting to game');
        $state.go('game')
      }
    });

    $meteor.autorun($scope, function() {
      if ($scope.getReactively('currentUser')) {
        $scope.currentGame = $scope.$meteorObject(Games, {players:{$in: [$scope.getReactively('currentUser')._id]}});
      }
    });

    $scope.signIn = function(){
      $meteor.loginWithFacebook();
    };

    $scope.logout = function(){
      $meteor.logout().then(function(){
        $rootScope.$broadcast('loggedOut');
      });
    };

    window.io = $scope;

}]);
