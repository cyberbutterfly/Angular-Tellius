import $ from 'jquery';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
HighchartsMore(Highcharts)
// import radialProgress from '../../scripts/radial-progress';
// radialProgress(d3);

class VizCtrl {
    /*@ngInject*/
    constructor(VizpadDataService, $q, ThemeColorPaletteService, $location, $rootScope, $window, $scope, DatasetStorageService,
      DatafileService, $timeout, UserService, $http, VizpadDataExtendedSqlService, CombineChartService, ConfidenceIntervalService) {
        this.VizpadDataService = VizpadDataService;
        this.$location = $location;
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.$scope = $scope;
        this.DatafileService = DatafileService;
        this.ThemeColorPaletteService = ThemeColorPaletteService;
        this.CombineChartService = CombineChartService;
        this.ConfidenceIntervalService = ConfidenceIntervalService;
        this.VizpadDataExtendedSqlService = VizpadDataExtendedSqlService;
        this.$timeout = $timeout;
        this.UserService = UserService;
        this.$http = $http;
        this.$q = $q;
        this.filePath = this.DatafileService.filePath;
        this.x = [];
        this.y = [];
        var parentThis = this;
        this.testNum = 0;
        this.loading = true;
        this.state = {

            'viztype' : false,

            'legends' : false,

            'filter' : false,

            'settings' : false,

        };
        this.DatafileService.listColumns();
        DatasetStorageService.on('DATASET_DID_CHANGE', function(){
         parentThis.DatafileService.listColumns(true);
         parentThis.xColumns = parentThis.DatafileService.xColumns;
         parentThis.yColumns = parentThis.DatafileService.yColumns;
        });
        this.ThemeColorPaletteService.getLightTheme();
        this.vizId = this.$location.path().split('viz/')[1]; // use state here
        $timeout(function(){

            parentThis.VizpadDataExtendedSqlService.getVizObj(parentThis.vizId).then(function(success){
                parentThis.viz = success;

                parentThis.VizpadDataExtendedSqlService.getSelectedVizData(parentThis.viz).then(function(success){

                    var arr = Object.keys(success.data[0]);
                    angular.forEach(success.data, function(d){
                        parentThis.x.push(d[arr[0]]);
                        parentThis.y.push(parseInt(d[arr[1]]));
                    });
                    parentThis.viz.xAxis.column = arr[0];
                    parentThis.viz.yAxis.column = arr[1];
                    parentThis.loading = false;
                    parentThis.$scope.$watch(function(){
                        return parentThis.viz;
                    },function(){
                        parentThis.showChart();
                    });
                },function(error){
                    console.log('error in VizpadDataExtendedSqlService.getVizData', error);
                });
            }, function(error){
              console.log('error in VizCtrl', error);
            });
        });

        $scope.$watch(function() {
          if(parentThis.viz != 'undefined' && typeof parentThis.viz != 'undefined')
            return parentThis.viz.third_column;
        }, function() {
          if(parentThis.viz != 'undefined' && typeof parentThis.viz != 'undefined') {
            if (typeof parentThis.viz["third_column"] != "undefined")
              parentThis.showChart();
          }
        });

        $scope.$watch(function() {
          if(parentThis.viz != 'undefined' && typeof parentThis.viz != 'undefined')
            return parentThis.viz["stack_by"];
        }, function() {
          if(typeof parentThis.viz != 'undefined') {
            if (typeof parentThis.viz["stack_by"] != "undefined" && parentThis.viz.type != "combineBarStacked" && parentThis.viz["stack_by"] != null) {
              parentThis.stackChartByColumn();
            }
            if (typeof parentThis.viz["stack_by"] != "undefined" && parentThis.viz.type == "combineBarStacked" && parentThis.viz["stack_by"] != null) {
              parentThis.CombineChartService.drawStackedChart(parentThis.filePath);
            }
          }
        });

        $scope.$on("compareWithAdded", function(event, args) {
          args.viz.loading = true;
          parentThis.compareWith(args.viz);
        });

        $scope.$on("vizFilterAdded", function(event, args) {
          args.vizObj.loading = true;
          var key = -1;
          var index = $("#" + args.vizObj.id)
            .attr('data-highcharts-chart');
          var chart = Highcharts.charts[index];
          angular.forEach(chart.xAxis[0].categories, function(x, k) {

            if (x == args.filter.value) {
              key = k;
            };
          });

          if (key > -1) {
            args.vizObj.loading = false;
            angular.forEach(chart.series[0].data, function(c, k) {
              c.color = args.vizObj.colorPaletteDataColors.colors[2];
            })
            chart.series[0].data[key].update({
              color: args.vizObj.colorPaletteDataColors.colors[
                parseInt(args.vizObj.colorPaletteDataColors.colors
                  .length - 3)]
            });
            chart.redraw();
            var filterExist = parentThis.checkIfFilterExist(args.vizObj
              .filters, args.filter);
            if (!filterExist)
              args.vizObj.filters.push(args.filter);
          } else {
            parentThis.addVizFilter(args.filter, args.vizObj);
          }
        });

        $scope.$on("axesChanged",function(event, args){
            parentThis.loading = true;
            parentThis.changeAxes(args.xAxis,args.yAxis, args.vizObj);
        });

        $scope.$on("colorPaletteChanged", function(event, args) {
          if (parentThis.viz.type == 'combineBarChart' || parentThis.viz.type == 'combineColChart') {
            if(parentThis.viz.secondType != 'undefined' && typeof parentThis.viz.secondType != 'undefined') {
              parentThis.CombineChartService.drawChart(parentThis.viz, parentThis.x, parentThis.y, parentThis.secondY, false);
            }
          } else {
            parentThis.loading = true;
            parentThis.showChart(args.colorPalette);
          }
        });

        $scope.$on("themeColorPaletteChanged",function(event, args){
            if(args.value == 'dark') {
                parentThis.ThemeColorPaletteService.getDarkTheme();
                parentThis.showChart();
            }
            if(args.value == 'sand' || args.value == 'default') {
                parentThis.ThemeColorPaletteService.getLightTheme();
                parentThis.showChart();
            }
        });

        $timeout(function(){
            angular.element($window).bind('resize', function() {
                var index=$("#viz"+parentThis.viz.id).attr('data-highcharts-chart');
                var chart= Highcharts.charts[index];
                chart.setSize($("#viz-wrapper"+parentThis.viz.id).width()-50, $("#viz-wrapper"+parentThis.viz.id).height()-50);
                chart.reflow();
            });

            $scope.$watch(function(){
                if (typeof parentThis.viz != "undefined" && typeof parentThis.viz.type != "undefined")
                    return parentThis.viz.type;
            },function(){
                if (parentThis.testNum>0) {
                  if(parentThis.viz.type == 'combineBarChart' && typeof parentThis.viz.firstType != 'undefined'){
                    parentThis.viz.secondType = 'bar';
                  }
                  if(parentThis.viz.type == 'combineColChart' && typeof parentThis.viz.firstType != 'undefined') {
                    parentThis.viz.secondType = 'column';
                  }

                  if (parentThis.viz.type == "polar" || parentThis.viz.type ==
                    "heatmap" || parentThis.viz.type == "combineBarChart" || parentThis.viz.type == "combineColChart") {

                    parentThis.state.viztype = false;
                    parentThis.state.settings = true;

                    parentThis.showDropdown = "settings";
                  }
                };
                if (typeof parentThis.viz != "undefined" && typeof parentThis.viz.type != "undefined")
                  parentThis.showChart();
                parentThis.testNum++;
            });
        });
    }

