import { MoveColumnController } from './move-column.controller';
import template from './move-column.jade';

export class MoveColumnComponent {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
      type: '=',
      columns: '=',
      columnName: '=',
    };
    this.template         = template;
    this.controller       = MoveColumnController;
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}
