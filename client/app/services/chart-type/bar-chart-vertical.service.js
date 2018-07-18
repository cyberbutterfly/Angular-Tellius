import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
import HighchartsDrillDown from 'highcharts/modules/drilldown';
HighchartsMore(Highcharts);
HighchartsDrillDown(Highcharts);

import _ from 'lodash';
import $ from 'jquery';

class BarChartVertical {
  /*@ngInject*/
  constructor(VizpadDataExtendedSqlService, DatafileService) {
    this.DatafileService = DatafileService;
    this.VizpadDataExtendedSqlService = VizpadDataExtendedSqlService;
  }

  getData(viz, vizpad) {
    this.VizpadDataExtendedSqlService.getData(viz, vizpad).then((success) => {
      // this.drawChart(viz, data)
      console.log("in success of getData", success);
    }, (error) => {
        console.log("error", error)
    });
  }

  drawChart(viz, data) {

    let bubbleData = [];
    let tempArr = viz.xAxis.column.split("_");
    let xAxis = tempArr[0];
    let yAxis = viz.yAxis.column;
    angular.forEach(data, function(d) {

      if (parseFloat(d[viz.radius]) !=
        "null" && parseFloat(d[yAxis]) != "null" &&
        parseFloat(d[viz.label]) != "null"
      ) {
        let tempObj = {
          x: parseFloat(d[viz.bubbleAxis]),
          y: parseFloat(d[yAxis]),
          z: parseFloat(d[viz.radius]),
          name: d[viz.label]
        };

        bubbleData.push(tempObj)
      };
    });

   var chart = new Highcharts.Chart({
     chart: {
       spacingBottom: 10,
       height: $("#chart" + viz.id)
         .height() - 60,
       type: viz.type,
       color: {
         linearGradient: [0, 0, 0, 300],
         stops: [
           [0, 'rgb(256, 256, 256)'],
           [1, 'rgb(0, 0, 0)']
         ]
       },
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
                '<tr><th>'+ viz.bubbleAxis +':</th><td>{point.x}g</td></tr>' +
                '<tr><th>'+ viz.yAxis.column +':</th><td>{point.y}g</td></tr>' +
                '<tr><th>'+ viz.radius +':</th><td>{point.z}%</td></tr>',
            footerFormat: '</table>',
            followPointer: true
     },

     series: [{
       name: viz.xAxis.column,
       data: bubbleData,
       color: {
         linearGradient: [0, 0, 0, 300],
         stops: [
           [0, '#00C3DB'],
           [1, '#5867C3'],
         ]
       },
     }],
   });

  }
}

export default BarChartVertical;
