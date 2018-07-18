import Ctrl from './applied-vizpad-filter.controller';
import template from './applied-vizpad-filter.jade';

class AppliedVizpadFilterComponent {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
      vizPadObj: '=',
    };
    this.template         = template;
    this.controller       = Ctrl;
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}

export default AppliedVizpadFilterComponent;
