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

import drill from './drill.jade';
import trend from './trend.jade';

import _ from 'lodash';
import $ from 'jquery';

class GraphCtrl {
  /*@ngInject*/
  constructor($scope, ThemeColorPaletteService,
    ColorPaletteService, VizpadDataService, $timeout, $window, ErrorHandlerService,
    DatafileService, $rootScope,DatasetStorageService, $state,
    VizpadDataExtendedSqlService, HighchartsConfigService, DrillService) {

    this.$scope = $scope;
    this.DatafileService = DatafileService;
    this.ErrorHandlerService = ErrorHandlerService;
    this.DatasetStorageService = DatasetStorageService;
    this.VizpadDataService = VizpadDataService;
    this.HighchartsConfigService = HighchartsConfigService;
    this.DrillService = DrillService;
    this.$timeout = $timeout;
    this.ColorPaletteService = ColorPaletteService;
    this.ThemeColorPaletteService = ThemeColorPaletteService;
    this.$rootScope = $rootScope;
    this.xColumns = [];
    this.yColumns = [];
    this.VizpadDataExtendedSqlService = VizpadDataExtendedSqlService;
    this.viz.loading = false;
    this.showErrorMsg = false;
    this.showAxesMsg = false;
    this.showWarningMsg = false;
    this.showTable = false;
    this.isSimpleCount = false;
    this.showSimpleCount = false;
    this.$timeout(function() {
      parentThis.dummyImgSize = {
        height : $('#chart'+parentThis.viz.id).height() - 100,
        width : $('#chart'+parentThis.viz.id).width() - 30,
      };
    }, 2000);
    $scope.alert = window.alert;
    var parentThis = this;
    if (!this.viz.combinedGraphMeasure) {
      this.viz.combinedGraphMeasure = {
        column: '',
        aggregation: ''
      }
    }
    this.DatafileService.listColumns();
    this.yColumns = this.DatafileService.yColumns;
    if(this.fromDirective)
      parentThis.DataService = parentThis.VizpadDataService; // calls spark server
    else
      parentThis.DataService = parentThis.VizpadDataExtendedSqlService; // calls memsql server

    this.viz.color = '';

    this.options = {
      autoSelect: true,
      boundaryLinks: false,
      largeEditDialog: false,
      pageSelector: false,
      rowSelection: true
    };

    this.query = {
      order: 'name',
      limit: 5,
      page: 1
    };
    this.viz.drill = {
      drillColumn: '',
      drillFilter: '',
      drillColumnIndex: 0
    };

    angular.element($window)
      .on('resize', function() {
        if(parentThis.viz.type == 'simpleCount' || parentThis.viz.type == 'table' || parentThis.viz.type == 'wordCloud' || parentThis.viz.type == 'radialProgress') {
          document.getElementById('viz'+parentThis.viz.id)
            .innerHTML = '';
          return false;
        } else {
          var index = $("#viz" + parentThis.viz.id)
          .attr('data-highcharts-chart');
          var chart = Highcharts.charts[index];
          chart.setSize($("#chart" + parentThis.viz.id)
          .width() - 50, $("#chart" + parentThis.viz.id)
          .height() - 60);
          chart.reflow();
        }
      });

    this.state = {

      'viztype': false,

      'compare': false,

      'legends': false,

      'filter': false,

      'settings': false,

    }
    this.$scope.$on('gridster-resized', function(gridster, sizes) {
      if(parentThis.viz.type == 'simpleCount' || parentThis.viz.type == 'table' || parentThis.viz.type == 'wordCloud' || parentThis.viz.type == 'radialProgress') {
        document.getElementById('viz'+parentThis.viz.id)
          .innerHTML = '';
        return false;
      }
    });

    this.ThemeColorPaletteService.getLightTheme();

    $scope.$on("vizpadRefreshed", () => {
      this.DatafileService.cache = [];
      this.vizChanged();
    });


    // $scope.$watch(() => {
    //    return this.viz;
    // },(oldVal, newVal) => {
    //   this.vizChanged();
    // }, true);

    $scope.$watch(() => {
      return this.vizpad;
    }, (oldVal, newVal) => {
      this.vizChanged();
    }, true);

    $scope.$on("mainClicked", function(event, args) {
      parentThis.showSubnav(0);
    });

    $scope.$on("gridsterResized", function(event, args) {
      // var chart = $("#"+args.vizObj.id).Highcharts();
      if(args.vizObj.type == 'simpleCount' || args.vizObj.type == 'table' || args.vizObj.type == 'wordCloud' || args.vizObj.type == 'radialProgress') {
        document.getElementById(args.vizObj.id)
          .innerHTML = '';
        return false;
      } else {
        parentThis.$timeout(function() {
          parentThis.dummyImgSize = {
            height : $('#chart'+args.vizObj.id).height() - 100,
            width : $('#chart'+args.vizObj.id).width() - 30,
          };
          var index = $("#viz" + args.vizObj.id)
          .attr('data-highcharts-chart');
          var chart = Highcharts.charts[index];
          var chartWidth = args.element[0].clientWidth - 50;
          var chartHeight = args.element[0].clientHeight - 60;
          chart.setSize(chartWidth, chartHeight);
        }, 200);
      }
    });

  }

  vizChanged() {

    this.HighchartsConfigService.getHighchartsObj(this.viz, this.vizpad).then((success) => {

       if (!success) {
         this.toggleState('settings');
       } else {
         this.highChartConfigObj = success;
       }
    }, (error) => {
        console.log("error", error)
    });
  }

  enlargeViz() {
    if(this.viz.enlargeView)
      this.viz.enlargeView = false;
    else
      this.viz.enlargeView = true;

    this.$rootScope.$broadcast('showEnlarge', {
      viz: this.viz
    });
  }

  toggleState(state) {
    var parentThis = this;
    for (var propt in this.state) {
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

  showSubnav(x) {
    var parentThis = this;
    if (x === '0' || x === 0) {
      for (var propt in this.state) {
        this.state[propt] = false;
      }
    }
    this.showDropdown = x;
    this.$rootScope.$broadcast('dropDownStateChanged', {
      showDropdown: parentThis.showDropdown,
    });
  }


  makeTable() {
    var parentThis = this;
    document.getElementById('viz'+parentThis.viz.id)
      .innerHTML = '';
    parentThis.showTable = true;
    this.headers = [this.viz.xAxis.column, this.viz.yAxis.column];

    this.content = [];
    var tempX = this.viz.xAxis.column;
    var tempY = this.viz.yAxis.column;

    for (var i = this.x.length - 1; i >= 0; i--) {
      let tempObj = {
        x: this.x[i],
        y: this.y[i]
      };

      this.content.push(tempObj);
    };

    parentThis.$rootScope.$broadcast("changedContent");

    this.sortable = [tempX, tempY];
    this.count = 10;

    this.custom = {};

    this.custom[tempX] = 'bold';
    this.custom[tempY] = 'grey';
  }

  closeWarning() {
    this.showWarningMsg = false;
  }

  getSimpleCountData() {
    var parentThis = this;
    var wordCloudData = [];

    var defer = this.$q.defer();

    this.DatafileService.getFileId(this.file, "csv")
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
}
export default GraphCtrl;
