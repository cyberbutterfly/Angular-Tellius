import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import 'ng-sortable';
import 'angular-moment';
import ngStorage from 'ngstorage';
//import mdDataTable from 'angular-material-data-table';
import Satellizer from 'satellizer';
import 'angular-contenteditable';
import 'babel-polyfill';
import 'angular-click-outside';
import 'angular-gridster';
import 'ag-grid';

import EnvVariables from './constants';
import Api from './api/api';
import Config from './config/config';
import Directives from './directives/directives';
import Filters from './filters/filters';
import Popups from './popups/popups';
import Helpers from './helpers/helpers';
import ViewModels from './view_models/view_models';
import Services from './services/services';
import Components from './components/components';
import Constants from './constants/constants';
import Interceptors from './interceptors';

import 'ag-grid/dist/ag-grid.min.css';
import 'ag-grid/dist/theme-fresh.min.css';
import 'normalize.css';
import './styles/angular-material.scss';
// import 'angular-material-data-table/dist/md-data-table.min.css';
import './styles/app_.scss';
import './app.styl';
import './styles/app.scss';
import template from './app.jade';

angular.module('Tellius', [
    uiRouter,
    ngMaterial,
    Satellizer,
    ngStorage.name,
    //mdDataTable,
    'contenteditable',
    'angular-click-outside',
    'gridster',
    '$jsPlumb',
    'agGrid',
    'as.sortable',
    'angularMoment',
    Api.name,
    Directives.name,
    Filters.name,
    Popups.name,
    Helpers.name,
    ViewModels.name,
    Services.name,
    Components.name,
    EnvVariables.name,
    Constants.name,
    Config.name,
    Interceptors.name,
  ])
  .component('app', {
    template: template(),
  })
  .config( /*@ngInject*/ $mdIconProvider => {
    $mdIconProvider.defaultIconSet('/assets/mdi.svg');
  })
  .run( /*@ngInject*/ ($rootScope, $state) => {
    $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState,
      fromParams, error) => {
      console.log('stateChangeError', event, toState, toParams,
        fromState, fromParams, error);

      $state.go('error', {
        error,
      });
    });
    $rootScope.$on('$stateChangeStart', function stateChangeStart(evt, to,
      params) {
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params);
      }
    });
  })
  .config( /*@ngInject*/ $mdThemingProvider => {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('blue')
      .warnPalette('red');
  });