    compareWith(viz) {
      var parentThis = this;
      this.secondY = [];
      this.x = [];
      this.y = [];
      this.VizpadDataService.getVizData(this.filePath, viz, parentThis.vizpad)
        .then(function(success) {
        var arr = Object.keys(success.data[0]);
        angular.forEach(success.data, function(d) {
          parentThis.x.push(d[arr[0]]);
          parentThis.y.push(parseInt(d[arr[1]]));
        });
        viz.xAxis.column = arr[0];
        viz.yAxis.column = arr[1];
        var tempViz = angular.copy(viz);
        tempViz.yAxis.column = viz.yAxis.secondColumn;
        parentThis.VizpadDataService.getVizData(parentThis.filePath, tempViz,
          parentThis.vizpad)
        .then(function(success) {
          var arr = Object.keys(success.data[0]);
          angular.forEach(success.data, function(d) {
            parentThis.secondY.push(parseInt(d[arr[1]]));
          });
          parentThis.viz.yAxis.secondColumn = arr[1];
          parentThis.CombineChartService.drawChart(viz, parentThis.x, parentThis.y, parentThis.secondY, false);
          parentThis.viz.loading = false;
        }, function(error) {
          parentThis.ErrorHandlerService.error(error);
        });

      }, function(error) {
        parentThis.ErrorHandlerService.error(error);
      });

    }

    addVizFilter(filter, viz) {
      var parentThis = this;
      var data = {
        x: [],
        y: []
      }
      this.VizpadDataExtendedSqlService.addFilter(filter, 'viz', viz, this.vizPad)
       .then(function(success) {
          parentThis.viz.loading = false;
          var arr = Object.keys(success.data[0]);

          var yAxis = arr[1];

          angular.forEach(success.data, function(d) {
            data.x.push(d[arr[0]]);
            data.y.push(parseInt(d[arr[2]]));
          });

          parentThis.drawChartWithData(data, viz);

          viz.xAxis.column = arr[0];
          viz.yAxis.column = arr[1];

        }, function(error) {
          parentThis.ErrorHandlerService.error(error);
        })
    }


