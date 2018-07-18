import angular from 'angular';
import EventEmitter from 'eventemitter3';

export class ngTabsController extends EventEmitter {
  constructor() {
    super();
    let vm = this;

    vm.panes = [];

    vm.navActiveClass = 'ng-tabs-nav-item_active';
  }

  select(pane) {
    let vm = this;

    vm.panes.forEach((item) => {
      item.vm.selected = false;
    });
    pane.vm.selected = true;

    this.emit('paneSelected', {
      pane: pane.vm,
    }, this);
  }

  addPane(pane) {
    let vm = this;

    if (angular.isUndefined(pane)) {
      return false;
    }

    if (vm.panes.length === 0) {
      if (angular.isDefined(vm.options) && angular.isFunction(vm.options.onReady)) {
        vm.options.onReady(this);
      }

      vm.select(pane);
    }

    vm.panes.push(pane);
  }
}
