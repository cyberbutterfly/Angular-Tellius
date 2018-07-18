import angular from 'angular';

const module = angular.module('Tellius.directives.toggleActive', []);

module.directive('toggleActiveSrc', function toggleActiveSrcDirective() {
  return {
    restrict: 'A',
    link: function toggleActiveReturn(scope, element) {
      const name = element.attr('toggle-active-src');
      const closeItem = element.attr('toggle-close-item');

      let currentState = element.hasClass('active');
      element.on('click', function startClickDirective() {
        element.data('thing', true);
        const src = angular.element(element);
        const dest = angular.element(document.querySelector(
          '[toggle-active-dest="' + name + '"]'));

        if (currentState === true) {
          src.removeClass('active');
          dest.removeClass('active');
          currentState = false;
        } else {
          src.addClass('active');
          dest.addClass('active');
          currentState = true;
        }


        if (dest.hasClass('outside-click-close')) {
          dest.data('thing', true);
          angular.element(document.querySelector('body'))
            .on('click', function closeOnClick(e) {
              let inThing = angular.element(e.target)
                .inheritedData('thing');

              const isContains = closeItem ?
                dest[0].contains(e.target) :
                false;

              if (!inThing || isContains) {
                element.data('thing', false);
                dest.data('thing', false);
                src.removeClass('active');
                dest.removeClass('active');
                currentState = false;
                angular.element(document.querySelector('body'))
                  .off('click');
              }
            });
        }
      });
    },
  };
});

export default module;
