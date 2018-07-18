import Highcharts from 'highcharts';
import $ from 'jquery';

class LineChartService {
  /*@ngInject*/
  constructor($q, VizpadDataService, VizpadDataExtendedSqlService) {
    this.$q = $q;
    this.VizpadDataService = VizpadDataService;
    this.VizpadDataExtendedSqlService = VizpadDataExtendedSqlService;
  }

  getHighchartsObj(viz, vizpad) {

    const defer = this.$q.defer();
    this.VizpadDataExtendedSqlService.getMultipleLineVizData(viz, vizpad).then((success) => {

      let xCategories = [];
      let yData = [];
      let secondYData = [];
      angular.forEach(success.rows, (r) => {
          xCategories.push(r[0]);
          yData.push(parseInt(r[1]));
          secondYData.push(parseInt(r[2]));
      });
      let index = $("#viz" + viz.id)
        .attr('data-highcharts-chart');
      let oldChart = Highcharts.charts[index];
      oldChart.destroy();
      this.highChartConfigObj = {
        chart: {
          spacingBottom: 10,
          zoomType: 'xy',
          renderTo: 'viz'+viz.id,
          width: $("#chart" + viz.id)
            .width() - 50,
          height: $("#chart" + viz.id)
            .height() - 50,
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
            text: null
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
                text: viz.lineThirdMeasure.column,
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
          name: viz.lineThirdMeasure.column,
          yAxis: 1,
          type: 'line',
          data: secondYData,
          color: viz.colorPaletteDataColors.colors[4]
        }, {
          name: viz.yAxis.column,
          type: 'line',
          data: yData,
          color: viz.colorPaletteDataColors.colors[2]
        }]
      };
      defer.resolve(this.highChartConfigObj);
    }, (error) => {
      defer.reject(error);
    });
    return defer.promise;
  }

}

export default LineChartService;
