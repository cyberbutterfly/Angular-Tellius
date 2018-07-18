import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
import HighchartsDrillDown from 'highcharts/modules/drilldown';
HighchartsMore(Highcharts);
HighchartsDrillDown(Highcharts);

import _ from 'lodash';
import $ from 'jquery';

class BubbleChartService {
  /*@ngInject*/
  constructor($q, VizpadDataExtendedSqlService) {
    this.$q = $q;
    this.VizpadDataExtendedSqlService = VizpadDataExtendedSqlService;
  }

  getHighchartsObj(viz, vizpad) {

    let bubbleData = [];
    let tempArr = viz.xAxis.column.split("_");
    let xAxis = tempArr[0];
    let yAxis = viz.yAxis.column;
    const defer = this.$q.defer();

    this.VizpadDataExtendedSqlService.getBubbleGraphData(viz, vizpad).then((success) => {
      let data = success.data;
      angular.forEach(data, function(d) {

        if (parseFloat(d[viz.radius]) !=
          "null" && parseFloat(d[yAxis]) != "null" &&
          parseFloat(d[viz.label]) != "null"
        ) {
          let tempObj = {
            x: parseFloat(d[viz.bubbleAxis].toFixed(2)),
            y: parseFloat(d[yAxis].toFixed(2)),
            z: parseFloat(d[viz.radius].toFixed(2)),
            name: d[viz.label]
          };

          bubbleData.push(tempObj)
        };
      });

     this.highChartConfigObj = {
       chart: {
         spacingBottom: 10,
         height: $("#chart" + viz.id)
           .height() - 60,
         type: viz.type,
         plotBorderWidth: 1,
         zoomType: 'xy',
         renderTo: 'viz'+viz.id,
         width: $("#chart" + viz.id)
           .width() - 50,
       },
       credits: {
        enabled: false,
       },
       title: {
         text: ''
       },
       plotOptions: {
         series: {
           dataLabels: {
             enabled: true,
             format: '{point.name}'
           }
         }
       },
       tooltip: {
         useHTML: true,
              headerFormat: '<table>',
              pointFormat: '<tr><th colspan="2"><h3>{point.name}</h3></th></tr>' +
                  '<tr><th>'+ viz.bubbleAxis +':</th><td>{point.x}</td></tr>' +
                  '<tr><th>'+ viz.yAxis.column +':</th><td>{point.y}</td></tr>' +
                  '<tr><th>'+ viz.radius +':</th><td>{point.z}</td></tr>',
              footerFormat: '</table>',
              followPointer: true
       },
       yAxis: {
          startOnTick: false,
          endOnTick: false,
          title: {
              text: viz.yAxis.column
          }
       },

       series: [{
         name: viz.bubbleAxis,
         data: bubbleData,
         color: viz.colorPaletteDataColors.colors[parseInt(
           viz.colorPaletteDataColors.colors.length / 2
         )]
       }],
     };
      defer.resolve(this.highChartConfigObj);
    }, (error) => {
      defer.reject(error)
    });

    return defer.promise;
  }
}
export default BubbleChartService;
