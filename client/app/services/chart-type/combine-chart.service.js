import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
import HighchartsDrillDown from 'highcharts/modules/drilldown';
HighchartsMore(Highcharts);
HighchartsDrillDown(Highcharts);

import $ from 'jquery';

class CombineChartService {
  /*@ngInject*/
  constructor(VizpadDataExtendedSqlService, $q) {
    this.VizpadDataExtendedSqlService = VizpadDataExtendedSqlService;
    this.$q = $q;
  }
  getHighchartsObj(viz, vizpad) {
    const defer = this.$q.defer();

    let type,secondType;

    if(viz.type == 'combineBarChart'){
      type = 'line';
      secondType = 'bar';
    }
    if(viz.type == 'combineColChart' || viz.type == 'combineBarStacked') {
      type = 'line';
      secondType = 'column'
    }

    console.log("viz and type", viz, type);

    this.VizpadDataExtendedSqlService.getCombineChartData(viz, vizpad).then((success) => {
      let xCategories = [];
      let vizData = [];
      let compareData = [];

      angular.forEach(success.vizData.data, (d) => {
         xCategories.push(d[viz.xAxis.column]);
         vizData.push(d[viz.yAxis.column]);
      });

      angular.forEach(success.comparedData.data, (d) => {
         compareData.push(d[viz.combinedGraphMeasure.column]);
      })


      this.highChartConfigObj = {
        chart: {
          spacingBottom: 10,
          width: $("#chart" + viz.id)
            .width() - 50,
          height: $("#chart" + viz.id)
            .height() - 60,
        },
        credits: {
         enabled: false,
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: xCategories,
          crosshair: true,
          title: {
            text: viz.xAxis.column
          }
        },
        yAxis: [{
            labels: {
              format: '{value}',
              style: {
                  color: viz.colorPaletteDataColors.colors[2]
              }
            },
            title: {
              text: viz.yAxis.column,
              style: {
                  color: viz.colorPaletteDataColors.colors[2]
              }
            }
          }, {
            title: {
                text: viz.combinedGraphMeasure.column,
                style: {
                    color: viz.colorPaletteDataColors.colors[4]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: viz.colorPaletteDataColors.colors[4]
                }
            },
            opposite: true
        }],
        tooltip: {
          shared: true
        },
        legend: {
          enabled: false
        },
        series: [{
          name: viz.combinedGraphMeasure.column,
          yAxis: 1,
          type: secondType,
          data: compareData,
          color: viz.colorPaletteDataColors.colors[2]
        }, {
          name: viz.yAxis.column,
          type: type,
          data: vizData,
          color: viz.colorPaletteDataColors.colors[4]
        }]
      };

      defer.resolve(this.highChartConfigObj);
    }, (error) => {

    });

    return defer.promise;
  }

  getStackedBarChartHighchartsObj(viz, vizpad) {

    var stackedGraphData = [];
    var subData = [];

    const defer = this.$q.defer();

    this.VizpadDataExtendedSqlService.getStackedChartData(viz,vizpad).then((success) => {
      stackedGraphData = this.stackColumnProcessData(viz, success.data);

      this.highChartConfigObj = {
        chart: {
          spacingBottom: 10,
          height: $("#chart" + viz.id)
            .height() - 60,
          type: type,
          width: $("#chart" + viz.id)
            .width() - 50,
        },
        credits: {
         enabled: false,
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: stackedGraphData.xCategories,
        },
        yAxis: {
          title: {
            text: viz.yAxis.column
          }
        },
        legend: {
          reversed: true,
          title: {
            text: viz.color
          }
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        xAxis: {
          title: {
            text: viz.xAxis.column
          }
        },
        series: stackedGraphData,
        colors: viz.colorPaletteDataColors.colors,
      };

      defer.resolve(this.highChartConfigObj);

    }, (error) => {
        console.error('error',error);
    });
    return defer.promise;
  }

  stackColumnProcessData(viz, data) {

    var parentThis = this;
    var stackedGraphData = [];
    var subData = [];
    let xCategories = [];
    this.stackedColumnData = [];
    angular.forEach(data, function(d) {
      if (subData.indexOf(d[viz.color]) == -1) {
        subData.push(d[viz.color]);
      }
      xCategories.push(d[viz.xAxis.column]);
    });

    angular.forEach(subData, (d) => {
      let tempObj = {
        name: d,
        data: []
      }
      angular.forEach(data, (r) => {
        if (r[viz.color] == d) {
          var colValue = viz.yAxis.column;
          if(typeof r[colValue] == 'undefined' || r[colValue] == 'undefined') {
            tempObj.data.push(parseFloat(r[colValue + '_avg']));
          }
          else{
            tempObj.data.push(parseFloat(r[colValue]));
          }
        };
      });
      stackedGraphData.push(tempObj);
    });

    stackedGraphData.xCategories = xCategories;
    return stackedGraphData;
  }

}

export default CombineChartService;
