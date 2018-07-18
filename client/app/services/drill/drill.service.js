import _ from 'lodash';
import $ from 'jquery';

class DrillService {
	/*@ngInject*/
	constructor(DatafileService, $timeout) {
    this.DatafileService = DatafileService;
    this.$timeout = $timeout;
    this.DatafileService.clickedInside = false;
  }

  getHighchartsObj(viz, responseData) {
    this.x = [];
    this.y = [];
    angular.forEach(responseData.rows, (d) => {
      this.x.push(d[1]);
      this.y.push(parseInt(d[0]));
    });
    // console.log("", );
    if (viz.type == "pie") {
      let data = [];
      for (var i = this.x.length - 1; i >= 0; i--) {
          var tempObj = {
              name:this.x[i],
              y:this.y[i]
          };
          tempObj.name = this.x[i];
          tempObj.y = this.y[i];
          data.push(tempObj);
      };

        var series =  [
          {
              name: viz.drill.drillColumn,
              colorByPoint: true,
              data: data
          }
        ];
      } else {
        var series = [
          {
              name: viz.drill.drillColumn,
              data: this.y,
              color: viz.colorPaletteDataColors.colors[parseInt(viz
                .colorPaletteDataColors.colors.length / 2)]
          }
        ];
      };

      this.highChartConfigObj = {
          chart: {
              type: viz.type,
              color : {
                  linearGradient : [0,0, 0, 300],
                  stops : [
                    [0, 'rgb(256, 256, 256)'],
                    [1, 'rgb(0, 0, 0)']
                  ]
              },
              renderTo: 'viz'+viz.id,
              width: $(".chartcontainer").width()-70,
          },
          plotOptions: {
            series: {
              stickyTracking: true,
              events: {
                click: (event) => {
                  this.DatafileService.selectedColumnValue = event.point.category;
                  var top = event.chartY + 8;
                  var left = event.chartX - 40;
                  $('#viz' + viz.id)
                    .parent()
                    .find('.pop-up')
                    .removeClass('active');
                  this.$timeout(() => {
                    $('#viz' + viz.id)
                      .parent()
                      .find('.pop-up')
                      .css('top', top)
                      .css('left', left);
                  }, 150);
                  this.$timeout(() => {
                    this.DatafileService.clickedInside = true;
                    $('#viz' + viz.id)
                      .parent()
                      .find('.pop-up')
                      .addClass('active')
                  }, 250);
                },
                mouseOut: (event) => {
                  this.DatafileService.clickedInside = false;
                },
              },
            }
          },
          credits: {
           enabled: false,
          },
          title: {
              text: viz.drill.drillFilter == '' ? '' : viz.title + ' where ' +  viz.drill.drillFilter ,
              style: {
                fontSize:'15px',
                fontWeight: '100'
              }
          },
          xAxis: {
              categories: this.x,
          },
          exporting: {
              buttons: {
                 anotherButton: {
                      text: 'Reset',
                      onclick: (e) => {
                          this.popUp(e,'drillDown',viz);
                      }
                  }
              }
          },
          yAxis: {
              title: {
                  text: viz.yAxis.column
              }
          },
          series: series
      };

    return this.highChartConfigObj;
  }
}
export default DrillService;
