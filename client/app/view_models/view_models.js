import angular from 'angular';
import uiRouter from 'angular-ui-router';

import app from './app/app';
import transform from './transform/transform';
import ml from './ml/ml';
import dataflow from './dataflow/dataflow';
import dataset from './dataset/dataset';
import dashboard from './dashboard/dashboard';
import analytics from './analytics/analytics';
import vizpad from './vizpad/vizpad';
import login from './login/login';
import error from './error/error';
import explore from './explore/explore';
import settings from './settings/settings';

const viewModelsModule = angular.module('Tellius.viewModels', [
  uiRouter,
  app.name,
  transform.name,
  ml.name,
  dataflow.name,
  dataset.name,
  dashboard.name,
  analytics.name,
  vizpad.name,
  login.name,
  error.name,
  explore.name,
  settings.name,
]);

export default viewModelsModule;
