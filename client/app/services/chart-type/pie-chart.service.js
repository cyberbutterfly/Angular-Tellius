import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
import HighchartsDrillDown from 'highcharts/modules/drilldown';
HighchartsMore(Highcharts);
HighchartsDrillDown(Highcharts);

import _ from 'lodash';
import $ from 'jquery';

class PieChartService {
  /*@ngInject*/
  constructor(VizpadDataExtendedSqlService, $q) {
    this.$q = $q;
    this.VizpadDataExtendedSqlService = VizpadDataExtendedSqlService;
  }

  getHighchartsObj(viz, vizpad) {
    let data = [];
    const defer = this.$q.defer();

    this.VizpadDataExtendedSqlService.getData(viz, vizpad).then((success) => {
      this.x = [];
      this.y = [];

      angular.forEach(success.data, (d) => {
        this.x.push(d[viz.xAxis.column]);
        this.y.push(parseInt(d[viz.yAxis.column]));
      });
      for (var i = this.x.length - 1; i >= 0; i--) {
        var tempObj = {
          name: '',
          y: 0
        };
        tempObj.name = this.x[i];
        tempObj.y = this.y[i];
        data.push(tempObj);
      };

      this.highChartConfigObj = {
        chart: {
          spacingBottom: 10,
          height: $("#chart" + viz.id)
            .height() - 60,
          width: $("#chart" + viz.id)
            .width() - 50,
          type: viz.type,
          renderTo: 'viz'+viz.id,
        },
        credits: {
         enabled: false,
        },
        title: {
          text: ''
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: 'black'
              }
            }
          },
          series: {
            stickyTracking: true,
          }
        },

        series: [{
          name: viz.xAxis.column,
          colorByPoint: true,
          data: data
        }]
      };
      defer.resolve(this.highChartConfigObj);
    }, (error) => {
      defer.reject(error);
    });
    return defer.promise;
  }
}

export default PieChartService;
