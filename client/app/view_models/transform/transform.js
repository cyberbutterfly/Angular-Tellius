import angular from 'angular';
import grid from './grid/grid';
import list from './list-view/list-view';
import menu from './menu/menu';
import footer from './footer/footer';
import State from './transform.state';
import template from './transform.jade';

const module = angular.module('Tellius.viewModels.transform', [
  grid.name,
  list.name,
  menu.name,
  footer.name,
]);

module.config(State);
module.component('transformViewModel', {
  bindings: {
    dataset: '=',
  },
  template: template(),
});

export default module;
