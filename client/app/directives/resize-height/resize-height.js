
import angular from 'angular';

const module = angular.module('Tellius.directives.resizeHeight', []);

module.directive('resizeHeight', /*@ngInject*/ function resizeHeightDirective($window) {
    return function resizeHeightReturn(scope, element, attr) {
        let w = angular.element($window);
        scope.$watch(function returnDimensions() {
            return {
                'h': window.innerHeight,
                'w': window.innerWidth,
            };
        }, function setNewValues(newValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;
            scope.resizeWithOffset = function returnHeight(offsetH) {
                scope.$eval(attr.notifier);
                return {
                    'height': (newValue.h - offsetH) + 'px',
                };
            };
        }, true);
        w.bind('resize', function applyScope() {
            scope.$apply();
        });
    };
});

export default module;
