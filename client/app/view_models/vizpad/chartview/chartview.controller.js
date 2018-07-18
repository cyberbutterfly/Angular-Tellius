import $ from 'jquery';
import rangepicker from './dateRangePickerModal.jade'
import datepicker from './datePickerModal.jade'
import share from './../vizpad-view/shareDialog.jade'
import timeline from './timelineDialog.jade'
import filter from './../vizpad-view/filterDialog.jade'
import create from './../vizpad-view/createDialog.jade'
import hierarchy from './../vizpad-view/hierarchyDialog.jade'
import CreateVizController from './createVizController'
import DialogController from './dialogController'
import RangeDialogController from './rangeDialogController'
import DateColumnController from './dateColumnController'
import moment from 'moment'
import gridster from 'angular-gridster'
import './gridster.styl'

/*@ngInject*/
function ShowDialogController($scope, $mdDialog) {

  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}
class ChartViewCtrl {
  /*@ngInject*/
  constructor(VizpadDataService, SetupVizService, $location, $rootScope, DatasetAPI, ColorPaletteService,
    PlacementObjectService, $window, $scope, $mdDialog, $mdMedia, ErrorHandlerService,
    DatafileService, $timeout, UserService, $http, $state, DatasetStorageService, FilterService, ColumnAPI) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$http = $http;
    this.currentDataSourceId = DatasetStorageService._currentSourceId;
    this.UserService = UserService;
    this.isOpen = false;
    this.selectedMode = 'md-scale';
    this.selectedDirection = 'left';
    this.$mdDialog = $mdDialog;
    this.$location = $location;
    this.FilterService = FilterService;
    this.ColorPaletteService = ColorPaletteService;
    this.$timeout = $timeout;
    this.$window = $window;
    this.$mdMedia = $mdMedia;
    this.filePath = DatafileService.filePath;
    this.VizpadDataService = VizpadDataService;
    this.DatasetAPI = DatasetAPI;
    this.ErrorHandlerService = ErrorHandlerService;
    this.PlacementObjectService = PlacementObjectService;
    this.SetupVizService = SetupVizService;
    this.DatafileService = DatafileService;
    this.ColumnAPI = ColumnAPI;
    this.chartType = [];
    this.chartContainer = {
      item: -1
    };

    this.xColumns = [];
    this.yColumns = [];
    this.dateColumns = ['Cdatetime', 'Cdate2', 'Ctime', ];
    this.yColumns = this.DatafileService.yColumns;
    this.xColumns = this.DatafileService.xColumns;
    this.userDetails = this.UserService.getCurrentUserAuthData();
    this.showVizType = false;
    this.chartView = true;
    var parentThis = this;
    this.ColumnAPI.on("advancedConditionAdded", (args) => {
      let filterString = args.advancedFilter.split(" ");
      let filterObj = {
        column: filterString[0],
        operator: filterString[1],
        value: filterString[2]
      };
      this.vizPadObj.filters.push(filterObj);
    })
    $scope.datasetWatcher = function(){
      $state.go('app.vizpad.list');
      parentThis.DatafileService.listColumns(true);
      parentThis.xColumns = parentThis.DatafileService.xColumns;
      parentThis.yColumns = parentThis.DatafileService.yColumns;
    };

    DatasetStorageService.on("DATASET_DID_CHANGE", $scope.datasetWatcher);

    $scope.$on("$destroy",function(){
      DatasetStorageService.off("DATASET_DID_CHANGE", $scope.datasetWatcher);
    });
    this.isTable = false;
    this.vizPadId = $state.params.vizpadId;
    if (typeof this.vizPadId != "undefined") {

      this.VizpadDataService.getVizpadObj(this.vizPadId)
        .then(function(success) {
          parentThis.vizPadObj = success;
          parentThis.VizpadDataService.setVizPadObj(parentThis.vizPadObj);
          parentThis.placementArr = success.placement;
          parentThis.vizPadObj.filterString = [];
          parentThis.vizPadObj.timeRange.dateColumn = parentThis.DatafileService
            .dateColumns[0];
          parentThis.vizArr = success.vizs;
          angular.forEach(parentThis.vizArr, function(viz, index){
            viz.normalView = true;
            viz.enlargeView = false;
            viz.isSaved = true;
          });
          if (parentThis.vizArr.length === 0) {
            parentThis.addUnsavedViz();
          }
        }, function(error) {
          parentThis.ErrorHandlerService.error(error);
        });
    };

