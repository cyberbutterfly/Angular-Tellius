import {
  ColumnContextMenuController,
} from './column-context-menu.controller';
import template from './column-context-menu.jade';
import './column-context-menu.scss';

export class ColumnContextMenuComponent {
  constructor() {
    this.restrict         = 'E';
    this.scope            = {
      closeMenu: '&',
      cellValue: '=',
      columnType: '=',
      columnName: '=',
    };
    this.template         = template;
    this.controller       = ColumnContextMenuController;
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}
