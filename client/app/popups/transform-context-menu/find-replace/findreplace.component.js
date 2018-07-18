import { FindReplaceController } from './findreplace.controller';
import template from './findreplace.jade';

export class FindReplaceComponent {
  constructor() {
    this.restrict         = 'E';
    this.template         = template;
    this.bindToController = true;
    this.scope            = {
      columnName: '=',
    };
    this.controllerAs     = 'vm';
    this.controller       = FindReplaceController;
  }
}
