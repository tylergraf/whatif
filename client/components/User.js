var ngModule = angular.module('UserComponent', []);

ngModule.directive('user', [
  '$rootScope',
  '$meteor',
  function($rootScope, $meteor){
    return {
      restrict: 'EA',
      scope: {
        userId: '@',
        size: '@'
      },
      templateUrl: 'client/views/templates/user.ng.html',
      link: function(scope, element, attrs){
        scope.name = (attrs.name) ? scope.$eval(attrs.name) : true;
        scope.avatar = (attrs.avatar) ? scope.$eval(attrs.avatar) : true;
        scope.size = attrs.size || 'medium';

        scope.$meteorSubscribe('users');
        scope.user = scope.$meteorCollection(function() {
          return Meteor.users.find({_id: scope.userId});
        }, false)[0];

      }
    };
}]);
