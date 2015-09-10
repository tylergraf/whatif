var ngModule = angular.module('HeaderComponent', []);

ngModule.directive('mainHeader', [
  '$rootScope',
  '$state',
  '$meteor',
  function($rootScope, $state, $meteor){
    return {
      restrict: 'E',
      scope: true,
      replace: true,
      templateUrl: 'client/views/templates/header.ng.html',
      link: function(scope, element, attrs){
        scope.back = function(){
          if(scope.currentGame._id){
            if(scope.currentGame.creator === $rootScope.currentUser._id){
              Games.remove({_id: scope.currentGame._id});
            } else {
              scope.currentGame.players = _.reject(scope.currentGame.players, function(p){
                return p === $rootScope.currentUser._id;
              });
            }
            $state.go('home');
          } else {
            $state.go($rootScope.backState.state);
          }
        };
        window.hh = scope;

        scope.$meteorSubscribe('games');

        $meteor.autorun(scope, function() {
          if (scope.getReactively('currentUser')) {
            scope.currentGame = scope.$meteorObject(Games, {players:{$in: [scope.getReactively('currentUser')._id]}});
          }
        });
      }
    };
}]);
