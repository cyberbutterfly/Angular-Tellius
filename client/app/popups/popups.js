import angular from 'angular';
import TransformContextMenu from './transform-context-menu/context-menu';
import DataflowContextMenu from './dataflow-context-menu/dataflow-context-menu';
import AdvancedFilters from './advanced-filters/advanced-filters';
import DatasetFusionPopup from './dataset-fusion/dataset-fusion';
import AggregatePopup from './aggregate/aggregate';
import SavePopup from './save/save';
import MLPredictPopup from './mlpredict/mlpredict';
import HandleColumnsPopup from './handle-columns';
import SettingsGroupsAddMembersPopup from './settings-groups-add-members/settings-groups-add-members';
import SettingsGroupsAddDatasetsPopup from './settings-groups-add-datasets/settings-groups-add-datasets';

const module = angular.module('Tellius.popups', [
  TransformContextMenu.name,
  DataflowContextMenu.name,
  AdvancedFilters.name,
  AggregatePopup.name,
  DatasetFusionPopup.name,
  SavePopup.name,
  MLPredictPopup.name,
  HandleColumnsPopup.name,
  SettingsGroupsAddMembersPopup.name,
  SettingsGroupsAddDatasetsPopup.name,
]);

export default module;
