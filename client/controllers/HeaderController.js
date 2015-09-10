var ngModule = angular.module('HeaderController', []);

ngModule.controller('HeaderController', [
  '$scope',
  '$rootScope',
  '$meteor',
  '$state',
  '$stateParams',
  function($scope, $rootScope, $meteor, $state, $stateParams){
    console.log('gott');
    $rootScope.header.heading = 'stuff';
    $scope.logout = function(){
      $meteor.logout().then(function(){
        console.log('Logout success');
      }, function(err){
        console.log('logout error - ', err);
      });
    };
}]);
