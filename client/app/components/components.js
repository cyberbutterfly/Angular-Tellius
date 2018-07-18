import angular from 'angular';

import ColumnContextMenu from './column-context-menu/column-context-menu';
import ColumnFilter from './column-filter/column-filter';
import AdvancedFilters from './advanced-filters/advanced-filters';
import ngTabs from './tabs/tabs';
import Header from './header/header';
import NavSidebar from './nav-sidebar/nav-sidebar';
import Telliscript from './telliscript/telliscript';
import SearchQL from './search-ql/search-ql';
import ContextMenu from './context-menu/context-menu';
import TypestatsIndicator from './typestats-indicator/typestats-indicator';
import jobsIndicator from './jobs-indicator';
import jobsList from './jobs-list';

import VizView from './viz-view/viz-view';
import VizType from './viz-type/viz-type';
import VizLegend from './viz-legend/viz-legend';
import VizFilter from './viz-filter/viz-filter';
import VizSettings from './viz-settings/viz-settings';
import AppliedVizFilter from './applied-viz-filter/applied-viz-filter';
import AppliedVizpadFilter from './applied-vizpad-filter/applied-vizpad-filter';
import Drill from './drill/drill';
import Trend from './trend/trend';
import graph from './graph/graph';
import vizList from './viz-list/viz-list';
import drawGraph from './draw-graph/draw-graph';
import './table/table.scss';

const componentModule = angular.module('Tellius.components', [
  ColumnContextMenu.name,
  AdvancedFilters.name,
  ColumnFilter.name,
  ngTabs.name,
  Header.name,
  NavSidebar.name,
  Telliscript.name,
  SearchQL.name,
  ContextMenu.name,
  TypestatsIndicator.name,
  jobsIndicator.name,
  jobsList.name,

  VizView.name,
  VizType.name,
  VizLegend.name,
  VizFilter.name,
  VizSettings.name,
  AppliedVizFilter.name,
  AppliedVizpadFilter.name,
  Drill.name,
  Trend.name,
  graph.name,
  vizList.name,
  drawGraph.name,
]);

export default componentModule;
