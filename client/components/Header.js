var ngModule = angular.module('HeaderComponent', []);

ngModule.directive('mainHeader', [
  '$rootScope',
  '$state',
  function($rootScope, $state){
    return {
      restrict: 'E',
      scope: true,
      replace: true,
      templateUrl: 'client/views/templates/header.ng.html',
      link: function(scope, element, attrs){
        scope.back = function(){
          $state.go($rootScope.backState.state);
        };
      }
    };
}]);
