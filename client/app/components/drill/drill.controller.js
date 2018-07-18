import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
HighchartsMore(Highcharts);

class DrillCtrl {
    /*@ngInject*/
    constructor($auth, $state, $mdToast, $mdDialog, $filter, $scope, UserService, VizpadDataService, DatafileService) {
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

        this.DatafileService.getAggregatedId(requestObj).then(function(response){
          var filter = parentThis.viz.xAxis.column + '=' + "'" + parentThis.selectedValue + "'";
          parentThis.DatafileService.getTransformedData(response.id, filter).then(function(success){
            parentThis.DatafileService.getData(success.sourceId).then(function(success){
              console.log("success",success);

              var arr = Object.keys(success.data[0]);

              angular.forEach(success.data, function(d){
                  parentThis.x.push(d[arr[1]]);
                  parentThis.y.push(parseInt(d[arr[2]]));
              });
              if (parentThis.viz.type == "pie") {
                let data = [];
                for (var i = parentThis.x.length - 1; i >= 0; i--) {
                    var tempObj = {
                        name:'',
                        y:0
                    };
                    tempObj.name = parentThis.x[i];
                    tempObj.y = parentThis.y[i];
                    data.push(tempObj);
                };


                var series =  [
                  {
                      name: parentThis.selectedColumn,
                      colorByPoint: true,
                      data: data
                  }
                ];
              } else {
                var series = [
                  {
                      name: parentThis.selectedColumn,
                      data: parentThis.y,
                      // color : data.color
                  }
                ];
              };

              var chart = new Highcharts.Chart({
                  chart: {
                      type: parentThis.viz.type,
                      color : {
                          linearGradient : [0,0, 0, 300],
                          stops : [
                            [0, 'rgb(256, 256, 256)'],
                            [1, 'rgb(0, 0, 0)']
                          ]
                      },
                      renderTo: 'drill-container',
                      width: $(".chartcontainer").width()-70,
                  },
                  plotOptions: {
                  },
                  credits: {
                   enabled: false,
                  },
                  title: {
                      text: parentThis.viz.title + ' for ' + parentThis.selectedColumn + ' = ' + parentThis.selectedValue ,
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
                  series: series
              });
              parentThis.showButton = true;
            },function(){

            })

          },function(){

          })
        },function(){

      })

    }
    hide() {
      this.$mdDialog.hide();
    }

}

export default DrillCtrl;
