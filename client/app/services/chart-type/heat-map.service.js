import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
import HighchartsDrillDown from 'highcharts/modules/drilldown';
HighchartsMore(Highcharts);
HighchartsDrillDown(Highcharts);

import _ from 'lodash';
import $ from 'jquery';

class HeatMapService {
  /*@ngInject*/
  constructor(VizpadDataService, DatafileService) {
    this.DatafileService = DatafileService;
  }

  drawChart(viz, data) {
    var test = [];
    var heatMapData = [];
    for (var i = 0; i < data.length; i++) {
      if (i <= 10) {
        test.push(data[i]);
      } else {
        break;
      }
    };

    test = _.uniq(test);

    var tempArr = viz.xAxis.column.split("_");
    var xAxis = tempArr[0];
    var yAxis = viz.yAxis.column;
    var i = 0;

    parentThis.x = [];
    parentThis.y = [];
    angular.forEach(data, function(d) {
      parentThis.x.push(d.Origin);
      parentThis.y.push(d.Dest);
    });

    angular.forEach(parentThis.y, function(y, yKey) {
        angular.forEach(parentThis.x, function(x, xKey) {
          angular.forEach(data, function(data) {
            if (x == data.Origin && y == data.Dest) {
              var tempObj = {
                x: yKey,
                y: xKey,
                value: parseInt(data.Distance_avg)
              }
              heatMapData.push(tempObj);
            };
          })
        })
      })

    heatMapData = _.uniq(heatMapData);
    var chart = new Highcharts.Chart({
      chart: {
        spacingBottom: 10,
        type: 'heatmap',
        height: $("#chart" + viz.id)
          .height() - 60,
        width: $("#chart" + viz.id)
          .width() - 50,
        renderTo: 'viz'+viz.id,
        plotBorderWidth: 1
      },
      credits: {
       enabled: false,
      },
      // title: {
      //     text: viz.id
      // },

      xAxis: {
        categories: parentThis.x,
        min: 0,
        max: parentThis.x.length
      },

      yAxis: {
        categories: parentThis.y,
        min: 0,
        max: parentThis.y.length,
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false
      },
      tooltip: {
        formatter: function() {
          return this.series.yAxis.categories[this.point.row] +
            ': <b>' +
            this.y + ' ' +
            this.series.xAxis.categories[this.point.col].toLowerCase() +
            '</b>';
        }
      },

      colorAxis: {
        stops: [
          [0, '#3060cf'],
          [50, '#fffbbc'],
          [150, '#c4463a']
        ],
        // min: -5
      },

      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
      },


      series: [{
        borderWidth: 0,
        data: heatMapData,

        // valueRanges: [{
        //     to: 1500,
        //     color: 'blue'
        // }, {
        //     from: 1501,
        //     to: 3000,
        //     color: 'black'
        // }, {
        //     from: 3001,
        //     color: 'red'
        // }],

        turboThreshold: 0
      }]
    });
  }
}
export default HeatMapService;
