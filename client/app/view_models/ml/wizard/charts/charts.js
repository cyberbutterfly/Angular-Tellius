import angular from 'angular';
import Measures from './measures/measures';
import ROC from './ROC/ROC';
import Matrix from './matrix/matrix';
import regressionTable from './regression-table/regression-table';

const module = angular.module('Tellius.viewModels.ml.charts', [
  Measures.name,
  ROC.name,
  Matrix.name,
  regressionTable.name,
]);

export default module;
