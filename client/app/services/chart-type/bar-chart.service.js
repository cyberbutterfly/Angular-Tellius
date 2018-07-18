import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
import HighchartsDrillDown from 'highcharts/modules/drilldown';
HighchartsMore(Highcharts);
HighchartsDrillDown(Highcharts);

import _ from 'lodash';
import $ from 'jquery';

class BarChartHorizontal {
  /*@ngInject*/
  constructor(VizpadDataExtendedSqlService, DatafileService, $q, $timeout) {
    this.DatafileService = DatafileService;
    this.VizpadDataExtendedSqlService = VizpadDataExtendedSqlService;
    this.$q = $q;
    this.$timeout = $timeout;
  }

  getData(viz, vizpad) {
    const defer = this.$q.defer();
    this.VizpadDataExtendedSqlService.getData(viz, vizpad).then((success) => {
      defer.resolve(success)
    }, (error) => {
      defer.reject(error);
    });
    return defer.promise;
  }

  getHighchartsObj(viz, vizpad, type) {

    let id, height, width, bgColor;
    id = 'viz' + viz.id;

    const defer = this.$q.defer();


    this.getData(viz, vizpad).then((success) => {
      this.x = [];
      this.y = [];
      this.thirdMeasureData = [];

      angular.forEach(success.data, (d) => {
        this.x.push(d[viz.xAxis.column]);
        this.y.push(parseInt(d[viz.yAxis.column]));
      });

      // console.log("data, this.x, this.y", data, this.x, this.y);

      this.highChartConfigObj = {
        chart: {
          spacingBottom: 10,
          height: $("#chart" + viz.id)
            .height() - 60,
          width: $("#chart" + viz.id)
            .width() - 50,
          type: type,
          color: {
            linearGradient: [0, 0, 0, 300],
            stops: [
              [0, 'rgb(256, 256, 256)'],
              [1, 'rgb(0, 0, 0)']
            ]
          },
        },
        plotOptions: {
          series: {
            stickyTracking: true,
            events: {
              click: (event) => {
                this.DatafileService.selectedColumnValue = event.point.category;
                var top = event.chartY + 8;
                var left = event.chartX - 40;
                $('#' + id)
                  .parent()
                  .find('.pop-up')
                  .removeClass('active');
                this.$timeout(() => {
                  $('#' + id)
                    .parent()
                    .find('.pop-up')
                    .css('top', top)
                    .css('left', left);
                }, 150);
                this.$timeout(() => {
                  this.DatafileService.clickedInside = true;
                  $('#' + id)
                    .parent()
                    .find('.pop-up')
                    .addClass('active')
                }, 250);
              },
              mouseOut: (event) => {
                this.DatafileService.clickedInside = false;
              },
              drilldown: function(e){
              }
            },
          }
        },
        credits: {
         enabled: false,
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: this.x,
        },
        yAxis: {
          title: {
            text: viz.yAxis.column
          }
        },
        series: [{
          name: viz.xAxis.column,
          data: this.y,
          color: viz.colorPaletteDataColors.colors[parseInt(
            viz.colorPaletteDataColors.colors.length / 2
          )]
        }],
      }
      defer.resolve(this.highChartConfigObj);
    }, (error) => {
        console.log("error", error)
      defer.reject(error);
    });
    return defer.promise;
  }

  getStackedBarChartHighchartsObj(viz, vizpad, type) {

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
        colors: viz.colorPaletteDataColors.colors
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

export default BarChartHorizontal;