    drawChartWithData(data, viz) {
      var parentThis = this;
      var tempData = [];
      if (viz.type == "pie") {
        for (var i = data.x.length - 1; i >= 0; i--) {
          var tempObj = {
            name: '',
            y: 0
          };
          tempObj.name = data.x[i];
          tempObj.y = data.y[i];
          tempData.push(tempObj);
        };
      data = tempData;
      var chart = new Highcharts.Chart({
        chart: {
          spacingBottom: 10,
          height: $("#viz-wrapper" + viz.id).height()-50,
          width: $("#viz-wrapper" + viz.id).width()-50,
          type: parentThis.viz.type,
          renderTo: 'viz'+viz.id,
        },
        title: {
          text: ''
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: 'black'
              }
            }
          },
          series: {
            stickyTracking: true,
            events: {
              click: function(event) {
                parentThis.selectedColumnValue = event.point.name;
                var top = event.chartY + 8;
                var left = event.chartX - 40;
                $('#viz' + parentThis.viz.id)
                  .parent()
                  .find('.pop-up')
                  .removeClass('active');
                parentThis.$timeout(function() {
                  $('#viz' + parentThis.viz.id)
                    .parent()
                    .find('.pop-up')
                    .css('top', top)
                    .css('left', left);
                }, 150);
                parentThis.$timeout(function() {
                  parentThis.clickedInside = true;
                  $('#viz' + parentThis.viz.id)
                    .parent()
                    .find('.pop-up')
                    .addClass('active')
                }, 250);
              },
              mouseOut: function(event) {
                parentThis.clickedInside = false;
              },
            },
          }
        },
        credits: {
         enabled: false,
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: data.x,
        },
        yAxis: {
          title: {
            text: viz.yAxis.column
          }
        },
        series: [{
          name: parentThis.viz.xAxis.column,
          colorByPoint: true,
          data: data
        }]
      });
      } else {
        var chart = new Highcharts.Chart({
          chart: {
            spacingBottom: 10,
            type: viz.type,
            height: $("#viz-wrapper"+viz.id).height()-50,
            width: $("#viz-wrapper"+viz.id).width()-50,
            color: {
              linearGradient: [0, 0, 0, 300],
              stops: [
                [0, 'rgb(256, 256, 256)'],
                [1, 'rgb(0, 0, 0)']
              ]
            },
            renderTo: 'viz'+viz.id
          },
          plotOptions: {
            series: {
              stickyTracking: true,
              events: {
                click: function(event) {
                  parentThis.selectedColumnValue = event.point.category;
                  var top = event.chartY + 8;
                  var left = event.chartX - 40;
                  $('#viz' + viz.id)
                    .parent()
                    .find('.pop-up')
                    .removeClass('active');
                  parentThis.$timeout(function() {
                    $('#viz' + viz.id)
                      .parent()
                      .find('.pop-up')
                      .css('top', top)
                      .css('left', left);
                  }, 120);
                  parentThis.$timeout(function() {
                    parentThis.clickedInside = true;
                    $('#viz' + viz.id)
                      .parent()
                      .find('.pop-up')
                      .addClass('active')
                  }, 200);
                },
                mouseOut: function(event) {
                  parentThis.clickedInside = false;
                },
              },
            }
          },
          title: {
            text: ''
          },
          xAxis: {
            categories: data.x,
          },
          yAxis: {
            title: {
              text: viz.yAxis.column
            }
          },
          series: [{
            name: viz.xAxis.column,
            data: data.y,
            color: viz.colorPaletteDataColors.colors[parseInt(parentThis.viz
              .colorPaletteDataColors.colors.length / 2)]
          }],
        });
      }
      // chart.redraw();
    }

    toggleState(state) {
        var parentThis = this;
        for(var propt in this.state){
            if (propt === state && !this.state[propt]) {
                this.state[propt] = true;
                parentThis.showDropdown = propt;
            } else {
                if (propt === state && this.state[propt]) {
                    parentThis.showDropdown = 0;
                    this.state[propt] = false;
                } else {
                    this.state[propt] = false;
                }
            }
        }
        if (state == 'download') {
            parentThis.showDropdown = state;
        }
        this.showSubnav(this.showDropdown);
    }

    showSubnav(x){
        var parentThis = this;
        if (x === '0' || x === 0) {
            for(var propt in this.state){
                this.state[propt] = false;
            }
        }
        parentThis.showDropdown = x;
        parentThis.$rootScope.$broadcast('dropDownStateChanged',{showDropdown: parentThis.showDropdown});

    };

    vizTitleChanged(ev) {
      var parentThis = this;
      var newVizTitle = $(ev.target).text();
      if(newVizTitle != parentThis.viz.title) {
        parentThis.viz.title = newVizTitle;
        parentThis.viz.vizTitleChanged = true;
      }
    }

    stackChartByColumn() {
      // this.loading = true;
      var parentThis = this;
      var stackedGraphData = [];
      var subData = [];
      this.viz.subData = [];
      this.viz.allLegends = [];
      this.viz.stackedColumnData = [];
      this.DatafileService.getFileId(this.filePath, "csv")
        .then(function(success) {
          var arr = parentThis.viz.yAxis.column;
          let req = {
            "id": success.id,
            "functiontype": "aggregate",
            "options": {
              "groupby": parentThis.viz.xAxis.column + ',' + parentThis.viz[
                'stack_by'],
              "aggregationtypes": parentThis.viz.yAxis.aggregation,
              "aggtype-standard": parentThis.viz.yAxis.aggregation,
              "aggregationcolumns": parentThis.viz.yAxis.column.split("_")[
                0] + ',' + parentThis.viz['stack_by'],
            }
          }
          parentThis.DatafileService.getAggregatedData(req)
            .then(function(response) {
              parentThis.viz.stackedColumnData = response.data;
              parentThis.stackColumnProcessData(response.data);
              angular.forEach(response.data, function(d) {
                if (subData.indexOf(d.DayOfWeek) == -1) {
                  subData.push(d.DayOfWeek);
                  parentThis.viz.subData.push(d.DayOfWeek);
                  parentThis.viz.allLegends.push(d.DayOfWeek);
                }
              });

              parentThis.viz.loading = false;

              parentThis.viz.legendsArr = subData;
              // parentThis.viz.allLegends = subData;
            }, function(error) {
              console.log('error in DatafileService.getAggregatedData');
            });
        }, function(error) {
          console.log('error in DatafileService.getFileId');
        })

    }

    stackColumnProcessData(data) {

      var parentThis = this;
      var stackedGraphData = [];
      var subData = [];
      this.viz.subData = [];
      this.stackedColumnData = [];
      angular.forEach(data, function(d) {
        if (subData.indexOf(d.DayOfWeek) == -1) {
          subData.push(d.DayOfWeek);
          parentThis.viz.subData.push(d.DayOffWeek);
        }
      });

      // parentThis.viz.legendsArr = subData;
      // parentThis.viz.allLegends = subData;

      angular.forEach(subData, function(d) {
        let tempObj = {
          name: d,
          data: []
        }
        angular.forEach(data, function(r) {
          if (r.DayOfWeek == d) {
            var colValue = parentThis.viz.yAxis.column;
            if(typeof r[colValue] == 'undefined' || r[colValue] == 'undefined') {
              tempObj.data.push(parseFloat(r[colValue + '_avg']));
            }
            else{
              tempObj.data.push(parseFloat(r[colValue]));
            }
          };
        });
        stackedGraphData.push(tempObj);
      });
      var chart = new Highcharts.Chart({
        chart: {
          spacingBottom: 10,
          height: $("#viz-wrapper"+parentThis.viz.id).height()-50,
          width: $("#viz-wrapper"+parentThis.viz.id).width()-50,
          type: parentThis.viz.type,
          renderTo: 'viz'+parentThis.viz.id,
        },
        credits: {
         enabled: false,
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: parentThis.x,
        },
        yAxis: {
          title: {
            text: parentThis.viz.yAxis.column
          }
        },
        legend: {
          reversed: true
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        series: stackedGraphData,
      });

      parentThis.$scope.$watchCollection(function() {
        return parentThis.viz.legendsArr;
      }, function() {
        var arr = _.difference(parentThis.viz.allLegends, parentThis.viz.legendsArr);
        for (var i = chart.series.length - 1; i >= 0; i--) {
          var isRemoved = _.find(arr, function(a) {
            return chart.series[i].name == a;
          });

          if (isRemoved) {
            chart.series[i].hide();
          } else if (!isRemoved && !chart.series[i].visible) {
            chart.series[i].show();
          }
        };

      }, true);
    }

    changeAxes(xAxis,yAxis, vizObj) {
        var parentThis = this;
        this.VizpadDataExtendedSqlService.changeAxes(xAxis,yAxis, vizObj).then(function(success){
            parentThis.loading = false;
            var arr = Object.keys(success.data[0]);

            parentThis.x = [];
            parentThis.y = [];

            angular.forEach(success.data, function(d){
                parentThis.x.push(d[arr[0]]);
                parentThis.y.push(parseInt(d[arr[1]]));
            });

            parentThis.viz.xAxis.column = arr[0];
            parentThis.viz.yAxis.column = arr[1];

            parentThis.showChart();

        },function(error){
          console.log('error in changeAxes');
        });
    }

    getSimpleCountData() {
      var parentThis = this;
      var wordCloudData = [];

      var defer = this.$q.defer();

      this.DatafileService.getFileId(this.filePath, "csv")
        .then(function(success) {
          var arr = parentThis.viz.yAxis.column.split("_");

          let req = {
            "id": success.id,
            "viewtype": "colstats",
            "options": {
              "columnnames": arr[0]
            }
          }
          parentThis.DatafileService.getColStats(req)
            .then(function(response) {
              parentThis.simpleCountValue = response.colstats[0][parentThis
                .viz.yAxis.aggregation
              ];
              // parentThis.simpleCountLabel = parentThis.viz['x-axis'];
              // defer.resolve(wordCloudData);
            }, function(error) {
              defer.reject();
            });
        }, function(error) {
          defer.reject();
        });

      return defer.promise;
    }

    updateViz() {
        var parentThis = this;
        var canvas = document.createElement('canvas');
        var svg = $("#viz"+parentThis.viz.id).find('svg')[0];
        var svgData = new XMLSerializer().serializeToString(svg);
        var svgSize = svg.getBoundingClientRect();
        canvas.width = svgSize.width;
        canvas.height = svgSize.height;
        var ctx = canvas.getContext('2d');

        // var img = document.body.appendChild(canvas);

        var img = document.createElement('img');
        img.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData))));

        ctx.drawImage(img, 0, 0);
        var vizImage = canvas.toDataURL('image/png');

        var fd = new FormData();
        var blob = new Blob([vizImage], { type : "image/png"});
        fd.append("thumbnail", blob);
        img.remove();

        parentThis.$http.post('http://52.4.36.178:8080/thumbnail',fd , {
          withCredentials: true,
          transformRequest: angular.identity,
          headers : {'Content-Type': undefined},
        })
        .success(function(response){
          if(parentThis.viz.yAxis.column.indexOf('_') > -1) {
            parentThis.viz.yAxis.column = parentThis.viz.yAxis.column.split('_')[0];
          }
          var updateObj;
          if(parentThis.viz.vizTitleChanged == true) {
            updateObj = {
              "title": parentThis.viz.title,
              "dataId": parentThis.viz.dataId,
              "type": parentThis.viz.type,
              "xAxis": parentThis.viz.xAxis,
              "yAxis": parentThis.viz.yAxis,
              "colorPaletteDataColors": parentThis.viz.colorPaletteDataColors.id,
              // "colorPaletteThemeColors": parentThis.viz.colorPaletteThemeColors,
              "filters": parentThis.vizFilters,
              "timeRange": parentThis.viz.timeRange,
              "thumbnail": response,
            };
          } else {
            updateObj = {
              "dataId": parentThis.viz.dataId,
              "type": parentThis.viz.type,
              "xAxis": parentThis.viz.xAxis,
              "yAxis": parentThis.viz.yAxis,
              "colorPaletteDataColors": parentThis.viz.colorPaletteDataColors.id,
              // "colorPaletteThemeColors": parentThis.viz.colorPaletteThemeColors,
              "filters": parentThis.vizFilters,
              "timeRange": parentThis.viz.timeRange,
              "thumbnail": response,
            };
          }
          parentThis.VizpadDataExtendedSqlService.updateViz(updateObj, parentThis.viz.id).then(function(success){

          }, function(error){
            console.log('error update vizzzzz');
          });
        })
        .error(function(){
        });
    }

    showChart(args) {

      var parentThis = this;
      var data = [];
      switch(this.viz.type) {
        case "pie" :
            for (var i = this.x.length - 1; i >= 0; i--) {
                var tempObj = {
                  name:'',
                  y:0
                };
                tempObj.name = this.x[i];
                tempObj.y = this.y[i];
                data.push(tempObj);
            };

            var chart = new Highcharts.Chart({
                chart: {
                    spacingBottom: 10,
                    height: $("#viz-wrapper"+parentThis.viz.id).height()-50,
                    width: $("#viz-wrapper"+parentThis.viz.id).width()-50,
                    type: parentThis.viz.type,
                    renderTo: 'viz'+parentThis.viz.id,
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: 'black'
                            }
                        }
                    },
                },
                series: [{
                    name: parentThis.viz.xAxis.column,
                    colorByPoint: true,
                    data: data
                }]
            });
            parentThis.loading = false;
            break;
        case "scatter" :
            var chart = new Highcharts.Chart({
                  chart: {
                      spacingBottom: 10,
                      height: $("#viz-wrapper"+parentThis.viz.id).height()-50,
                      type: 'scatter',
                      color : {
                          linearGradient : [0,0, 0, 300],
                          stops : [
                            [0, 'rgb(256, 256, 256)'],
                            [1, 'rgb(0, 0, 0)']
                          ]
                      },
                      renderTo: 'viz'+parentThis.viz.id,
                      width: $("#viz-wrapper"+parentThis.viz.id).width()-50,
                  },
                  title: {
                      text: ''
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
                      name: parentThis.viz.xAxis.column,
                      data: parentThis.y,
                      // color : data.color
                  }],
              });
            parentThis.loading = false;
            break;
        case "bubble" :
            var bubbleData = [];
            if (typeof this.viz.third_column == "undefined") {
              this.viz.third_column = this.DatafileService.xColumns[4];
            };
            if (typeof this.viz.fourth_column == "undefined") {
             this.viz.fourth_column = this.DatafileService.xColumns[5];
            }
            this.VizpadDataExtendedSqlService.getVizData(this.filePath,this.viz,this.vizPad).then(function(success){
                // var chartData = parentThis.TransformService.transformForChart(parentThis.vizpad,parentThis.viz,success);
                parentThis.loading = false;
                var arr = Object.keys(success.data[0]);
                var tempArr = parentThis.viz.xAxis.column.split("_");
                var xAxis = tempArr[0];
                var yAxis = parentThis.viz.yAxis.column;
                angular.forEach(success.data, function(d){

                    if (parseFloat(d[parentThis.viz.third_column]) != "null" && parseFloat(d[yAxis]) != "null" && parseFloat(d[parentThis.viz.fourth_column]) != "null") {

                        let tempObj = {
                            x: parseFloat(d[parentThis.viz.fourth_column]),
                            y: parseFloat(d[yAxis]),
                            z: parseFloat(d[parentThis.viz.third_column]),
                            name: d[xAxis]
                        };

                        bubbleData.push(tempObj)
                    };
                });

                var chart = new Highcharts.Chart({
                    chart: {
                        spacingBottom: 10,
                        height: $("#viz-wrapper"+parentThis.viz.id).height()-50,
                        type: parentThis.viz.type,
                        color : {
                            linearGradient : [0,0, 0, 300],
                            stops : [
                              [0, 'rgb(256, 256, 256)'],
                              [1, 'rgb(0, 0, 0)']
                            ]
                        },
                        renderTo: 'viz'+parentThis.viz.id,
                        width: $("#viz-wrapper"+parentThis.viz.id).width()-50,
                    },
                    title: {
                        text: ''
                    },
                    // xAxis: {
                    //     categories: parentThis.x,
                    // },
                    // yAxis: {
                    //     title: {
                    //         text: "AirTime"
                    //     }
                    // },
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
                            '<tr><td>{point.x}</td></tr>' +
                            '<tr><td>{point.y}</td></tr>' +
                            '<tr><td>{point.z}</td></tr>',
                        footerFormat: '</table>',
                        followPointer: true
                    },

                    series: [{
                        name: parentThis.viz.xAxis.column,
                        data: bubbleData,
                        color : {
                            linearGradient : [0, 0, 0, 300],
                            stops : [
                                [0, '#00C3DB'],
                                [1, '#5867C3'],
                            ]
                        },
                    }],
                });

            },function(){

            });
            parentThis.loading = false;
            break;
        case "combineBarChart" :
        case "combineColChart" :
            if(parentThis.viz.secondType != 'undefined' && typeof parentThis.viz.secondType != 'undefined') {
              parentThis.CombineChartService.drawChart(parentThis.viz, parentThis.x, parentThis.y, parentThis.secondY, false);
            }
            break;
        case "heatmap" :
            var heatMapData = [];
            parentThis.loading = true;
            this.VizpadDataExtendedSqlService.getHeatmapData(this.filePath,this.viz,this.vizPad).then(function(success){
                // var chartData = parentThis.TransformService.transformForChart(parentThis.vizpad,parentThis.viz,success);
                parentThis.loading = false;

                var arr = Object.keys(success.data[0]);
                var tempArr = parentThis.viz.xAxis.column.split("_");
                var xAxis = tempArr[0];
                var yAxis = parentThis.viz.yAxis.column;
                var i = 0;

                parentThis.x = [];
                parentThis.y = [];
                angular.forEach(success.data, function(d){
                    parentThis.x.push(d.Origin);
                    parentThis.y.push(d.Dest);
                });
                var objExists = false;
                // for (var i = 0; i <= parentThis.x.length - 1; i++) {
                //     for (var j = 0; j <= success.data.length - 1; j++) {
                //         if (success.data[j].Origin === parentThis.x[i]) {
                //             let tempObj = {
                //                 row: i,
                //                 col: j,
                //                 y: parseFloat(success.data[j].ArrDelay_avg)
                //             };

                //             for (var k = heatMapData.length - 1; k >= 0; k--) {
                //                 if (tempObj.row == heatMapData[k].row && tempObj.col == heatMapData[k].col) {
                //                     objExists = true;
                //                     break;
                //                 }
                //             };

                //             if (!objExists)
                //                 heatMapData.push(tempObj);
                //         };
                //     };
                // };

                var destArr = [];
                angular.forEach(success.data, function(d){
                    destArr.push(d.Dest);
                });

                destArr = _.uniq(destArr);

                angular.forEach(destArr, function(dest, key){
                        var col= 0;
                    angular.forEach(success.data, function(d){
                        if (dest === d.Dest){
                            var tempObj = {
                                row: key,
                                col: col,
                                y: parseFloat(d.Distance_avg)
                            };
                            col = col + 1;
                            heatMapData.push(tempObj);
                        }
                    })
                })

                // angular.forEach(success.data, function(data, key){
                //     var currentData = data;

                //     angular.forEach(success.data, function(d){
                //         var col = 0;
                //         if (currentData.Dest === d.Dest) {
                //             console.log('inside equal', col);
                //             var tempObj = {row: key, col: col, y: d.Distance_avg}
                //             heatMapData.push(tempObj);
                //             col = col+1;
                //         };
                //     })
                // });

                // heatMapData = _.uniq(heatMapData);

                var chart = new Highcharts.Chart({
                    chart: {
                        spacingBottom: 10,
                        type: 'heatmap',
                        height: $("#viz-wrapper"+parentThis.viz.id).height()-50,
                        width: $("#viz-wrapper"+parentThis.viz.id).width()-50,
                        renderTo: 'viz'+parentThis.viz.id,
                        plotBorderWidth: 1
                    },

                    // title: {
                    //     text: parentThis.viz.id
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
                            formatter: function () {
                                return this.series.yAxis.categories[this.point.row] + ': <b>' +
                                    this.y + ' ' +
                                    this.series.xAxis.categories[this.point.col].toLowerCase() + '</b>';
                            }
                        },

                        colorAxis: {
                            stops: [
                                [0, '#3060cf'],
                                [0.5, '#fffbbc'],
                                [0.9, '#c4463a']
                            ],
                            min: -5
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

                            valueRanges: [{
                                to: 1500,
                                color: 'blue'
                            }, {
                                from: 1501,
                                to: 3000,
                                color: 'black'
                            }, {
                                from: 3001,
                                color: 'red'
                            }],

                            turboThreshold: 0
                        }]
                });
            },function(){
                console.log('error');
            })
            parentThis.loading = false;
            break;
        case "polar" :
            parentThis.VizpadDataExtendedSqlService.getVizData(this.filePath,this.viz,this.vizPad).then(function(success){
                // var chartData = parentThis.TransformService.transformForChart(parentThis.vizpad,parentThis.viz,success);
                parentThis.loading = false;
                var arr = Object.keys(success.data[0]);
                angular.forEach(success.data, function(d){
                    parentThis.x.push(d[arr[0]]);
                    parentThis.y.push(parseInt(d[arr[1]]));

                });
                // var series = [];
                // for (var i = arr.length - 1; i >= 0; i--) {
                //     let data = [];

                //     for (var i = success.data.length - 1; i >= 0; i--) {
                //         if (arr)success.data[i]
                //     };

                //     let obj = {
                //         type: 'column',
                //         name: parentThis.viz["x-axis"],
                //         data: [],
                //         pointPlacement: 'between'
                //     }
                //     arr[i]
                // };

                parentThis.viz.xAxis.column = arr[0];
                parentThis.viz.yAxis.column = arr[1];
            },function(error){
                console.log('error');
            });

            var chart = new Highcharts.Chart({
                chart: {
                    spacingBottom: 10,
                    polar : true,
                    renderTo: 'viz'+parentThis.viz.id,
                    width: $("#viz-wrapper"+parentThis.viz.id).width()-50,
                    height: $("#viz-wrapper"+parentThis.viz.id).height()-50,
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
                        formatter: function () {
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
                series: [{
                    type: 'column',
                    name: parentThis.viz.xAxis.column,
                    data: parentThis.y,
                    pointPlacement: 'between'
                }]
            });
            parentThis.loading = false;
            break;
        case "zoomable" :

            var chart = new Highcharts.Chart({
                chart: {
                    spacingBottom: 10,
                    type: 'line',
                    zoomType: 'xy',
                    renderTo: 'viz'+parentThis.viz.id,
                    width: $("#viz-wrapper"+parentThis.viz.id).width()-50,
                    height: $("#viz-wrapper"+parentThis.viz.id).height()-50,
                    color : {
                        linearGradient : [0,0, 0, 300],
                        stops : [
                          [0, 'rgb(256, 256, 256)'],
                          [1, 'rgb(0, 0, 0)']
                        ]
                    },
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: parentThis.x,
                    title: {
                        text: null
                    },
                    min: 0,
                },
                yAxis: {
                    title: {
                        text: parentThis.viz.yAxis.column
                    }
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    area: {
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    },
                },
                series: [{
                    name: parentThis.viz.xAxis.column,
                    data: parentThis.y,
                }]
            });
            parentThis.loading = false;
            break;
        case "wordCloud" :
            parentThis.getWordCloudData().then(function(wordCloudData){
                var frequency_list = wordCloudData
                var color = d3.scale.linear()
                        .domain([0,1,2,3,4,5,6,10,15,20,100])
                        .range(parentThis.viz.colorPaletteDataColors.colors);
                document.getElementById(parentThis.viz.id).innerHTML = '';

                d3.layout.cloud().size([800, 300])
                        .words(frequency_list)
                        .padding(1)
                        .rotate(function(d){
                            // if (d.size % 2 == 0) {
                            //     return 90;
                            // } else {
                                return 0;
                            // }
                        })
                        .text(function(d) { return d.word; })
                        .fontSize(function(d) { return d.size; })
                        .on("end", draw)
                        .start();

                function draw(words) {
                    d3.select("[id='viz" + parentThis.viz.id + "']").append("svg")
                            .attr("width", $("#viz-wrapper"+parentThis.viz.id).width()-50)
                            .attr("height", $("#viz-wrapper"+parentThis.viz.id).height()-50)
                            .attr("class", "wordcloud")
                            .append("g")
                            // without the transform, words words would get cutoff to the left and top, they would
                            // appear outside of the SVG area
                            .attr("transform", "translate(420,200)")
                            .selectAll("text")
                            .data(words)
                            .enter().append("text")
                            .style("font-size", function(d) { return d.size + "px"; })
                            .style("fill", function(d, i) { return color(i); })
                            .attr("transform", function(d) {
                                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                            })
                            .attr("text-anchor", "middle")
                            .style("font-size", function(d) { return (d.size - 1) + "px"; })
                            .text(function(d) { return d.word; })
                            // .fontSize(function(d) { return d.size; })
                }
            },function(error){
                console.log(error);
            });
            parentThis.loading = false;
            break;
        case "radialProgress" :
            parentThis.loading = true;
            parentThis.VizpadDataExtendedSqlService.getRadialProgressData(this.viz).then(function(success){
                document.getElementById('viz'+parentThis.viz.id).innerHTML = '';
                parentThis.loading = false;
                var rp1 = radialProgress(document.getElementById('viz'+parentThis.viz.id))
                    .label("AirTime")
                    .diameter(300)
                    .value((success.colstats[0].avg/success.colstats[0].max)*100)
                    .render()
            },function(){

            })
            parentThis.loading = false;
            break;
        case "simpleCount" :
            document.getElementById('viz'+parentThis.viz.id).innerHTML = '';
            parentThis.showSimpleCount = true;
            parentThis.getSimpleCountData();
            parentThis.loading = false;
            break;
        default :
            var parentThis = this;
            var color;
            if(typeof args == 'undefined')
                color = parentThis.viz.colorPaletteDataColors.colors[parseInt(parentThis.viz.colorPaletteDataColors.colors.length/2)];
            else {
                color = args.colors[parseInt(args.colors.length/2)];
            }

            var chart = new Highcharts.Chart({
                chart: {
                    spacingBottom: 10,
                    height: $("#viz-wrapper"+parentThis.viz.id).height()-50,
                    width: $("#viz-wrapper"+parentThis.viz.id).width()-50,
                    type: parentThis.viz.type,
                    color : {
                        linearGradient : [0,0, 0, 300],
                        stops : [
                          [0, 'rgb(256, 256, 256)'],
                          [1, 'rgb(0, 0, 0)']
                        ]
                    },
                    renderTo: 'viz'+parentThis.viz.id,

                },
                title: {
                    text: ''
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
                    name: parentThis.viz.xAxis.column,
                    data: parentThis.y,
                    color : color
                }],
            });
            parentThis.loading = false;
      }
  }
}
export default VizCtrl;
