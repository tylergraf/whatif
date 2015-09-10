var ngModule = angular.module('TapComponent', []);

  ngModule.directive('ngTap', [
    '$window',
    '$parse',
    '$timeout',
    function($window, $parse, $timeout) {
      var isTouchDevice = !!("ontouchstart" in $window);

      return function(scope, elm, attrs) {
        var fn = $parse(attrs.ngTap, null, true),
            callback;

        if (isTouchDevice) {
          var tapping = false;
          var tapped = false;
          elm.bind('touchstart', function(evt) {  tapping = true; });
          elm.bind('touchmove', function(evt) {  tapping = false; });
          elm.bind('touchend', function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            callback = function() {
              fn(scope, {$event:evt});
            };
            tapping && scope.$apply(callback);
            tapped = true;
            $timeout(function(){
              // reset tapped var
              tapped = false;
            },500);
          });
          elm.bind('click', clickHandler);

          function clickHandler(evt){
            if(tapped){
              // reset tapped var
              tapped = false;
              return false;
            }
            callback = function() {
              fn(scope, {$event:evt});
            };
            scope.$apply(callback);
          }

        } else {
          elm.bind('click', function(evt) {
            callback = function() {
              fn(scope, {$event:evt});
            };
            scope.$apply(callback);
          });
        }
      };
}]);
