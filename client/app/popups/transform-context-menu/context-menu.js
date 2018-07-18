import angular from 'angular';
import AddColumnPopup from './add-column/add-column';
import FindReplace from './find-replace/findreplace';
import MoveColumnPopup from './move-column/move-column';
import RenamePopup from './rename/rename-popup';
import MergePopup from './mergecolumn/mergecolumn-popup';
import SplitrowsPopup from './splitrows/splitrows-popup';
import SplitcolumnPopup from './splitcolumn/splitcolumn-popup';
import FixedValue from './fixedvalue/fixedvalue';
import FilterPopup from './filter/filter-popup';

const module = angular.module('Tellius.popups.transformContextMenu', [
  AddColumnPopup.name,
  MoveColumnPopup.name,
  RenamePopup.name,
  MergePopup.name,
  SplitrowsPopup.name,
  SplitcolumnPopup.name,
  FixedValue.name,
  FindReplace.name,
  FilterPopup.name,
]);

export default module;
