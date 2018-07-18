import moment from 'moment';

class VizViewCtrl {
  /*@ngInject*/
  constructor($state, $scope, $rootScope, $mdDialog, DatasetAPI, DatasetStorageService, $mdMedia, PlacementObjectService, DatafileService, $timeout, $q, $log, VizpadDataService, UserService, $http) {
    this.$q = $q;
    this.$log = $log;
    this.$http = $http;
    this.$state = $state;
    this.$scope = $scope;
    this.$mdMedia = $mdMedia;
    this.$timeout = $timeout;
    this.$mdDialog = $mdDialog;
    this.$rootScope = $rootScope;
    this.DatafileService = DatafileService;
    this.DatasetStorageService = DatasetStorageService;
    this.VizpadDataService = VizpadDataService;
    this.DatasetAPI = DatasetAPI;
    this.filePath = DatafileService.filePath;
    var parentThis = this;
    this.chartContainer = false;
    this.state = {

      'viztype': false,

      'legends': false,

      'filter': false,

      'settings': false,

      'compare': false,
    };
    this.callGraph = false;

    $scope.$on("dropDownStateChanged", function(event, args) {
      parentThis.toggleState(args.showDropdown);
    });
    this.currentDataset = this.DatasetStorageService.currentDataset;
    var Arr = this.currentDataset.schema.fields;
    this.axes = {};
    var count = {
      num : 0,
      str : 0
    };
    angular.forEach(Arr, (value, index) => {
      if(value.dataType == "StringType" && count.str == 0) {
        this.axes.x = value.name;
        count.str++;
      }
      if(value.dataType == "IntegerType" && count.num == 0) {
        this.axes.y = value.name;
        count.num++;
      }
    });

    parentThis.vizPadObj = {
        filterString : [],
        filters : [],
        id : "vizpadrandom",
        sharingByLink : true,
        timeRange : {
            dateColumn : "cdatetime",
            type : "all",
        },
        vizs : [{
            colorPaletteDataColors : {
                colors : ["#E0F7FA", "#B2EBF4", "#80DEEA", "#4DD0E1", "#26C6DA", "#00ACC1", "#0097A7", "#00808F", "#006064"],
                id : "56d6b3e0c246301416f1ea09"
            },
            dataId : parentThis.datasetId,
            enlargeView : false,
            filters : [],
            id : "random", // WHAT To Do here?
            loading : false,
            normalView : true,
            timeRange : {
                filterColumn : "time",
                type : "all",
            },
            title : "transform viz",
            type : "column",
            xAxis : {
                column : this.axes.x,
                resolution : "weekly"
            },
            yAxis : {
                aggregation : "avg",
                column : this.axes.y
            },
        }]
    };
    parentThis.vizObj = this.vizPadObj.vizs[0];
    parentThis.callGraph = true;
  }
  showSubnav(x) {
    var parentThis = this;
    if (x === '0' || x === 0) {
      for (var propt in this.state) {
        this.state[propt] = false;
      }
      parentThis.$scope.showDropdown = 0;
    } else {
      if (x == parentThis.$scope.showDropdown) {
        parentThis.$scope.showDropdown = 0;
      } else {
        parentThis.$scope.showDropdown = x;
      }
    }
  };

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
}
export default VizViewCtrl;
