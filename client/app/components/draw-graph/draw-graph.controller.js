import d3 from 'd3';
import cloud from 'd3-cloud';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
import radialProgress from 'radial-progress-chart';

import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsDrillDown from 'highcharts/modules/drilldown';
HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);
HighchartsDrillDown(Highcharts);

import _ from 'lodash';
import $ from 'jquery';

class DrawGraph {
  /*@ngInject*/
  constructor($scope, DatafileService) {
    this.DatafileService = DatafileService;
    this.previousHighchartObj = {};
    $scope.$watch(() => {
      // if (typeof this.highchartsObj != "undefined") {
        return this.highchartsObj;
      // }
    }, (oldVal, newVal) => {
      if (typeof this.highchartsObj != "undefined") {
        this.highchartsObj.chart.renderTo = 'viz' + this.viz.id;
        let parentThis = this;
        if (this.viz.drill.drillColumn != '' && this.viz.drill.drillColumn != this.viz.xAxis.column) {
          this.highchartsObj.exporting = {
            buttons: {
              anotherButton: {
                text: 'Reset',
                onclick: function (e) {
                  parentThis.popUp(e,'drillDown',this.viz, this.selectedColumn);
                }
              }
            }
          };
        }
        if (typeof oldVal != "undefined" && typeof newVal != "undefined") {
          if (oldVal.chart.type != newVal.chart.type) {
            let chart = new Highcharts.chart(this.highchartsObj);
          } else if(!(_.isEqual(oldVal.xAxis.categories, newVal.xAxis.categories))) {
            let chart = new Highcharts.chart(this.highchartsObj);
          }
          //  else if(!(_.isEqual(oldVal.series, newVal.series))) {
          //   let chart = new Highcharts.chart(this.highchartsObj);
          // }
        }
        if (typeof newVal == "undefined") {
          let chart = new Highcharts.chart(this.highchartsObj);
        }
      }
    })

  }

  popUp(ev,type) {
    let drillColumn = '';
    switch (type) {
      case "drill":

        if (typeof this.DatafileService.hierarchyArr[this.viz.drill.drillColumnIndex] != "undefined") {
          drillColumn = this.DatafileService.hierarchyArr[this.viz.drill.drillColumnIndex].hierarchy;
        } else {
          drillColumn = this.DatafileService.hierarchyArr[this.DatafileService.hierarchyArr.length - 1].hierarchy;
        }
        if(this.viz.drill.drillColumnIndex == 0)
          this.filter = this.viz.xAxis.column + '=' + "'" + this.DatafileService.selectedColumnValue + "'";
        else
          this.filter = this.filter + ' and ' + this.DatafileService.hierarchyArr[this.viz.drill.drillColumnIndex -1].hierarchy + '=' + "'" + this.DatafileService.selectedColumnValue + "'";
        this.viz.drill.drillFilter = this.filter;
        this.viz.drill.drillColumn = drillColumn;
        this.viz.drill.drillColumnIndex += 1;

      break;

      case "drillDown":
        let drillDownColumn = '';
        this.viz.drill.drillColumnIndex = this.viz.drill.drillColumnIndex -1;
        if (this.viz.drill.drillColumnIndex == 0) {
          drillDownColumn = this.viz.xAxis.column;
          this.filter = '';
        } else if (this.viz.drill.drillColumnIndex != 0 && typeof this.DatafileService.hierarchyArr[this.viz.drill.drillColumnIndex -1] != "undefined") {
          drillDownColumn = this.DatafileService.hierarchyArr[this.viz.drill.drillColumnIndex -1].hierarchy;
          this.filter = this.filter.substring(0, this.filter.lastIndexOf(" and "));
        }
        this.viz.drill.drillFilter = this.filter;
        this.viz.drill.drillColumn = drillDownColumn;
      break;

      case "filter":
        let filterObj = {
          column: this.viz.xAxis.column,
          operator: 'Equal To',
          value: this.DatafileService.selectedColumnValue
        };

        this.vizpad.filters.push(filterObj);
      break;

    }
  }
}

export default DrawGraph;
