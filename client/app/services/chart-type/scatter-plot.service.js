import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
import HighchartsDrillDown from 'highcharts/modules/drilldown';
HighchartsMore(Highcharts);
HighchartsDrillDown(Highcharts);

import _ from 'lodash';
import $ from 'jquery';

class ScatterPlotService {
  /*@ngInject*/
  constructor(VizpadDataExtendedSqlService, DatafileService, $q) {
    this.DatafileService = DatafileService;
    this.VizpadDataExtendedSqlService = VizpadDataExtendedSqlService;
    this.$q = $q;
  }

  getHighchartsObj(viz, vizpad) {
    const defer = this.$q.defer();

    this.VizpadDataExtendedSqlService.getData(viz, vizpad).then((success) => {
      this.x = [];
      this.y = [];

      angular.forEach(success.data, (d) => {
        this.x.push(d[viz.xAxis.column]);
        this.y.push(parseInt(d[viz.yAxis.column]));
      });
      let highChartConfigObj = {
        chart: {
          spacingBottom: 10,
          height: $("#chart" + viz.id)
            .height() - 60,
          type: 'scatter',
          color: {
            linearGradient: [0, 0, 0, 300],
            stops: [
              [0, 'rgb(256, 256, 256)'],
              [1, 'rgb(0, 0, 0)']
            ]
          },
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
      };
      defer.resolve(highChartConfigObj);
    }, (error) => {
      console.log("error", error)
    });
    return defer.promise;
  }
}

export default ScatterPlotService;
