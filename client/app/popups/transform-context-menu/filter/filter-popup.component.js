import { FilterPopupCtrl } from './filter-popup.controller';
import template from './filter-popup.jade';

export class FilterPopupComponent {
  constructor() {
    this.restrict         = 'E';
    this.scope            = {
      cellValue: '=',
      columnType: '=',
      columnName: '=',
    };
    this.template         = template;
    this.controller       = FilterPopupCtrl;
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}
