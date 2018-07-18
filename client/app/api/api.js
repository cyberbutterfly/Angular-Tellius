import angular from 'angular';

import apiWrapper from './wrapper/wrapper';
import FunctionAPI from './function/function';
import FusionAPI from './fusion/fusion';
import LoadAPI from './load/load';
import DataflowAPI from './dataflow/dataflow';
import DatasetAPI from './dataset/dataset';
import DatasetDescriptionModel from './dataset-description/dataset-description';
import ColumnAPIMock from './column/column';
import TransformAPI from './transform/transform';
import MLAPI from './ml/ml';
import EvaluateAPI from './evaluate/evaluate';
import PredictAPI from './predict/predict';
import CompareAPI from './compare/compare';
import SearchQL from './search-ql/search-ql';
import PipelineAPI from './pipeline/pipeline';
import SaveModel from './save/save';
import JobsModel from './jobs';
import UsersModel from './users';
import GroupsModel from './groups';
import ModulesModel from './modules';
import MeasuresModel from './measures';

const apiModule = angular.module('Tellius.api', [
  apiWrapper.name,
  FunctionAPI.name,
  FusionAPI.name,
  LoadAPI.name,
  DataflowAPI.name,
  DatasetAPI.name,
  DatasetDescriptionModel.name,
  ColumnAPIMock.name,
  TransformAPI.name,
  MLAPI.name,
  EvaluateAPI.name,
  PredictAPI.name,
  CompareAPI.name,
  SearchQL.name,
  SaveModel.name,
  PipelineAPI.name,
  JobsModel.name,
  UsersModel.name,
  GroupsModel.name,
  ModulesModel.name,
  MeasuresModel.name,
]);

export default apiModule;
