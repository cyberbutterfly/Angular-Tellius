import moment from 'moment';
import create from './../vizpad-view/createDialog.jade'
// import showViz from './../vizpad/showViz.jade'

class VizLibraryCtrl {
  /*@ngInject*/
  constructor($state, $scope, $rootScope, $mdDialog, $mdMedia, ErrorHandlerService, PlacementObjectService, DatafileService, $timeout, $q, $log, VizpadDataService, UserService, $http, DatasetStorageService) {
    this.foo = 'bar';
    this.$scope = $scope;
    this.$http = $http;
    this.$mdDialog = $mdDialog;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.UserService = UserService;
    this.$q = $q;
    this.$log = $log;
    this.$state = $state;
    this.$mdMedia = $mdMedia;
    this.DatafileService = DatafileService;
    this.PlacementObjectService = PlacementObjectService;
    this.ErrorHandlerService = ErrorHandlerService;
    this.isDisabled = false;
    this.VizpadDataService = VizpadDataService;
    this.currentDataSourceId = DatasetStorageService._currentSourceId;
    var parentThis = this;
    DatasetStorageService.on('DATASET_DID_CHANGE', function(){
     parentThis.DatafileService.listColumns(true);
     parentThis.xColumns = parentThis.DatafileService.xColumns;
     parentThis.yColumns = parentThis.DatafileService.yColumns;
    });
    this.userDetails = this.UserService.getCurrentUserAuthData();
    this.VizpadDataService.getVizLibrary().then(function(success){
      parentThis.vizLibrary = success.vizs;
      parentThis.vizLibrary = _.remove(parentThis.vizLibrary, function(viz){
        if (typeof viz.dataId != "undefined"){
          return viz.dataId == parentThis.currentDataSourceId;
        }
      });
      parentThis.lastActiveTime = [];
      angular.forEach(parentThis.vizLibrary, function (value, index){
        $http({
          method: 'GET',
          url: "/thumbnail/"+value.thumbnail,
        }).then(function successCallback(response) {
            value.imgData = response;
          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

        if(typeof(value.updatedAt) != 'undefined') {
          parentThis.lastActiveTime.push(moment(value.updatedAt).fromNow());
        } else {
          parentThis.lastActiveTime.push(moment(value.createdAt).fromNow());
        }
      });
      },function(error){
      parentThis.ErrorHandlerService.error(error);
    });
    this.xColumns = [];
    this.yColumns = [];
    this.dateColumns = [ 'cdatetime', 'cdate2', 'ctime'];
    this.DatafileService.listColumns();
    this.xColumns = this.DatafileService.xColumns;
    this.yColumns = this.DatafileService.yColumns;

  }

  loadFromExistingViz(ev, index, viz) {
    var parentThis = this;
    parentThis.vizIds = [];
    parentThis.placementArr = [];

    angular.forEach(parentThis.vizPadObj.vizs, function (value, index){
      if(typeof(value.id) != 'undefined' || value.id != null) {
        parentThis.vizIds.push(value.id);
      }
    });
    this.vizIds.push(viz.id);

    angular.forEach(parentThis.vizPadObj.placement, function (value, index){
      var placementObj = {
        sizeY : value.sizeY,
        col : value.col,
        vizId : value.vizId,
        sizeX  : value.sizeX,
        row : value.row
      };
      parentThis.placementArr.push(placementObj);
    });

    var freeSpaceObj = this.PlacementObjectService.getFreeSpace(3,3, parentThis.vizPadObj.placement)

    var newPlacementObj = {
        sizeY : 3,
        col : freeSpaceObj.col,
        vizId : viz.id,
        sizeX : 3,
        row : freeSpaceObj.row
      };

    this.placementArr.push(newPlacementObj);

    var newVizObj = {
      "vizs" : parentThis.vizIds,
      "placement" : this.placementArr

    };
    parentThis.VizpadDataService.updateVizPad(newVizObj, parentThis.vizPadObj.id).then(function(success){
      parentThis.$rootScope.$broadcast('vizPadUpdated');
      parentThis.VizpadDataService.setVizArr(success.vizs);
      parentThis.select(ev);
    }, function(error){
      parentThis.ErrorHandlerService.error(error);
    });
  }

  removeViz(viz, index) {
    this.VizpadDataService.removeViz(viz.id);
    this.vizLibrary.splice(index, 1);
  }

  showCreateViz(ev) {
    var parentThis = this;
    this.$mdDialog.show({
      controller: parentThis.CreateVizController,
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
      parentThis.$scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      parentThis.$scope.status = 'You cancelled the dialog.';
    });
    parentThis.$scope.$watch(function() {
      return parentThis.$mdMedia('sm');
    }, function(sm) {
      parentThis.$scope.customFullscreen = (sm === true);
    });
  }

  CreateVizController($scope, $mdDialog, items) {

    var parentThis = this;
    this.$scope.xColumns  = items.xColumns;
    this.$scope.yColumns  = items.yColumns;

    this.$scope.selectChartForNewViz = function (chart) {
      items.selectSubType(chart);
      parentThis.chart = chart;
    }

    this.$scope.titleChange = function (newVizName) {
      parentThis.$scope.newVizName = newVizName;
    }

    this.$scope.yAxisChanged = function (newVizYColumn) {
      parentThis.$scope.newVizYColumn = newVizYColumn;
    }

    this.$scope.xAxisChanged = function (newVizXColumn) {
      parentThis.$scope.newVizXColumn = newVizXColumn;
    }

    this.$scope.$on("newVizGraphTypeChanged",function(event, args){
      parentThis.chart = args.graphName;
    });

    this.$scope.showLibrary = function(ev){
      items.chartView = false;
    };

    this.$scope.addViz = function(){
      items.newVizObj = {
        "ownerId": items.userDetails.id,
        "dataId": items.currentDataSourceId,
        "type": parentThis.chart,
        "title": parentThis.$scope.newVizName,
        "xAxis": {"column": parentThis.$scope.newVizXColumn, "resolution": "weekly"},
        "yAxis": {"column": parentThis.$scope.newVizYColumn, "aggregation": "avg"},
        "colorPaletteDataColors": "56d6b295c246301416f1ea07",
        "filters": [],
        "timeRange": {
            "type": "all",
            "filterColumn": "time"
        },
        "thumbnail": "",
        "third_column":"date",
        "fourth_column":"date"
      };

      items.VizpadDataService.createViz(items.newVizObj).then(function (success){
        items.vizLibrary.push(success);
        items.lastActiveTime.push(moment(success.updatedAt).fromNow());

      }, function(error){
        items.ErrorHandlerService.error(error);
      });
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
  showVizView($event, $index, viz) {
    this.$state.transitionTo(`app.vizpad.viz`,{vizId : viz.id});
  }
}
export default VizLibraryCtrl;
