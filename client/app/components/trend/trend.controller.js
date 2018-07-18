import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
HighchartsMore(Highcharts);
import moment from 'moment';

class TrendCtrl {
/*@ngInject*/
    constructor($auth, $state, $mdDialog, $mdToast, $filter, $scope, UserService, VizpadDataService, DatafileService) {
        this.VizpadDataService = VizpadDataService;
        this.$mdDialog = $mdDialog;
        this.DatafileService = DatafileService;
        this.x = [];
        this.y = [];
        this.showButton = false;

        var parentThis = this;
        if (this.viz.yAxis.column.indexOf("_") == -1) {
          var yAxis = this.viz.yAxis.column
        } else {
          var yAxis = this.viz.yAxis.column.split("_")[0];
        }


        var requestObj = {
          id: this.DatafileService.fileId,
          functiontype:"aggregate",
          options:{
            groupby: this.viz.xAxis.column + ',' + this.selectedColumn,
            "aggtype-standard": this.viz.yAxis.aggregation,
            "aggregationtypes": this.viz.yAxis.aggregation,
            aggregationcolumns: yAxis
          }
        }

        // this.DatafileService.getFileId(this.DatafileService.filePath,"csv").then(function(response){
          var filter = parentThis.viz.xAxis.column + '=' + "'" + parentThis.selectedValue + "'";
          parentThis.DatafileService.getTransformedData(this.DatafileService.fileId, filter).then(function(success){
            parentThis.DatafileService.getData(success.sourceId).then(function(success){

              angular.forEach(success.data, function(d){

                  parentThis.x.push(moment(d[parentThis.vizpad.timeRange.dateColumn]).format("MM DD YYYY HH mm"));
                  parentThis.y.push(parseInt(d.grid));
              });

              var chart = new Highcharts.Chart({
                  chart: {
                      type: 'line',
                      color : {
                          linearGradient : [0,0, 0, 300],
                          stops : [
                            [0, 'rgb(256, 256, 256)'],
                            [1, 'rgb(0, 0, 0)']
                          ]
                      },
                      renderTo: 'trend-container',
                      width: $(".drill-trend-container").width()-70,
                  },
                  plotOptions: {
                  },
                  title: {
                      text: parentThis.viz.xAxis.column + ' vs ' + parentThis.vizpad.timeRange.dateColumn + ' for ' + parentThis.selectedValue,
                      type: 'datetime',
                      style: {
                        fontSize:'15px',
                        fontWeight: '100'
                      }
                  },
                  xAxis: {
                      categories: parentThis.x,
                  },
                  yAxis: {
                      title: {
                          text: parentThis.viz.yAxis.column
                      }
                  },
                  series: [{
                      name: parentThis.vizpad.timeRange.dateColumn,
                      data: parentThis.y,
                      // color : data.color
                  }],
              });
              parentThis.showButton = true;

            },function(){

            })

          },function(){

        //   })
        // },function(){

      })

    }

    hide() {
      this.$mdDialog.hide();
    }

}

export default TrendCtrl;
