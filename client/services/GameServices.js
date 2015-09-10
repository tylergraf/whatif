var ngModule = angular.module('GameServices', []);

ngModule.factory('GameService', [
    '$http',
    '$rootScope',
    '$q',
    '$window',
    function($http, $rootScope, $q, $window) {

      function get(gameId){
        // debugger;
        $rootScope.pageLoading = true;
        var deferred = $q.defer();

          $http
            .get('/publications/games/'+gameId)
            .success(function(data) {
              deferred.resolve(data);
            })
            .error(function(message, status) {
              var err = {
                message: message,
                status: status
              };
              if(err.status === 401 || err.status === 453){
                $window.location.reload();
              }
              deferred.reject(err);
            })
            .finally(function() {
              // $rootScope.pageLoading = false;
            });

        return deferred.promise;
      }

      function getCurrent(userId){
        var deferred = $q.defer();

          $http
            .get('/api/currentGame/'+userId)
            .success(function(data) {
              deferred.resolve(data);
            })
            .error(function(message, status) {
              var err = {
                message: message,
                status: status
              };
              if(err.status === 401 || err.status === 453){
                $window.location.reload();
              }
              deferred.reject(err);
            })
            .finally(function() {
              // $rootScope.pageLoading = false;
            });

        return deferred.promise;
      }
      return {
        get: get,
        getCurrent: getCurrent
      };
}]);
