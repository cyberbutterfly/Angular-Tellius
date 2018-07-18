import $ from 'jquery';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
HighchartsMore(Highcharts)

class ExploreCtrl {
/*@ngInject*/
  constructor(VizpadDataService, SearchqlService, ThemeColorPaletteService, DatasetStorageService, ErrorHandlerService,
    $location, $rootScope, $window, $scope, DatafileService, $timeout, UserService, $http, $state) {
    this.VizpadDataService = VizpadDataService;
    this.ErrorHandlerService = ErrorHandlerService;
    this.$location = $location;
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.$scope = $scope;
    this.$state = $state;
    this.SearchqlService = SearchqlService;
    this.DatafileService = DatafileService;
    this.ThemeColorPaletteService = ThemeColorPaletteService;
    this.$timeout = $timeout;
    this.UserService = UserService;
    this.$http = $http;
    this.filePath = DatafileService.filePath;
    this.userDetails = this.UserService.getCurrentUserAuthData();
    var self = this;
    this.state = {

      'viztype' : false,

      'legends' : false,

      'filter' : false,

      'settings' : false,

    };

    this.graphColorPaletteObj = {
      id : "56d6b3e0c246301416f1ea09",
      colors: [
          "#E0F7FA",
          "#B2EBF4",
          "#80DEEA",
          "#4DD0E1",
          "#26C6DA",
          "#00ACC1",
          "#0097A7",
          "#00808F",
          "#006064"
      ]
    };

    this.DatafileService.listColumns();
    $scope.datasetWatcher = function(){
      $state.go('app.dashboard');
    };

    DatasetStorageService.on("DATASET_DID_CHANGE", $scope.datasetWatcher);

    $scope.$on("$destroy",function(){
      DatasetStorageService.off("DATASET_DID_CHANGE", $scope.datasetWatcher);
      angular.element($window).off('resize', function() { });
    });
    this.$scope.$on("mainClicked", function(event, args) {
      self.showSubnav(0);
    });

    this.colorPaletteThemeColors = "default";
    this.$scope.$watch(function(){
      if (typeof self.tempVizObj != "undefined" && typeof self.tempVizObj.type != "undefined" ) {
        return self.tempVizObj.type;
      }
    },function(){
      if (typeof self.tempVizObj != "undefined" && typeof self.tempVizObj.type != "undefined" ) {
        self.graphType = self.tempVizObj.type;
        self.showChart(self.graphType);
      }
    });

    $scope.$on("axesChanged", function(event, args) {
      self.xAxis = args.xAxis;
      self.yAxis = args.yAxis;
      self.VizpadDataService.changeAxes(self.xAxis, self.yAxis, self.tempVizObj)
        .then(function(success) {
          // parentThis.viz.loading = false;
          var arr = Object.keys(success.data[0]);

          self.data.x = [];
          self.data.y = [];

          angular.forEach(success.data, function(d) {
            self.data.x.push(d[arr[0]]);
            self.data.y.push(parseInt(d[arr[1]]));
          });

          self.xAxis = arr[0];
          self.yAxis = arr[1];

          self.showChart(self.graphType);

        }, function(error) {
          self.ErrorHandlerService.error(error);
        });
    });

    $scope.$on("vizFilterAdded", function(event, args) {
      console.log('vizFilterAdded in explore', event, args);
      // args.vizObj.loading = true;
      // var key = -1;
      // var index = $("#" + args.vizObj.id)
      //   .attr('data-highcharts-chart');
      // var chart = Highcharts.charts[index];
      // angular.forEach(chart.xAxis[0].categories, function(x, k) {

      //   if (x == args.filter.value) {
      //     key = k;
      //   };
      // });

      // console.log('key greater that -1', chart.series[0]);
      // if (key > -1) {
      //   args.vizObj.loading = false;
      //   angular.forEach(chart.series[0].data, function(c, k) {
      //     c.color = args.vizObj.colorPaletteDataColors.colors[2];
      //   })
      //   chart.series[0].data[key].update({
      //     color: args.vizObj.colorPaletteDataColors.colors[
      //       parseInt(args.vizObj.colorPaletteDataColors.colors
      //         .length - 3)]
      //   });
      //   chart.redraw();
      //   var filterExist = parentThis.checkIfFilterExist(args.vizObj
      //     .filters, args.filter);
      //   if (!filterExist)
      //     args.vizObj.filters.push(args.filter);
      // } else {
      //   parentThis.addVizFilter(args.filter, args.vizObj);
      // }
    });

    $scope.$on("colorPaletteChanged", function(event, args) {
      self.graphColorPaletteObj.id = args.colorPalette.id;
      self.graphColorPaletteObj.colors = args.colorPalette.colors;
      self.showChart(self.graphType);
    });

    $scope.$on("themeColorPaletteChanged", function(event, args) {
      self.colorPaletteThemeColors = args.value;
      if (args.value == 'dark') {
        self.ThemeColorPaletteService.getDarkTheme();
        self.showChart(self.graphType);
      }
      if (args.value == 'sand' || args.value == 'default') {
        self.ThemeColorPaletteService.getLightTheme();
        self.showChart(self.graphType);
      }
    });

    this.$scope.$watch(function(){
        return self.SearchqlService.searchQlData;
    }, function(){
        self.data = {
          x: [],
          y: []
        };

        if(self.SearchqlService.searchQlData.responseType == "autocomplete") {
          return false;
        }

        self.vizTitle = self.SearchqlService.searchQlData.original.substr(self.SearchqlService.searchQlData.original.indexOf('show ') + 5, self.SearchqlService.searchQlData.original.length);
        self.vizpadTitle = "Untitled Vizpad";
        var columnNames = self.SearchqlService.searchQlData.columnNames;
        var suggestionText = self.SearchqlService.searchQlData.original;
        self.xAxis = columnNames[0];
        var yAxisFake, zAxisFake;
        if(columnNames[1].indexOf(')') != -1) {
            yAxisFake = columnNames[1].substr(columnNames[1].lastIndexOf('.') + 1, columnNames[1].indexOf(')'));
            self.yAxis = yAxisFake.substr(0, yAxisFake.length - 1);
        } else {
            self.yAxis = columnNames[1];
        }
        if(columnNames[2] !== 'undefined' && typeof columnNames[2] !== 'undefined') {
            zAxisFake = columnNames[2].substr(columnNames[2].lastIndexOf('.') + 1, parseInt(columnNames[2].indexOf(')') - 1));
            self.zAxis = zAxisFake.substr(0, zAxisFake.length - 1);
        }

        var graphTypeOccurence = suggestionText.indexOf("show ") + 5;
        self.graphType = suggestionText.substr(graphTypeOccurence, suggestionText.indexOf(" ", graphTypeOccurence) - graphTypeOccurence);
        if(self.graphType == "chart")
            self.graphType = "column";

        if(suggestionText.indexOf('stacked') != -1) {
          if(self.graphType == "bar")
            self.graphType = 'HorizontalStacked';
          if(self.graphType == "area")
            self.graphType = 'AreaStacked';
          if(self.graphType == "chart")
            self.graphType = 'VerticalStacked';
        }
        angular.forEach(self.SearchqlService.searchQlData.rows, function(r){
            self.data.x.push(r[0]);
            self.data.y.push(parseInt(r[1]));
        });

        // self.xAxis = columnNames[0].substr(columnNames[0].lastIndexOf('.') + 1, columnNames[0].indexOf(')'));

        self.tempVizObj = {
          "type": self.graphType,
          "xAxis": {"column": self.xAxis, "resolution": "weekly"},
          "yAxis": {"column": self.yAxis, "aggregation": "avg"},
          "colorPaletteDataColors": self.graphColorPaletteObj,
          "filters": [],
          "timeRange": {
              "type": "all",
              "filterColumn": "time"
          },
          "thumbnail": "",
          "third_column":"date",
          "fourth_column":"date"
        };
        self.showChart(self.graphType);
    });

  }

