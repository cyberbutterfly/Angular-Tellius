import angular from 'angular';
import EventEmitter from 'eventemitter3';

export class ContextMenuService extends EventEmitter {
  /*@ngInject*/
  constructor($document, $compile) {
    super();

    this.$document = $document;
    this.$compile = $compile;

    this.docElement = this.$document[0].documentElement;
  }

  onContextMenu(event, optionsArg) {
    if (!angular.isDefined(event)) {
      return false;
    }

    let options = {};

    if (angular.isUndefined(optionsArg)) {
      options = this.options;
    } else {
      options = optionsArg;
    }

    event.stopPropagation();
    event.preventDefault();

    let el = this.render(options);
    let coords = this.getCoords(event.pageX, event.pageY);

    el.css('top', coords.top + 'px');
    el.css('left', coords.left + 'px');

    this.bindEvents();
  }

  bindEvents() {
    if (!angular.isDefined(this.menuElement)) {
      return false;
    }

    this.menuElement.bind('click', (event) => {
      event.stopPropagation();
    });

    this.$document.bind('click', this.close.bind(this));
    this.$document.bind('keydown', this.onDocumentKeyDown.bind(this));
  }

  render(options) {
    let scope = angular.isObject(options.scope) ? options.scope.$new() : this
      .$rootScope.$new();

    if (angular.isDefined(this.menuElement)) {
      this.close();
    }

    let el = angular.element(
      `<div class="context-menu">
          ${options.template}
        </div>`
    );

    this.menuElement = this.$compile(el)(scope);
    this.docElement.appendChild(this.menuElement[0]);

    if (angular.isFunction(options.onOpen)) {
      let menuElement = this.menuElement;

      options.onOpen({
        menuElement,
      });
    }

    scope.$apply();

    return this.menuElement;
  }

  getCoords(pageX, pageY) {
    if (!angular.isDefined(this.menuElement)) {
      return false;
    }

    let docLeft = (window.pageXOffset || this.docElement.scrollLeft) -
      (this.docElement.clientLeft || 0);
    let docTop = (window.pageYOffset || this.docElement.scrollTop) -
      (this.docElement.clientTop || 0);
    let elementWidth = this.menuElement[0].scrollWidth;
    let elementHeight = this.menuElement[0].scrollHeight;
    let docWidth = this.docElement.clientWidth + docLeft;
    let docHeight = this.docElement.clientHeight + docTop;
    let totalWidth = elementWidth + pageX;
    let totalHeight = elementHeight + pageY;
    let left = Math.max(pageX - docLeft, 0);
    let top = Math.max(pageY - docTop, 0);

    if (totalWidth > docWidth) {
      left = left - (totalWidth - docWidth);
    }

    if (totalHeight > docHeight) {
      top = top - (totalHeight - docHeight) - 10;
    }

    return {
      top,
      left,
    };
  }

  close() {
    if (this.menuElement !== null) {
      if (this.options && angular.isFunction(this.options.onClose)) {
        let menuElement = this.menuElement;
        this.options.onClose({
          menuElement,
        });
      }

      this.emit('CLOSE_CONTEXT_MENU', this);
      this.$document.unbind('keydown', this.onDocumentKeyDown.bind(this));
      this.$document.unbind('click', close.bind(this));
      this.menuElement.remove();
    }
  }

  onDocumentKeyDown(event) {
    if (event.keyCode === 27) {
      this.close();
    }
  }
}
