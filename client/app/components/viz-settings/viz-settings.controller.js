import _ from 'lodash';

class VizSettingsCtrl {
  /*@ngInject*/
  constructor(VizpadDataService, ColorPaletteService, $rootScope, $scope, $mdDialog, $mdMedia, DatafileService, $timeout) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$mdDialog = $mdDialog;
    // this.ChartNameService = ChartNameService;
    var parentThis = this;
    this.xColumns = DatafileService.xColumns;
    this.yColumns = DatafileService.yColumns;

    this.dateColumns = DatafileService.dateColumns;
    this.showOtherDimension = false;
    this.isPolarChart = false;
    this.showStacked = false;
    this.isTable = true;
    this.showSimpleCount = false;
    this.viz.polarArea = [];


    $scope.$watch(function(){
      if (typeof parentThis.viz != "undefined")
        return parentThis.viz;
    },function(){
      if (typeof parentThis.viz != "undefined") {
        parentThis.yAxisResolution = parentThis.viz.yAxis.aggregation;
        parentThis.xAxisResolution = parentThis.viz.xAxis.resolution;
        if(parentThis.viz.xAxis.column != "null")
          parentThis.xAxis = parentThis.viz.xAxis.column;
        if(parentThis.viz.yAxis.column != "null")
          parentThis.yAxis = parentThis.viz.yAxis.column;
      }
    });
    this.secondPolarMeasure = '';
    this.thirdPolarMeasure = '';
    this.tableColumns = [];
    this.showXAxisResolution = false;
    this.showYAxisResolution = false;
    this.showXcolumnTimeAggregation = true;
    this.colorPalette = ColorPaletteService.colorPaletteData;
    $scope.$watch(function(){
        if (typeof parentThis.viz != "undefined" && typeof parentThis.viz.type != "undefined" )
          return parentThis.viz.type;
    },function(){
      parentThis.showOtherDimension = false;
      parentThis.isPolarChart = false;
      parentThis.isTable = false;
      parentThis.showSimpleCount = false;
      if (typeof parentThis.viz != "undefined" && typeof parentThis.viz.type != "undefined" ) {
        switch(parentThis.viz.type){
          case "line":

          break;

          case "zoomable":

          break;

          case "barsHorizontal":
            parentThis.viz.type = "bar";

          break;

          case "barsHorizontalStacked":
            parentThis.showStacked = true;
          break;

          case "barsVertical":
            parentThis.viz.type = "column";
          break;

          case "barsVerticalStacked":
            parentThis.showStacked = true;
          break;

          case 'combineBarStacked':
            parentThis.showStacked = true;
          break;

          case "pie":
          break;

          case "scatter":
            // parentThis.showOtherDimension = true;
          break;

          case "bubble":
            parentThis.showOtherDimension = true;

            if (typeof parentThis.viz.label == "undefined" || parentThis.viz.label.length == 0) {
              parentThis.viz.label = parentThis.viz.xAxis.column;
            }
            if (typeof parentThis.viz.radius == "undefined") {
              parentThis.viz.radius = parentThis.yColumns[4];
            };
            if (!parentThis.viz.bubbleAxis) {
              parentThis.viz.bubbleAxis = parentThis.yColumns[5];
            }
          break;

          case "polar":
            parentThis.showOtherDimension = true;
            parentThis.isPolarChart = true;
            if (parentThis.viz.polarArea[0] == null) {
              parentThis.viz.polarArea[0] = parentThis.viz.yAxis.column;
            }

          break;

          case "stackedArea":
            parentThis.showStacked = true;
          break;

          case "table":
            parentThis.isTable = true;
          break;

          case "simpleCount":
            parentThis.viz.type = "simpleCount";
            parentThis.showSimpleCount = true;
          break;
        }
      }
        // parentThis.updateChart();
    });

  }

  colorPaletteSelected(colorPalette, $index) {
    this.viz.colorPaletteDataColors.id = colorPalette.id;
    this.viz.colorPaletteDataColors.colors = colorPalette.colors;
    // this.$rootScope.$broadcast('colorPaletteChanged', {colorPalette : colorPalette, vizObj : this.viz});
  }

  themeColorPaletteSelected($event, value) {
    this.viz.colorPaletteThemeColors = value;
    // this.$rootScope.$broadcast('themeColorPaletteChanged', {value: value, vizObj : this.viz});
  }

  drawMultipleLine() {
    this.viz.lineThirdMeasure.column = this.lineThirdMeasure;
  }

  openMenu(event) {
    $mdOpenMenu(event);
  }

  showTimeAggregation() {
    if (this.dateColumns.indexOf(this.xAxis) != -1) {
      this.showXcolumnTimeAggregation = true;
    } else {
      this.showXcolumnTimeAggregation = false;
    }
    this.changeAxes();
  }

  simpleCountAggregation() {
    this.viz.xAxis.column = this.simpleCountColumn;
    this.viz["label"] = this.simpleCountLabel;
  }

  compareWith() {
    var parentThis = this;
    this.secondY = [];
    // this.viz.loading = true;
    if(this.selectedYColumn != null) {
      if(this.viz.type == 'combineBarChart'){
        this.viz.secondType = 'bar';
      }
      if(this.viz.type == 'combineColChart' || this.viz.type == 'combineBarStacked') {
        this.viz.secondType = 'column';
      }

      // this.viz.firstType = 'line';
      this.viz.combinedGraphMeasure.column = this.selectedYColumn;
    }
  }

  addHeatmapDimension() {
    this.viz.third_column = this.heatmapDimension;
    // this.viz.fourth_column = this.fourthHeatmapDimension;
  }

  changeXAxisResolution(xAxis) {
    this.viz.xAxis.resolution = xAxis;
    this.showXAxisResolution = true;
  }

  changeYAxisResolution(yAxis) {
    this.viz.yAxis.aggregation = yAxis;
    this.yAxisAggreagtion = yAxis;
    this.showYAxisResolution = true;
    this.changeAxes()
  }


  changeSimpleCountResolution(res) {
    this.viz["simple-count-aggragation"] = viz.yAxis.column.split("_")[0];
  }

  changedPolarAxes() {
    // this.viz["y-axis"] = '';
    // this.viz["x-axis"] = this.firstPolarMeasure;
    this.viz["third_column"] = this.secondPolarMeasure;
    this.viz["fourth_column"] = this.thirdPolarMeasure;
  }

  simpleCountAggregation() {
    this.viz.xAxis.column = viz.yAxis.column.split("_")[0];
  }

}

export default VizSettingsCtrl;
