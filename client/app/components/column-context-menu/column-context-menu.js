import angular from 'angular';
import {
  ColumnContextMenuComponent,
} from './column-context-menu.component';

export default angular
  .module('Tellius.components.columnContextMenu', [])
  .directive('columnContextMenu', () => new ColumnContextMenuComponent);