    this.$scope.$on('vizPadUpdated', function(event, args) {
      parentThis.VizpadDataService.getVizpadObj(parentThis.vizPadId)
        .then(function(success) {
          parentThis.vizPadObj = success;
          parentThis.placementArr = success.placement;
          parentThis.vizArr = success.vizs;
          angular.forEach(parentThis.vizArr, function(viz, index){
            viz.normalView = true;
            viz.enlargeView = false;
          });
        }, function(error) {
          parentThis.ErrorHandlerService.error(error);
        });
    });

    this.state = {

      'viztype': false,

      'legends': false,

      'filter': false,

      'settings': false,

      'compare': false,
    }

    if ($('.main')
      .find('.head')
      .width() <= 160) {
      parentThis.showTooltip = true;
    } else {
      parentThis.showTooltip = false;
    }

    angular.element(this.$window)
      .bind('resize', function() {
        if ($('.main')
          .find('.head')
          .width() <= 160) {
          parentThis.showTooltip = true;
        } else {
          parentThis.showTooltip = false;
        }
      });

    $scope.$on("mainClicked", function(event, args) {
      parentThis.showSubnav(0);
    });

    $scope.$on("dropDownStateChanged", function(event, args) {
      parentThis.toggleState(args.showDropdown);
    });
    $scope.$on("simpleCount", function(event, args) {
      angular.forEach(parentThis.placementArr, function(value, index) {
         if(value.vizId == args.viz.id) {
           value.sizeX = 1;
           value.sizeY = 1;
         }
      });
      for (var propt in parentThis.state) {
        parentThis.state[propt] = false;
      }
      parentThis.showDropdown = 0;
    });
    $scope.$on("simpleCountChanged", function(event, args) {
      angular.forEach(parentThis.placementArr, function(value, index) {
         if(value.vizId == args.viz.id) {
           value.sizeX = 3;
           value.sizeY = 2;
         }
      });
      parentThis.$timeout(function () {
        parentThis.$rootScope.$broadcast("gridsterResized", {
          element: $('#chart'+args.viz.id),
          vizObj: args.viz
        });
      }, 150);
      for (var propt in parentThis.state) {
        parentThis.state[propt] = false;
      }
      parentThis.showDropdown = 0;
    });

    $scope.$on("showEnlarge", function(event, args) {
      if(args.viz.enlargeView) {
        angular.forEach(parentThis.placementArr, function(value, index) {
          if (args.viz.id === value.vizId) {
            parentThis.prevPlacement = angular.copy(value);
            value.sizeX = 6;
            value.sizeY = 3;
            value.row = 0;
            value.col = 0;
          }
        });
        angular.forEach(parentThis.vizArr, function(viz, index){
          if(args.viz.id != viz.id) {
            viz.normalView = false;
          }
        });
      } else {
        angular.forEach(parentThis.placementArr, function(value, index) {
          if (args.viz.id === value.vizId) {
            value.sizeX = parentThis.prevPlacement.sizeX;
            value.sizeY = parentThis.prevPlacement.sizeY;
            value.row = parentThis.prevPlacement.row;
            value.col = parentThis.prevPlacement.col;
          }
        });
        angular.forEach(parentThis.vizArr, function(viz, index){
          viz.normalView = true;
        });
      }
      parentThis.$timeout(function () {
        parentThis.$rootScope.$broadcast("gridsterResized", {
          element: $('#chart'+args.viz.id),
          vizObj: args.viz
        });
      }, 150);
    });

    this.vizFilters = [];

    this.DatafileService.listColumns();
    this.xColumns = this.DatafileService.xColumns;
    this.yColumns = this.DatafileService.yColumns;
    this.chartType.color = {
        linearGradient: [0, 0, 0, 250],
        stops: [
          [0, '#00C3DB'],
          [1, '#5867C3'],
        ]
      },

      this.colors = '';
    this.resizing = false;

    $timeout(function() {
      parentThis.loginAlertMessage = true;
      parentThis.SetupVizService.hideSetup();
    }, 5000);

