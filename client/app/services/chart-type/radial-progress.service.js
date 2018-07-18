import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
import HighchartsDrillDown from 'highcharts/modules/drilldown';
import radialProgress from 'radial-progress-chart';
HighchartsMore(Highcharts);
HighchartsDrillDown(Highcharts);

import _ from 'lodash';
import $ from 'jquery';

class RadialProgressService {
  /*@ngInject*/
  constructor(VizpadDataService, DatafileService) {
    this.DatafileService = DatafileService;
  }

  drawChart(viz) {
    let height = $("#viz" + viz.id)
      .height();
    let width = $("#viz" + viz.id)
      .width();

    let selectString = 'avg(' + viz.yAxis.column +')';

    const reqObj = {
      "datasetId": this.DatafileService.fileId, // this.name
      "from": this.DatafileService.fileId,
      "select": selectString,
      "groupBy": viz.xAxis.column,
      "maximumAllowedRows": 100,
      "offset": 0
    }

    this.DatafileService.extendedSqlObj(reqObj).then((success) => {
        console.log("success in radial progress", success)
    }, (error) => {
        console.log("error", error)
    });

    document.getElementById('viz'+viz.id)
      .innerHTML = '';

    let settings = {
        diameter: width * 0.45,
        stroke: {
            width: 20,
            gap: 2
        },
        shadow: {
            width: 4
        },
        min: 0,
        max: 100,
        round: true,
        series: [
            {
                value: 100,
                color: '#fe08b5'
            }
        ],
        center: "test"
    }

  var myChart = new radialProgress("#viz" + viz.id, settings);

  }
}

export default RadialProgressService;
