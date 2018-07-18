import angular from 'angular';
import { MoveColumnComponent } from './move-column.component';

export default angular
  .module('Tellius.viewModels.transform.columnHeader.moveColumn', [])
  .directive('moveColumnPopup', () => new MoveColumnComponent);
