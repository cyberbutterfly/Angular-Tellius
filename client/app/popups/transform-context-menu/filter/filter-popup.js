import angular from 'angular';
import { FilterPopupComponent } from './filter-popup.component';

export default angular
  .module('Tellius.viewModels.transform.filter', [])
  .directive('filterPopup', () => new FilterPopupComponent);
