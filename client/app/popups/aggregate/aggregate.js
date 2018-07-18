import angular from 'angular';
import 'checklist-model';
import { AggregateComponent } from './aggregate.component';

export default angular
  .module('Tellius.viewModels.transform.aggregate', [
    'checklist-model',
  ])
  .directive('aggregatePopup', () => new AggregateComponent);
