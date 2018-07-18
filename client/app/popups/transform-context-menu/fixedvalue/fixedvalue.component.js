import { FixedValueController } from './fixedvalue.controller';
import template from './fixedvalue.jade';

export class FixedValueComponent {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
      columnName: '=',
    };
    this.controller       = FixedValueController;
    this.template         = template();
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}
