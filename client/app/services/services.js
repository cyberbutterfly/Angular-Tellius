import angular from 'angular';
import FilterService from './filter/filter';
import DatasetStorageService from './dataset-storage/dataset-storage';
import UploadService from './upload/upload';
import GridService from './grid/grid';
import MLStorageService from './ml-storage/ml-storage';
import MLTransformation from './ml-transformation/ml-transformation';
import ConfirmService from './confirm/confirm';
import JobsStorage from './jobs-storage';

import SearchqlService from './search-ql/search-ql';
import TransformService from './transform/transform';
import UserService from './user/user';
import GroupService from './group/group';
import VizpadDataService from './vizpad-data/vizpad-data';
import DatafileService from './datafile/datafile';
import ColorPaletteService from './color-palette/color-palette';
import ThemeColorPaletteService from './theme-color-palette/theme-color-palette';
import PlacementObjectService from './placement-object/placement-object';
import SetupVizService from './setup-viz/setup-viz';
import ErrorHandlerService from './error-handler/error-handler';
import VizpadDataExtendedSql from './vizpad-data-extendedsql/vizpad-data-extendedsql';
import ConfidenceIntervalService from './chart-type/chart-type';
import CombineChartService from './chart-type/chart-type';
import LineChartService from './line-chart/line-chart';
import PipelineService from './pipeline/pipeline';
import DrillService from './drill/drill';
import HighchartsConfigService from './highcharts-config/highcharts-config';


const module = angular.module('Tellius.services', [
  FilterService.name,
  DatasetStorageService.name,
  UploadService.name,
  GridService.name,
  MLStorageService.name,
  MLTransformation.name,
  ConfirmService.name,
  JobsStorage.name,

  SearchqlService.name,
  TransformService.name,
  VizpadDataService.name,
  DatafileService.name,
  PlacementObjectService.name,
  ColorPaletteService.name,
  ThemeColorPaletteService.name,
  SetupVizService.name,
  UserService.name,
  GroupService.name,
  ErrorHandlerService.name,
  ConfidenceIntervalService.name,
  CombineChartService.name,
  LineChartService.name,
  VizpadDataExtendedSql.name,
  PipelineService.name,
  DrillService.name,
  HighchartsConfigService.name,
]);

export default module;
