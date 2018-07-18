import $ from 'jquery';

export /*@ngInject*/ function tooltipDirective($document, $compile) {
  return {
    restrict: 'A',
    scope: true,
    link: (scope, element, attrs) => {
      const tip = $compile(
        '<div ng-class="tipClass">{{ text }}<div class="tooltip-arrow"></div></div>'
      )(scope);
      const tipClassName = 'tooltip';
      const tipActiveClassName = 'tooltip-show';

      scope.tipClass = [tipClassName];
      scope.text = attrs.tooltip;

      if (attrs.tooltipPosition) {
        scope.tipClass.push('tooltip-' + attrs.tooltipPosition);
      } else {
        scope.tipClass.push('tooltip-up');
      }
      $document.find('body')
        .append(tip);

      element.bind('mouseover', function mouseOver(e) {
        tip.addClass(tipActiveClassName);

        const pos = e.target.getBoundingClientRect();
        const offset = $(tip)
          .offset();
        const tipHeight = $(tip)
          .outerHeight();
        const tipWidth = $(tip)
          .outerWidth();
        const elWidth = pos.width || pos.right - pos.left;
        const elHeight = pos.height || pos.bottom - pos.top;
        const tipOffset = 10;

        if (tip.hasClass('tooltip-right')) {
          offset.top = pos.top - (tipHeight / 2) + (elHeight / 2);
          offset.left = pos.right + tipOffset;
        } else if (tip.hasClass('tooltip-left')) {
          offset.top = pos.top - (tipHeight / 2) + (elHeight / 2);
          offset.left = pos.left - tipWidth - tipOffset;
        } else if (tip.hasClass('tooltip-down')) {
          offset.top = pos.top + elHeight + tipOffset;
          offset.left = pos.left - (tipWidth / 2) + (elWidth / 2);
        } else {
          offset.top = pos.top - tipHeight - tipOffset;
          offset.left = pos.left - (tipWidth / 2) + (elWidth / 2);
        }

        $(tip)
          .offset(offset);
      });

      element.bind('mouseout', function eMouseOut() {
        tip.removeClass(tipActiveClassName);
      });

      tip.bind('mouseover', function tMouseOver() {
        tip.addClass(tipActiveClassName);
      });

      tip.bind('mouseout', function tMouseOut() {
        tip.removeClass(tipActiveClassName);
      });
    },
  };
}
