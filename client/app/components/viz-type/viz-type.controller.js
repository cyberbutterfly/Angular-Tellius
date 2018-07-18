
class VizTypeCtrl {
  /*@ngInject*/
  constructor(VizpadDataService, $rootScope, $scope, $mdDialog, $mdMedia, DatafileService, $timeout) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$mdDialog = $mdDialog;
    this.subcharts = [];
    this.changedSubChartType = '';
    var parentThis = this;

    if(!this.viz) {
      this.viz = {}
    }

    if(!this.viz.lineThirdMeasure) {

      this.viz.lineThirdMeasure = {
        column: '',
        aggregation: ''
      }

    }


    if (typeof this.viz === "undefined" || typeof this.viz.type === "undefined") {
      parentThis.newChartType = 'line';
      parentThis.selectSubType('line');
    } else {
      this.selectSubType(this.viz.type);
    }


  }

  changeChart(graph) {
    this.selectSubType(graph);
    this.changedChartType = graph;
    switch(graph) {
        case 'line':
            this.viz.type = 'line';
            break;
        case 'column':
            this.viz.type = 'column';
            break;
        case 'pie':
            this.viz.type = 'pie';
            break;
        case 'scatter':
            this.viz.type = 'scatter';
          break;
        case 'bubble':
            this.viz.type = 'bubble';
          break;
        case 'polar':
            this.viz.type = 'polar';
          break;
        case 'heatmap':
            this.viz.type = 'heatmap';
          break;
        case 'combined':
            this.viz.type = 'combineColChart';
          break;
        case 'area':
            this.viz.type = 'area';
        break;
        case 'others':
            this.viz.type = 'radialProgress';
          break;
        default:
            this.subcharts = [];
    }
  }

  selectSubType(chart) {
    switch(chart) {
        case 'line':
            this.subcharts = [
              {
                name:'Basic Line chart',
                type:'line'
              },
              {
                name:'Line Chart with confidence interval',
                type:'confidenceLineRange'
              },
              {
                name:'Zoomable',
                type:'zoomable'
              },
              {
                name:'Multiple line chart',
                type:'multipleLine'
              }
            ];
            break;
        case 'column':
            this.subcharts = [
              {
                name: 'Bars Vertical',
                type: 'barsVertical'
              },
              {
                name: 'Bars Horizontal',
                type: 'barsHorizontal'
              },
              {
                name: 'Bars Horizontal Stacked',
                type: 'barsHorizontalStacked'
              },
              {
                name: 'Bars Vertical Stacked',
                type: 'barsVerticalStacked'
              },
            ];
            break;
        case 'pie':
            this.subcharts = [
              {
                name: 'Basic Pie',
                type:'pie'
              }
            ];
            break;
        case 'scatter':
            this.subcharts = [
            {
              name: 'Scatter plot',
              type: 'scatter'
            }
          ];
          break;
        case 'bubble':
            this.subcharts = [
            {
              name: 'Bubble chart',
              type: 'bubble'
            }
          ];
          break;
        case 'polar':
            this.subcharts = [
            {
              name: 'Polar chart',
              type: 'polar'
            }
          ];
          break;
        case 'heatmap':
            this.subcharts = [
            {
              name: 'Heatmap',
              type: 'heatmap'
            }
          ];
          break;

        case 'area':
            this.subcharts = [
              {
                name: 'Basic Area',
                type: 'area'
              },
              {
                name: 'Stacked Area',
                type: 'stackedArea'
              }
            ];
        break;

        case 'combined':
            this.subcharts = [
              {
                name:'Combine Line and Horizontal Bar',
                type:'combineBarChart'
              },
              {
                name:'Combine Line and Vertical Bar',
                type:'combineColChart'
              },
              {
                name:'Combine Line and Stacked Bars',
                type:'combineBarStacked'
              }
            ];
        break;
        case 'others':
            this.subcharts = [
            {
              name: 'Radial Progress',
              type: 'radialProgress'
            },
            {
              name: 'Word Cloud',
              type: 'wordCloud'
            },
            {
              name: 'Table View',
              type: 'table'
            },
            {
              name: 'Simple Count',
              type: 'simpleCount'
            },
            {
              name: 'Map View',
              type: 'map'
            }
          ];
          break;
        default:
            this.subcharts = [];
    }
  }

  changeSubChartType(chart) {
    this.changedSubChartType = chart.name;
    if(this.createNew === true){
      this.$rootScope.$broadcast("newVizGraphTypeChanged",{graphName: chart.type});
    } else {
      this.viz.type = chart.type;
    }
    // if (this.changeGraph) {
    // } else {
    //   this.$rootScope.$broadcast("newGraphTypeSet", {graphName: graph});
    // }
  }

  openDialog() {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }
}

export default VizTypeCtrl;
