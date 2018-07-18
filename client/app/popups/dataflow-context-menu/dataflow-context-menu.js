import angular from 'angular';
import AddNodePopup from './add-node/add-node';

const module = angular.module('Tellius.popups.dataflowContextMenu', [
  AddNodePopup.name,
]);

export default module;
