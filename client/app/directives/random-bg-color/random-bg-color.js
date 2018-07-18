import angular from 'angular';

const module = angular.module('Tellius.directives.randomBgColor', []);

module.directive('randomBgColor', function toggleActiveSrcDirective() {
  return {
    restrict: 'A',
    replace: false,
    link: function (scope, element, attr) {

      //generate random color
      var color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);

      //Add random background class to selected element
      element.css('background-color', color);

    }
  };
});

export default module;
