import angular from 'angular';
import ConfidenceIntervalService from './confidence-interval.service';
import CombineChartService from './combine-chart.service';
import PieChartService from './pie-chart.service';
import BarChartsService from './bar-chart.service';
import ScatterPlotService from './scatter-plot.service';
import HeatMapService from './heat-map.service';
import BubbleChartService from './bubble-chart.service';
import PolarChartService from './polar-chart.service';
import ZoomableChartService from './zoomable-chart.service';
import WordCloudService from './word-cloud.service';
import RadialProgressService from './radial-progress.service';

const module = angular.module('Tellius.services.chartType', []);

module.service('ConfidenceIntervalService', ConfidenceIntervalService);
module.service('CombineChartService', CombineChartService);
module.service('BarChartsService', BarChartsService);
module.service('PieChartService', PieChartService);
module.service('ScatterPlotService', ScatterPlotService);
module.service('BubbleChartService', BubbleChartService);
module.service('HeatMapService', HeatMapService);
module.service('PolarChartService', PolarChartService);
module.service('ZoomableChartService', ZoomableChartService);
module.service('WordCloudService', WordCloudService);
module.service('RadialProgressService', RadialProgressService);

export default module;
