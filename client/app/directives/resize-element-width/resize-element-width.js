import angular from 'angular';
//import $ from 'jquery';

const module = angular.module('Tellius.directives.resizeElementWidth', []);

module.directive('resizeElementWidthSrc', function directive() {
    return {
        restrict: 'A', 
        link: function result(scope, element) {
            let name = element.attr('resize-element-width-src');
            let min1 = 0;
            let min2 = 0;
            let startDestWidth1 = 0;
            let startDestWidth2 = 0;
            let startPoint = 0;
            function mousemove(event) {
                let newWidth1 = startDestWidth1 + (startPoint - event.pageX);
                let newWidth2 = startDestWidth2 + (startPoint - event.pageX);
                if (newWidth1 > min1) {
                    angular.element(document.querySelector('[resize-element-width-dest1="' + name + '"]')).css({
                        width: newWidth1 + 'px',
                    });
                }
                if (newWidth2 > min2) {
                    angular.element(document.querySelector('[resize-element-width-dest2="' + name + '"]')).css({
                        width: newWidth2 + 'px',
                    });
                }
                scope.$apply();
            }
            function mouseup() {
                angular.element(document.querySelector('body')).off('mousemove', mousemove);
                angular.element(document.querySelector('body')).off('mouseup', mouseup);
            }
            element.on('mousedown', function mousedown(event) {
                event.preventDefault();
                startDestWidth1 = angular.element(document.querySelector('[resize-element-width-dest1="' + name + '"]'))[0].offsetWidth;
                startDestWidth2 = angular.element(document.querySelector('[resize-element-width-dest2="' + name + '"]'))[0].offsetWidth;
                min1 = angular.element(document.querySelector('[resize-element-width-dest1="' + name + '"]')).attr('resize-element-width-min1');
                min2 = angular.element(document.querySelector('[resize-element-width-dest2="' + name + '"]')).attr('resize-element-width-min2');
                startPoint = event.pageX;
                angular.element(document.querySelector('body')).on('mousemove', mousemove);
                angular.element(document.querySelector('body')).on('mouseup', mouseup);
            });
        },
    };
});

export default module;