  showChart(graphType) {
    var self = this;
    switch(graphType) {
      case "pie" :
        var data = [];
        for (var i = self.data.x.length - 1; i >= 0; i--) {
          var tempObj = {
            name:'',
            y:0,
            color: self.graphColorPaletteObj.colors[Math.floor(Math.random() * self.graphColorPaletteObj.colors.length)]
          };
          tempObj.name = self.data.x[i];
          tempObj.y = self.data.y[i];
          data.push(tempObj);
        };

        var chart = new Highcharts.Chart({
          chart: {
              type: 'pie',
              color : {
                  linearGradient : [0,0, 0, 300],
                  stops : [
                    [0, 'rgb(256, 256, 256)'],
                    [1, 'rgb(0, 0, 0)']
                  ]
              },
              height: $('.chartcontainer').height() - 50,
              renderTo: "explore-viz",
              width: $('.chartcontainer').width() - 30,
          },
          credits: {
           enabled: false,
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
              name: self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length),
              colorByPoint: true,
              data: data
          }]
        });
        break;
      case "scatter" :
        var chart = new Highcharts.Chart({
          chart: {
            type: 'scatter',
            color : {
                linearGradient : [0,0, 0, 300],
                stops : [
                  [0, 'rgb(256, 256, 256)'],
                  [1, 'rgb(0, 0, 0)']
                ]
            },
            renderTo: "explore-viz",
            height: $('.chartcontainer').height() - 50,
            width: $('.chartcontainer').width() - 30,
          },
          credits: {
           enabled: false,
          },
          title: {
            text: ''
          },
          xAxis: {
            categories: self.data.x,
          },
          yAxis: {
            title: {
                text: self.yAxis
            }
          },
          series: [{
            name: self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length),
            data: self.data.y,
            color: self.graphColorPaletteObj.colors[parseInt(
                self.graphColorPaletteObj.colors.length / 2
              )]
          }],
        });
        break;
      case "zoomable" :

          var chart = new Highcharts.Chart({
              chart: {
                  spacingBottom: 10,
                  type: 'line',
                  zoomType: 'xy',
                  renderTo: "explore-viz",
                  height: $('.chartcontainer').height() - 50,
                  width: $('.chartcontainer').width() - 30,
                  color : {
                      linearGradient : [0,0, 0, 300],
                      stops : [
                        [0, 'rgb(256, 256, 256)'],
                        [1, 'rgb(0, 0, 0)']
                      ]
                  },
              },
              credits: {
               enabled: false,
              },
              title: {
                  text: ''
              },
              xAxis: {
                  categories: self.data.x,
                  title: {
                      text: null
                  },
                  min: 0,
              },
              yAxis: {
                  title: {
                      text: self.yAxis
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
                name: self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length),
                data: self.data.y,
                color: self.graphColorPaletteObj.colors[parseInt(
                  self.graphColorPaletteObj.colors.length / 2
                )]
              }],
          });
          break;
      case "bubble" :
        var bubbleData = [];
        angular.forEach(self.SearchqlService.searchQlData.rows ,function(value, index){
            let tempObj = {
                name: value[0],
                x: parseFloat(value[1]),
                y: parseFloat(value[2]),
                z: parseFloat(value[3]),
            };
            bubbleData.push(tempObj);
        });

        var chart = new Highcharts.Chart({
          chart: {
              height: $('.chartcontainer').height() - 50,
              type: "bubble",
              color : {
                  linearGradient : [0,0, 0, 300],
                  stops : [
                    [0, 'rgb(256, 256, 256)'],
                    [1, 'rgb(0, 0, 0)']
                  ]
              },
              renderTo: "explore-viz",
              width: $('.chartcontainer').width() - 30,
          },
          credits: {
           enabled: false,
          },
          title: {
              text: ''
          },
          // xAxis: {
          //     categories: self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length),
          // },
          // yAxis: {
          //     title: {
          //         text: self.yAxis
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
              name: self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length),
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
        break;
      case "heatmap" :
          var heatMapData = [];
          this.VizpadDataService.getHeatmapData(this.file,this.viz,this.vizPad).then(function(success){
              // var chartData = self.TransformService.transformForChart(self.vizpad,self.viz,success);

              var arr = Object.keys(success.data[0]);
              var xAxis = self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length);
              var yAxis = self.yAxis;
              var i = 0;

              self.x = [];
              self.y = [];
              angular.forEach(success.data, function(d){
                  self.x.push(d.Origin);
                  self.y.push(d.Dest);
              });
              console.log('this is the heat map data', success);
              var objExists = false;
              // for (var i = 0; i <= self.x.length - 1; i++) {
              //     for (var j = 0; j <= success.data.length - 1; j++) {
              //         if (success.data[j].Origin === self.x[i]) {
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
                          console.log('in equals', dest, d.Dest);
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

              console.log('heatMap data *********', heatMapData);


              var chart = new Highcharts.Chart({
                  chart: {
                      spacingBottom: 10,
                      type: 'heatmap',
                      height: $("#viz-wrapper"+self.viz.id).height()-50,
                      width: $("#viz-wrapper"+self.viz.id).width()-50,
                      renderTo: 'viz'+self.viz.id,
                      plotBorderWidth: 1
                  },
                  credits: {
                   enabled: false,
                  },
                  // title: {
                  //     text: self.viz.id
                  // },

                  xAxis: {
                      categories: self.x,
                      min: 0,
                      max: self.x.length
                  },

                  yAxis: {
                      categories: self.y,
                      min: 0,
                      max: self.y.length,
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
          },function(error){
              self.ErrorHandlerService.error(error);
          })
          break;
      case "polar" :

          var chart = new Highcharts.Chart({
              chart: {
                  polar : true,
                  renderTo: "explore-viz",
                  width: $('.chartcontainer').width() - 30,
                  height: $('.chartcontainer').height() - 50,
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
                      formatter: function () {
                          return self.data.x;
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
                  name: self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length),
                  data: self.data.y,
                  pointPlacement: 'between',
                  color: self.graphColorPaletteObj.colors[parseInt(
                    self.graphColorPaletteObj.colors.length / 2
                  )]
              }]
          });
          break;
      case "HorizontalStacked" :
          var chart = new Highcharts.Chart({
              chart: {
                  type: 'bar',
                  height: $('.chartcontainer').height() - 50,
                  renderTo: "explore-viz",
                  width: $('.chartcontainer').width() - 30,
              },
                credits: {
                 enabled: false,
                },
              title: {
                  text: ''
              },
              xAxis: {
                  categories: self.data.x,
              },
              yAxis: {
                  title: {
                      text: self.yAxis
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
              series: [{
                  name: self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length),
                  data: self.data.y,
              }, {
                  name: self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length),
                  data: self.data.y,
              }, {
                  name: self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length),
                  data: self.data.y,
              }]
          });
          break;
      case "VerticalStacked" :
          var chart = new Highcharts.Chart({
              chart: {
                  type: 'column',
                  height: $('.chartcontainer').height() - 50,
                  renderTo: "explore-viz",
                  width: $('.chartcontainer').width() - 30,
              },
              credits: {
               enabled: false,
              },
              title: {
                  text: ''
              },
              xAxis: {
                  categories: self.data.x,
              },
              yAxis: {
                  title: {
                      text: self.yAxis
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
              series: [{
                  name: self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length),
                  data: self.data.y,
              }, {
                  name: self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length),
                  data: self.data.y,
              }, {
                  name: self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length),
                  data: self.data.y,
              }]
          });
          break;
      case "AreaStacked" :
          var chart = new Highcharts.Chart({
              chart: {
                  type: 'area',
                  height: $('.chartcontainer').height() - 50,
                  renderTo: "explore-viz",
                  width: $('.chartcontainer').width() - 30,
              },
                credits: {
                 enabled: false,
                },
              title: {
                  text: ''
              },
              xAxis: {
                  categories: self.data.x,
              },
              yAxis: {
                  title: {
                      text: self.yAxis
                  }
              },
              plotOptions: {
                  area: {
                      stacking: 'normal',
                      lineColor: '#666666',
                      lineWidth: 1,
                  }
              },
              series: [{
                  name: self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length),
                  data: self.data.y,
              }, {
                  name: self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length),
                  data: self.data.y,
              }, {
                  name: self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length),
                  data: self.data.y,
              }]
          });
          break;

      case "word" :
          var wordCloudData = [];
          angular.forEach(self.SearchqlService.searchQlData.rows, function(value, index){
              var tempObj = {
                  text: value[0],
                  size: value[1]
              };
              wordCloudData.push(tempObj);
              console.log('wordcloud ^&*(', tempObj, value[0], wordCloudData);
          })
          var frequency_list = wordCloudData
          var color = d3.scale.linear()
                  .domain([0,1,2,3,4,5,6,10,15,20,100])
                  .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

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
              console.log('in draw function', $('#explore-viz'));
              d3.select("[id='explore-viz']").append("svg")
                  .attr("width", 750)
                  .attr("height", 500)
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

          break;
      case "radial" :
          self.VizpadDataService.getRadialProgressData(this.viz).then(function(success){
              document.getElementById('viz'+self.viz.id).innerHTML = '';
              var rp1 = radialProgress(document.getElementById("explore-viz"))
                  .label("AirTime")
                  .diameter(300)
                  .value((success.colstats[0].avg/success.colstats[0].max)*100)
                  .render()
          },function(){

          });
          break;
      case "simple" :
          document.getElementById('viz'+self.viz.id).innerHTML = '';
          self.showSimpleCount = true;
          self.getSimpleCountData();
          break;
      default :
          var chart = new Highcharts.Chart({
              chart: {
                  height: $('.chartcontainer').height() - 50,
                  width: $('.chartcontainer').width() - 30,
                  type: graphType,
                  color : {
                      linearGradient : [0,0, 0, 300],
                      stops : [
                        [0, 'rgb(256, 256, 256)'],
                        [1, 'rgb(0, 0, 0)']
                      ]
                  },
                  renderTo: "explore-viz",

              },
              credits: {
               enabled: false,
              },
              title: {
                  text: ''
              },
              xAxis: {
                  categories: self.data.x,
              },
              yAxis: {
                  title: {
                      text: self.yAxis
                  }
              },
              series: [{
                  name: self.xAxis.substring(self.xAxis.indexOf('.') + 1, self.xAxis.length),
                  data: self.data.y,
                  color: self.graphColorPaletteObj.colors[parseInt(
                    self.graphColorPaletteObj.colors.length / 2
                  )]
              }],
          });
    }
  }

  showSubnav(x){
    var self = this;
    if (x === '0') {
        for(var propt in self.state){
          self.state[propt] = false;
      }
      self.$scope.showDropdown = 0;
      self.showDropdown = 0;
    } else {
      if(x==self.$scope.showDropdown){
        self.$scope.showDropdown = 0;
        self.showDropdown = 0;
      } else {
        self.$scope.showDropdown = x;
        self.showDropdown = x;
      }
    }
  };

  toggleState(state) {
    var self = this;
    for(var propt in this.state){
        if (propt === state && !this.state[propt]) {
            this.state[propt] = true;
            self.showDropdown = propt;
        } else {
            if (propt === state && this.state[propt]) {
                self.showDropdown = 0;
                this.state[propt] = false;
            } else {
                this.state[propt] = false;
            }
        }
    }
    if (state == 'download') {
        self.showDropdown = state;
    }
    this.showSubnav(this.showDropdown);
  }

  vizTitleChanged(ev, viz) {
    var self = this;
    var newVizTitle = $(ev.target).text();
    if(newVizTitle != self.vizTitle) {
      self.vizTitle = newVizTitle;
    }
  }

  vizpadTitleChanged(ev, viz) {
    var self = this;
    var newVizpadTitle = $(ev.target).text();
    if(newVizpadTitle != self.vizpadTitle) {
      self.vizpadTitle = newVizpadTitle;
    }
  }

  updateAll() {
    var self = this;
    var vizTitlesArr = [];
    var vizpadTitlesArr = [];
    self.VizpadDataService.getAllVizpad().then(function(success){
      self.VizpadDataService.getVizLibrary().then(function(successViz){
        angular.forEach(successViz.vizs, function(value, index){
          vizTitlesArr.push(value.title);
        });

        var copyCountViz = 1;
        var tempVizTitle = self.vizTitle;
        while(vizTitlesArr.indexOf(self.vizTitle) != -1) {
          self.vizTitle = tempVizTitle + " " + copyCountViz;
          copyCountViz ++;
        }
        angular.forEach(success.vizPads, function(value, index){
          vizpadTitlesArr.push(value.title);
        });

        var copyCountVizpad = 1;
        while(vizpadTitlesArr.indexOf(self.vizpadTitle) != -1) {
          self.vizpadTitle = "Untitled Vizpad " + copyCountVizpad;
          copyCountVizpad ++;
        }
        self.$timeout(function() {
          var vizObj = {
            "ownerId": self.userDetails.id,
            "dataId": self.DatafileService.fileId,
            "title": $('.viz-title').text(),
            "type": self.graphType,
            "xAxis": {"column": self.xAxis, "resolution": "weekly"},
            "yAxis": {"column": self.yAxis, "aggregation": "avg"},
            "colorPaletteDataColors": self.graphColorPaletteObj.id,
            // "colorPaletteThemeColors": self.colorPaletteThemeColors,
            "filters": [],
            "timeRange": {
                "type": "all",
                "filterColumn": "time"
            },
            "thumbnail": "",
            "third_column":"date",
            "fourth_column":"date"
          };

          self.VizpadDataService.createViz(vizObj).then(function(success){
            var VizpadObj = {
              "ownerId": self.userDetails.id,
              "title": $('.vizpad-title').text(),
              "vizs": [success.id],
              "placement": [{
                "sizeX": 6,
                "sizeY": 3,
                "row": 0,
                "col": 0,
                "vizId": success.id
              }],
              "layout": "{\"testLayoutProperty\": true}",
              "filters": [],
              "timeRange": {
                "type": "all"},
              "thumbnail": "",
              "sharingByLink": true,
              "sharedWith": [],
            };
            self.VizpadDataService.createVizpad(VizpadObj).then(function(success){
              self.$state.transitionTo(`app.vizpad.chartview`,{vizpadId : success.id});
            }, function(error){
              self.ErrorHandlerService.error(error);
            });
          }, function(error){
            self.ErrorHandlerService.error(error);
          });
        }, 500);

      }, function(error){
        self.ErrorHandlerService.error(error);
      });
    }, function(error){
      self.ErrorHandlerService.error(error);
    });
  }
}
export default ExploreCtrl;
