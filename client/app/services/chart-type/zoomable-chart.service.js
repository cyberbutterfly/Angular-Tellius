import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
import HighchartsDrillDown from 'highcharts/modules/drilldown';
HighchartsMore(Highcharts);
HighchartsDrillDown(Highcharts);

import _ from 'lodash';
import $ from 'jquery';

class ZoomableChartService {
  /*@ngInject*/
  constructor(VizpadDataExtendedSqlService, $q) {
    this.VizpadDataExtendedSqlService = VizpadDataExtendedSqlService;
    this.$q = $q;
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

  getHighchartsObj(viz, vizpad) {
    const defer = this.$q.defer();

    this.getData(viz, vizpad).then((success) => {
      this.x = [];
      this.y = [];
      this.thirdMeasureData = [];

      angular.forEach(success.data, (d) => {
        this.x.push(d[viz.xAxis.column]);
        this.y.push(parseInt(d[viz.yAxis.column]));
      });


    var chart = new Highcharts.Chart({
      chart: {
        spacingBottom: 10,
        type: 'spline',
        zoomType: 'xy',
        renderTo: 'viz'+viz.id,
        width: $("#chart" + viz.id)
          .width() - 50,
        height: $("#chart" + viz.id)
          .height() - 60,
        color: {
          linearGradient: [0, 0, 0, 300],
          stops: [
            [0, 'rgb(256, 256, 256)'],
            [1, 'rgb(0, 0, 0)']
          ]
        },
      },
      credits: {
       enabled: false,
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: this.x,
        title: {
          text: null
        },
        min: 0,
      },
      yAxis: {
        title: {
          text: viz.yAxis.column
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        },
      },
      series: [{
        name: viz.xAxis.column,
        data: this.y,
        color: viz.colorPaletteDataColors.colors[parseInt(viz
                .colorPaletteDataColors.colors.length / 2)]
      }]
    });
      defer.resolve(this.highChartConfigObj);
    }, (error) => {
       defer.reject(error);
    })
  return defer.promise;
  }
}

export default ZoomableChartService;
