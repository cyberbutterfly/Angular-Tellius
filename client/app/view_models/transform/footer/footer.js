import angular from 'angular';

import { FooterCtrl } from './footer.controller';
import template from './footer.jade';
import './footer.scss';

const module = angular.module('Tellius.viewModels.transform.footer', []);

module.component('transformFooter', {
  controller: FooterCtrl,
  template: template(),
});

export default module;
