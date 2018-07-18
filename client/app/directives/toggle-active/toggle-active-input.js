import angular from 'angular';

const module = angular.module('Tellius.directives.toggleActiveInput', []);

module.directive('toggleActiveInputSrc', function toggleActiveInputSrcDirective() {
    return {
        restrict: 'A',
        link: function toggleActiveReturnInput(scope, element) {
            let name = element.attr('toggle-active-input-src');
            let currentState = element.hasClass('active');
            element.on('focus', function startFocusDirective() {
                element.data('thing', true);
                let src = angular.element(element);
                let dest1 = angular.element(document.querySelector('[toggle-active-dest1="' + name + '"]'));
                let dest2 = angular.element(document.querySelector('[toggle-active-dest2="' + name + '"]'));

                if (currentState === true) {
                    src.removeClass('active');
                    dest1.removeClass('active');
                    dest2.removeClass('active');
                    currentState = false;
                } else {
                    src.addClass('active');
                    dest1.addClass('active');
                    dest2.addClass('active');
                    currentState = true;
                }

                if (dest1.hasClass('outside-click-close') || dest2.hasClass('outside-click-close')) {
                    dest1.data('thing', true);
                    dest2.data('thing', true);
                    angular.element(document.querySelector('body')).on('click', function closeOnClick(e) {
                        let inThing =  angular.element(e.target).inheritedData('thing');
                        if (!inThing) {
                            element.data('thing', false);
                            dest1.data('thing', false);
                            dest2.data('thing', false);
                            src.removeClass('active');
                            dest1.removeClass('active');
                            dest2.removeClass('active');
                            currentState = false;
                            angular.element(document.querySelector('body')).off('click');
                        }
                    });
                }
            });
        },
    };
});

export default module;
