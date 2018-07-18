import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
import HighchartsDrillDown from 'highcharts/modules/drilldown';
HighchartsMore(Highcharts);
HighchartsDrillDown(Highcharts);

import _ from 'lodash';
import $ from 'jquery';

class PolarChartService {
  /*@ngInject*/
  constructor($q, VizpadDataExtendedSqlService) {
    this.VizpadDataExtendedSqlService = VizpadDataExtendedSqlService;
    this.$q = $q;
  }

  getHighchartsObj(viz, vizpad) {

    let series = [];
    let firstArr = [];
    let secondArr = [];
    let thirdArr = [];

    const defer = this.$q.defer();

    this.VizpadDataExtendedSqlService.getPolarChartData(viz, vizpad).then((success) => {

       let data = success.data;
       let keys = Object.keys(data[0])
       angular.forEach(data, (d) => {
          firstArr.push(d[keys[0]])
          if (d[keys[1]]) {
            secondArr.push(d[keys[1]])
          }
          if (d[keys[2]]) {
            thirdArr.push(d[keys[2]])
          }
       });

       let tempObj = {
         type: 'column',
         name: keys[0],
         data: firstArr,
         pointPlacement: 'between'
       }

       series.push(tempObj);

       if (secondArr.length > 0) {
         let tempObj = {
           type: 'column',
           name: keys[1],
           data: secondArr,
           pointPlacement: 'between'
         }
         series.push(tempObj);
       }

       if (thirdArr.length > 0) {
         let tempObj = {
           type: 'column',
           name: keys[2],
           data: thirdArr,
           pointPlacement: 'between'
         }
         series.push(tempObj);
       }

       this.highChartConfigObj = {
         chart: {
           spacingBottom: 10,
           polar: true,
           renderTo: 'viz'+viz.id,
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
         pane: {
           startAngle: 0,
           endAngle: 360
         },

         xAxis: {
           tickInterval: 30,
           min: 0,
           max: 360,
           labels: {
             formatter: function() {
               return this.value + '°';
             }
           }
         },

         yAxis: {
           min: 0
         },

         plotOptions: {
           series: {
             pointStart: 0,
             pointInterval: 45
           },
           column: {
             pointPadding: 0,
             groupPadding: 0
           }
         },
         series: series,
         colors: viz.colorPaletteDataColors.colors
       };
       defer.resolve(this.highChartConfigObj);

    }, (error) => {
      defer.reject(error)
    });

    return defer.promise;
  }
}
export default PolarChartService;
