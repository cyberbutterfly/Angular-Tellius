import Ctrl from './applied-viz-filter.controller';
import template from './applied-viz-filter.jade';
import './applied-filter.styl';

class AppliedVizFilterComponent {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
      viz: '=',
    };
    this.template         = template;
    this.controller       = Ctrl;
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}

export default AppliedVizFilterComponent;