    this.gridsterOpts = {
      columns: 6, // the width of the grid, in columns
      pushing: true, // whether to push other items out of the way on move or resize
      widget_selector: "div", // Define which elements are the widgets. Can be a CSS Selector string or a jQuery collection of HTMLElements.
      floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
      swapping: true, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
      // width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
      // colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
      // rowHeight: 200, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
      margins: [10, 10], // the pixel distance between each widget
      outerMargin: true, // whether margins apply to outer edges of the grid
      isMobile: false, // stacks the grid items if true
      mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
      mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
      minColumns: 1, // the minimum columns the grid must have
      minRows: 1, // the minimum height of the grid, in rows
      maxRows: 100,
      defaultSizeX: 3, // the default width of a gridster item, if not specifed
      defaultSizeY: 2, // the default height of a gridster item, if not specified
      minSizeX: 1, // minimum column width of an item
      maxSizeX: 6, // maximum column width of an item
      minSizeY: 1, // minumum row height of an item
      maxSizeY: 6, // maximum row height of an item
      resizable: {
        enabled: true,
        handles: ['se'],
        start: function(event, $element, widget) {
          parentThis.resizing = true;
        }, // optional callback fired when resize is started,
        resize: function(event, $element, widget) {
          parentThis.resizing = true;
        }, // optional callback fired when item is resized,
        stop: function(event, $element, widget) {
            var vizObj = $.grep(parentThis.vizArr, function(e) {
              var id = 'viz'+e.id;
              return id == $($element[0])
                .find('.graph-div')
                .attr('id');
            });
            parentThis.$timeout(function() {
              parentThis.$rootScope.$broadcast("gridsterResized", {
                element: $($element[0]),
                vizObj: vizObj[0]
              });
            }, 200);
            parentThis.$timeout(function() {
              parentThis.resizing = false;
            }, 700);
          } // optional callback fired when item is finished resizing
      },
      draggable: {
        enabled: true, // whether dragging items is supported
        handle: '.expand-button', // optional selector for resize handle
        start: function(event, $element, widget) {

        }, // optional callback fired when drag is started,
        drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
        stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
      }
    };
  }

  getGridsterObj(viz) {
    var parentThis = this;
    var placementObj = {};
    angular.forEach(this.placementArr, function(value, index) {
      if (viz.id === value.vizId) {
        placementObj = value;
      }
    });
    return placementObj;
  }

  vizTitleChanged(ev, viz) {
    var parentThis = this;
    var newVizTitle = $(ev.target)
      .text();
    if (newVizTitle != viz.title) {
      angular.forEach(parentThis.placementArr, function(value, index) {
        if(value.vizTitle == viz.title) {
          value.vizTitle = newVizTitle;
        }
      })
      viz.title = newVizTitle;
      viz.vizTitleChanged = true;
    }
  }

  vizpadTitleChanged(ev) {
    var parentThis = this;
    var newVizpadTitle = $(ev.target)
      .text();
    if (newVizpadTitle != this.vizPadObj.title) {
      parentThis.vizPadObj.title = newVizpadTitle;
      parentThis.vizPadObj.vizpadTitleChanged = true;
    }
  }

  showLibrary(ev) {
    this.chartView = false;
  };

  refreshVizpad() {
    this.$rootScope.$broadcast("vizpadRefreshed");
  }

  showSubnav(x) {
    var parentThis = this;
    if (x === '0' || x === 0) {
      for (var propt in this.state) {
        this.state[propt] = false;
      }
      parentThis.showDropdown = 0;
    } else {
      parentThis.showDropdown = x;
    }
  };

  addUnsavedViz() {
    var parentThis = this;
    var randomId = parseInt(Math.random()*1000);
    var vizObj = {
        colorPaletteDataColors : {
            colors : ["#E0F7FA", "#B2EBF4", "#80DEEA", "#4DD0E1", "#26C6DA", "#00ACC1", "#0097A7", "#00808F", "#006064"],
            id : "56d6b3e0c246301416f1ea09"
        },
        dataId : parentThis.DatafileService.fileId,
        enlargeView : false,
        filters : [],
        id : randomId,
        loading : false,
        normalView : true,
        timeRange : {
            filterColumn : "time",
            type : "all",
        },
        title : "Untitled viz" + randomId,
        type : "column",
        xAxis : {
            column : "null",
            resolution : "weekly"
        },
        yAxis : {
            aggregation : "avg",
            column : "null"
        },
        isSaved : false,
    };
    this.vizArr.push(vizObj);
    var twoCrossThreeObj = this.PlacementObjectService.getFreeSpace(2,3, parentThis.vizPadObj.placement);
    var newPlacementObj = {
      sizeY : 2,
      col : twoCrossThreeObj.col,
      vizId : vizObj.id,
      vizTitle : vizObj.title,
      sizeX : 3,
      row : twoCrossThreeObj.row
    };
    this.chartContainer = {
      item: 0
    };
    this.placementArr.push(newPlacementObj);
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

  changeColor() {
    this.chartType = this.data;
    if (this.colors == "red") {
      this.chartType.color = {
        linearGradient: [0, 0, 0, 300],
        stops: [
          [0, '#ff3300'],
          [1, '#990033'],
        ]
      };
    };

    if (this.colors == "blue") {
      this.chartType.color = {
        linearGradient: [0, 0, 0, 300],
        stops: [
          [0, '#00C3DB'],
          [1, '#5867C3'],
        ]
      };
    };

    if (this.colors == "green") {
      this.chartType.color = {
        linearGradient: [0, 0, 0, 300],
        stops: [
          [0, '#66ff66'],
          [1, '#006600'],
        ]
      };
    };

  }

  changeChart(graph) {
    this.selectSubType(graph);
    this.changedChartType = graph;
    this.$rootScope.$broadcast("graphTypeChanged", {
      graphName: graph,
      data: this.data
    });
  }

  changeSubChartType(graph) {
    this.changedSubChartType = graph;
  }

  changeToChartview(ev) {
    var parentThis = this;
    this.vizArr = this.VizpadDataService.getVizArr();
    angular.forEach(this.vizArr, function(viz, index){
      viz.normalView = true;
      viz.enlargeView = false;
    });

    // use promise here instead of timeout
    this.$timeout(function() {
      parentThis.chartView = true;
    }, 200);
  }


  updateAll() {
    var parentThis = this;
    var totalSuccess = 0;
    var unsavedVizs = $.grep(this.vizArr, (value, index) => {
        return (value.isSaved == false);
    });
    var savedVizs = $.grep(this.vizArr, (value, index) => {
        return (value.isSaved == true);
    });

    angular.forEach(savedVizs, function(value, index) {

      var canvas = document.createElement('canvas');
      var svg = $("#viz" + value.id)
        .find('svg')[0];
      var svgData = new XMLSerializer()
        .serializeToString(svg);
      var svgSize = svg.getBoundingClientRect();
      canvas.width = svgSize.width;
      canvas.height = svgSize.height;
      var ctx = canvas.getContext('2d');

      // var img = document.body.appendChild(canvas);

      var img = document.createElement('img');
      img.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(
        unescape(encodeURIComponent(svgData))));

      ctx.drawImage(img, 0, 0);
      var vizImage = canvas.toDataURL('image/png');

      var fd = new FormData();
      var thumbnail = new Blob([vizImage], {
        type: "image/png"
      });
      fd.append("thumbnail", thumbnail);
      img.remove();

      parentThis.$http.post('/thumbnail', fd, {
          withCredentials: true,
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          },
        })
        .success(function(response) {
        /*if (value.yAxis.column.indexOf('_') > -1) {
          value.yAxis.column = value.yAxis.column.split('_')[0];
        }*/
        var updateObj;
        if (value.vizTitleChanged == true) {
          value.vizTitleChanged = false;
          updateObj = {
            "title": value.title,
            "type": value.type,
            "xAxis": value.xAxis,
            "yAxis": value.yAxis,
            "colorPaletteDataColors": value.colorPaletteDataColors.id,
            // "colorPaletteThemeColors": value.colorPaletteThemeColors,
            "filters": parentThis.vizFilters,
            "timeRange": value.timeRange,
            "thumbnail": response,
            "dataId": parentThis.currentDataSourceId,
          };
        } else {
          updateObj = {
            "type": value.type,
            "xAxis": value.xAxis,
            "yAxis": value.yAxis,
            "colorPaletteDataColors": value.colorPaletteDataColors.id,
            // "colorPaletteThemeColors": value.colorPaletteThemeColors,
            "filters": parentThis.vizFilters,
            "timeRange": value.timeRange,
            "thumbnail": response,
            "dataId": parentThis.currentDataSourceId,
          };
        }
        parentThis.VizpadDataService.updateViz(updateObj, value.id)
          .then(function(success) {
            totalSuccess ++;
            if(totalSuccess == parentThis.vizArr.length) {
              parentThis.saveVizpad();
          }
        }, function(error) {
          parentThis.ErrorHandlerService.error(error);
        });
      })
      .error(function(response) {
        parentThis.ErrorHandlerService.error(response);
      });
    });

    angular.forEach(unsavedVizs, function(value, index) {
      var canvas = document.createElement('canvas');
      var svg = $("#viz" + value.id)
        .find('svg')[0];
      var svgData = new XMLSerializer()
        .serializeToString(svg);
      var svgSize = svg.getBoundingClientRect();
      canvas.width = svgSize.width;
      canvas.height = svgSize.height;
      var ctx = canvas.getContext('2d');

      // var img = document.body.appendChild(canvas);

      var img = document.createElement('img');
      img.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(
        unescape(encodeURIComponent(svgData))));

      ctx.drawImage(img, 0, 0);
      var vizImage = canvas.toDataURL('image/png');

      var fd = new FormData();
      var blob = new Blob([vizImage], {
        type: "image/png"
      });
      fd.append("thumbnail", blob);
      img.remove();

      parentThis.$http.post('/thumbnail', fd, {
          withCredentials: true,
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          },
        })
        .success(function(response) {
        /*if (value.yAxis.column.indexOf('_') > -1) {
          value.yAxis.column = value.yAxis.column.split('_')[0];
        }*/
        var updateObj = {
          "title": value.title,
          "type": value.type,
          "xAxis": value.xAxis,
          "yAxis": value.yAxis,
          "colorPaletteDataColors": value.colorPaletteDataColors.id,
          // "colorPaletteThemeColors": value.colorPaletteThemeColors,
          "filters": parentThis.vizFilters,
          "timeRange": value.timeRange,
          "thumbnail": response,
          "dataId": parentThis.currentDataSourceId,
          "ownerId": parentThis.userDetails.id,
        };
        parentThis.VizpadDataService.createViz(updateObj)
          .then(function(success) {
            angular.forEach(parentThis.vizArr, function(value, index) {
              if(value.title == success.title) {
                value.id = success.id;
                value.isSaved = true;
              }
              angular.forEach(parentThis.placementArr, function(pValue, index) {
                if(pValue.vizTitle == success.title) {
                  pValue.vizId = success.id;
                }
              });
            });
            totalSuccess ++;
            if(totalSuccess == parentThis.vizArr.length) {
              parentThis.saveVizpad();
            }
          }, function(error) {
            parentThis.ErrorHandlerService.error(error);
          });
        })
      .error(function(response) {
        parentThis.ErrorHandlerService.error(response);
      });
    });
  }

  saveVizpad() {
    var parentThis = this;
    this.vizIds = [];
    angular.forEach(this.vizArr, function(value, index) {
      if (typeof(value.id) != 'undefined' || value.id != null) {
        parentThis.vizIds.push(value.id);
      }
    });
    var updateVizPadObj = {};
    if (parentThis.vizPadObj.vizpadTitleChanged == true) {
      parentThis.vizPadObj.vizpadTitleChanged = false;
      updateVizPadObj = {
        "filters": parentThis.vizPadfilters,
        "vizs": this.vizIds,
        "placement": parentThis.placementArr,
        "title": parentThis.vizPadObj.title
      };
    } else {
      updateVizPadObj = {
        "filters": parentThis.vizPadfilters,
        "vizs": this.vizIds,
        "placement": parentThis.placementArr
      };
    }
    parentThis.VizpadDataService.updateVizPad(updateVizPadObj, parentThis.vizPadObj.id)
    .then(function(success) {
      parentThis.ErrorHandlerService.success('All the changes have been saved!');
    }, function(error) {
      parentThis.ErrorHandlerService.error(error);
    });
  }
  timelineChanged() {

    switch (this.timelineType) {
      case "today":
        this.vizPadObj.timeRange = {
          type: "custom",
          from: moment()
            .startOf('days')
            .format('L'),
          to: moment()
            .format('L')
        };
        if (this.dateColumns.length > 1) {
          this.showDateColumns()
        };
        break;
      case "yesterday":
        this.vizPadObj.timeRange = {
          type: "custom",
          from: moment()
            .subtract(1, 'days')
            .format('L'),
          to: moment()
            .format('L')
        };
        if (this.dateColumns.length > 1) {
          this.showDateColumns()
        };
        break;
      case "last5days":
        this.vizPadObj.timeRange = {
          type: "custom",
          from: moment()
            .subtract(5, 'days')
            .format('L'),
          to: moment()
            .format('L')
        };
        if (this.dateColumns.length > 1) {
          this.showDateColumns()
        };
        break;
      case "last7days":
        this.vizPadObj.timeRange = {
          type: "custom",
          from: moment()
            .subtract(7, 'days')
            .format('L'),
          to: moment()
            .format('L')
        };
        if (this.dateColumns.length > 1) {
          this.showDateColumns()
        };
        break;
      case "thisMonth":
        this.vizPadObj.timeRange = {
          type: "custom",
          from: moment()
            .startOf('month')
            .format('L'),
          to: moment()
            .format('L')
        };
        if (this.dateColumns.length > 1) {
          this.showDateColumns()
        };
        break;
      case "last30days":
        this.vizPadObj.timeRange = {
          type: "custom",
          from: moment()
            .subtract(30, 'days')
            .format('L'),
          to: moment()
            .format('L')
        };
        if (this.dateColumns.length > 1) {
          this.showDateColumns()
        };
        break;
      case "last3months":
        this.vizPadObj.timeRange = {
          type: "custom",
          from: moment()
            .subtract(5, 'months')
            .format('L'),
          to: moment()
            .format('L')
        };
        if (this.dateColumns.length > 1) {
          this.showDateColumns()
        };
        break;
      case "last6months":
        this.vizPadObj.timeRange = {
          type: "custom",
          from: moment()
            .subtract(6, 'months')
            .format('L'),
          to: moment()
            .format('L')
        };
        if (this.dateColumns.length > 1) {
          this.showDateColumns()
        };
        break;
      case "all":
        if (typeof this.vizPadObj != "undefined" && typeof this.vizPadObj.timeRange !=
          "undefined")
          this.vizPadObj.timeRange = {
            type: "all"
          }
    }
  }

  showRange(ev, $mdDialog, $scope) {
    var parentThis = this;

    this.$mdDialog.show({
        controller: RangeDialogController,
        template: rangepicker(),
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        bindToController: true,
        locals: {
          items: parentThis
        }
      })
      .then(function(answer) {
        parentThis.$scope.status = 'You said the information was "' +
          answer + '".';
      }, function() {
        parentThis.$scope.status = 'You cancelled the dialog.';
      });
  };


  showDate(ev, $mdDialog, $scope) {
    var parentThis = this;

    this.$mdDialog.show({
        controller: ShowDialogController,
        template: datepicker(),
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        bindToController: true,

      })
      .then(function(answer) {
        parentThis.$scope.status = 'You said the information was "' +
          answer + '".';
      }, function() {
        parentThis.$scope.status = 'You cancelled the dialog.';
      });
  };

  showDateColumns(ev, $mdDialog, $scope) {
    var parentThis = this;

    this.$mdDialog.show({
        controller: DateColumnController,
        template: timeline(),
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        bindToController: true,
        locals: {
          items: parentThis
        }
      })
      .then(function(answer) {
        parentThis.$scope.status = 'You said the information was "' +
          answer + '".';
      }, function() {
        parentThis.$scope.status = 'You cancelled the dialog.';
      });

  };

  showShare(ev, $mdDialog, $scope) {
    var parentThis = this;

    this.$mdDialog.show({
        controller: parentThis.shareVizController,
        template: share(),
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: {
          items: parentThis
        },
        clickOutsideToClose: true,
        bindToController: true,
        // fullscreen: $mdMedia('sm') && parentThis.$scope.customFullscreen,
      })
      .then(function(answer) {
        parentThis.$scope.status = 'You said the information was "' +
          answer + '".';
      }, function() {
        parentThis.$scope.status = 'You cancelled the dialog.';
      });

  };

  shareVizController($scope, $mdDialog, items) {
    var parentThis = this;
    this.$scope.usersList = [];
    this.$scope.selected = [];

    this.$scope.link = items.$location.absUrl();
    items.UserService.getAllUsers()
      .then(function(success) {
        parentThis.$scope.usersList = success.users;
        angular.forEach(parentThis.$scope.usersList, function(value, index) {
          var checkedObj = {
            id: value.id,
            email: value.email,
            username: value.username,
            value: false
          };
          if (checkedObj.id == items.vizPadObj.owner.id || checkedObj.id ==
            items.userDetails.id) {} else {
            parentThis.$scope.selected.push(checkedObj);
          }

        })

      }, function(error) {
        parentThis.ErrorHandlerService.error(error);
      });

    this.$scope.shareViz = function() {
      var sharedUsers = $.grep(parentThis.$scope.selected, function(e) {
        if (e.value == true) return e.id
      });
      var sharedUsersIds = [];
      angular.forEach(sharedUsers, function(value, index) {
        sharedUsersIds.push(value.id);
      });
      var updateObj = {
        sharingByLink: true,
        sharedWith: sharedUsersIds
      };
      items.VizpadDataService.updateVizPad(updateObj, items.vizPadObj.id)
        .then(function(success) {
          items.ErrorHandlerService.success('This vizpad is now shared with users you selected!');
        }, function(error) {
          items.ErrorHandlerService.error(error);
        });
    };

    this.$scope.copyToClipboard = function(element) {
      var $temp = $("<input>")
      $("body")
        .append($temp);
      $temp.val($(element)
          .val())
        .select();
      document.execCommand("copy");
      $temp.remove();
    }

    this.$scope.hide = function() {
      $mdDialog.hide();
    };
    this.$scope.cancel = function() {
      $mdDialog.cancel();
    };
    this.$scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };

  }
  showHierarchy(ev, $mdDialog, $scope) {
    var parentThis = this;

    this.$mdDialog.show({
        controller: parentThis.hierarchyController,
        template: hierarchy(),
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: {
          items: parentThis
        },
        clickOutsideToClose: true,
        bindToController: true,
        // fullscreen: $mdMedia('sm') && parentThis.$scope.customFullscreen,
      })
      .then(function(answer) {
        parentThis.$scope.status = 'You said the information was "' +
          answer + '".';
      }, function() {
        parentThis.$scope.status = 'You cancelled the dialog.';
      });

  };

  hierarchyController($scope, $mdDialog, items) {
    var parentThis = this;
    this.$scope.xColumns = _.uniq(items.xColumns);
    this.$scope.hierarchyArr = [];
    items.DatafileService.getDatasetDescription().then(function(success){
      angular.forEach(success.hierarchies, function(hValue, hIndex){
        var hierarchyObj = {
          name: hValue.name,
          columns:[],
          showAddBtn: true
        };
        angular.forEach(hValue.columns, function(cValue, cIndex){
          var columnObj = {
            value: cValue,
            showTitle: true
          };
          hierarchyObj.columns.push(columnObj);
          var tempXColumns = [];
          angular.forEach(parentThis.$scope.xColumns, function(value, index){
            tempXColumns.push(value.toLowerCase());
          });
          var cValueIndex = tempXColumns.indexOf(cValue);
          parentThis.$scope.xColumns.splice(cValueIndex, 1);
        });
        parentThis.$scope.hierarchyArr.push(hierarchyObj);
      })
    }, function(error){
      items.ErrorHandlerService.error(error);
    });

    this.$scope.deleteDimension = function(dimension, dimensionIndex) {
      angular.forEach(parentThis.$scope.hierarchyArr, function(value, index){
          if(value.columns.indexOf(dimension) != -1) {
            parentThis.$scope.xColumns.push(dimension.value);
            value.columns.splice(dimensionIndex,1);
          }
      });
    }

    this.$scope.deleteHierarchy = function(hierarchy, hierarchyIndex) {
      angular.forEach(parentThis.$scope.hierarchyArr, function(value, index){
          if(value.name == hierarchy.name) {
            parentThis.$scope.hierarchyArr.splice(hierarchyIndex,1);
            angular.forEach(hierarchy.columns, function(value, index){
              parentThis.$scope.xColumns.push(value.value);
            });
          }
      });
    }

    this.$scope.addDimension = function(hierarchy, hierarchyIndex) {
      angular.forEach(parentThis.$scope.hierarchyArr, function(value, index){
        value.showAddBtn = true;
      });
      hierarchy.showAddBtn = false;
    }

    this.$scope.dimensionAdded = function(hierarchy) {
      angular.forEach(parentThis.$scope.hierarchyArr, function(value, index){
        if(value.name == hierarchy.name && hierarchy.newDimension != null) {
          var dIndex = parentThis.$scope.xColumns.indexOf(hierarchy.newDimension);
          parentThis.$scope.xColumns.splice(dIndex, 1);
          var dimensionObj = {
            value: hierarchy.newDimension,
            showTitle: true
          };
          value.columns.push(dimensionObj);
          hierarchy.showAddBtn = true;
        }
      });
    }

    this.$scope.dimensionChanged = function(hierarchy, dimension) {
      angular.forEach(hierarchy.columns, function(value, index){
        if(value.value == dimension.value && dimension.newDimension != null) {
          parentThis.$scope.xColumns.push(value.value);
          var dIndex = parentThis.$scope.xColumns.indexOf(dimension.newDimension);
          parentThis.$scope.xColumns.splice(dIndex, 1);
          value.value = dimension.newDimension;
          dimension.showTitle = true;
        }
      });
    }

    this.$scope.saveHierarchy = function() {
      var updateHierarchyArr = [];
      angular.forEach(parentThis.$scope.hierarchyArr, function(hValue, hIndex){
        var updateObj = {
          name: hValue.name,
          columns: []
        };
        angular.forEach(hValue.columns, function(cValue, cIndex){
          updateObj.columns.push(cValue.value);
        });
        updateHierarchyArr.push(updateObj);
      });
      var updateDatasetObj = {
        hierarchies : updateHierarchyArr
      };
      items.DatafileService.updateDatasetDescription(updateDatasetObj).then(function(success){
        items.ErrorHandlerService.success('All changes in hierarchies are bieng saved!');
      }, function(error){
        items.ErrorHandlerService.error(error);
      })
    }

    this.$scope.addHierarchy = function() {
      var hierarchyObj = {
        name: 'Hierarchy ' + (parentThis.$scope.hierarchyArr.length + 1),
        columns:[],
        showAddBtn: true
      };
      parentThis.$scope.hierarchyArr.push(hierarchyObj);
    }

    this.$scope.hide = function() {
      $mdDialog.hide();
    };
    this.$scope.cancel = function() {
      $mdDialog.cancel();
    };
    this.$scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };

  }

  showCreateVizDialog(ev) {
    var parentThis = this;
    this.$mdDialog.show({
        controller: CreateVizController,
        template: create(),
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: parentThis.$mdMedia('sm') && parentThis.$scope.customFullscreen,
        locals: {
          items: parentThis
        },
        bindToController: true
      })
      .then(function(answer) {
        parentThis.$scope.status = 'You said the information was "' +
          answer + '".';
      }, function() {
        parentThis.$scope.status = 'You cancelled the dialog.';
      });
  }

  removeViz(viz, index) {
    var parentThis = this;
    this.vizArr.splice(index, 1);
    this.placementArr.splice(index, 1);
    this.vizIds = [];
    this.placementObjs = this.placementArr;
    angular.forEach(this.vizArr, function(value, index) {
      if ((typeof(value.id) != 'undefined' || value.id != null) && value.isSaved) {
        parentThis.vizIds.push(value.id);
      }
    });
    var newVizObj = {
      "vizs": this.vizIds,
      "placement": this.placementObjs
    };
    if(viz.isSaved) {
      parentThis.VizpadDataService.updateVizPad(newVizObj, parentThis.vizPadObj.id)
      .then(function(success) {
        parentThis.ErrorHandlerService.success('Successfully removed');
      }, function(error) {
        parentThis.ErrorHandlerService.error(error);
      });
    } else {
      parentThis.ErrorHandlerService.success('Successfully removed');
    }
  }

  showFilter(ev, $mdDialog, $scope) {
    var parentThis = this;
    this.$mdDialog.show({
        controller: DialogController,
        template: filter(),
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        bindToController: true,
        locals: {
          items: parentThis
        },

      })
      .then(function(answer) {
        parentThis.$scope.status = 'You said the information was "' +
          answer + '".';
      }, function() {
        parentThis.$scope.status = 'You cancelled the dialog.';
      });

  };
}
export default ChartViewCtrl;
