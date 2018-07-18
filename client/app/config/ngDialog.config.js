import angular from 'angular';
import ngDialog from 'ng-dialog';
import './ngDialog.config.scss';

const module = angular.module('Tellius.config.ngDialog', [
  ngDialog,
]);

module.config( /*@ngInject*/ ngDialogProvider => {
  ngDialogProvider.setDefaults({
    disableAnimation: true,
    className: 'ngdialog-theme-default',
  });
});

export default module;
