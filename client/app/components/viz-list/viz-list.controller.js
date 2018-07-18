import moment from 'moment';

class VizListCtrl {
  /*@ngInject*/
  constructor($state, $scope, $rootScope, $mdDialog, DatasetStorageService, $mdMedia, PlacementObjectService, DatafileService, $timeout, $q, $log, VizpadDataService, UserService, $http) {
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
    this.DatasetStorageService = DatasetStorageService;
    this.PlacementObjectService = PlacementObjectService;
    this.isDisabled = false;
    this.VizpadDataService = VizpadDataService;
    this.currentDataSourceId = DatasetStorageService._currentSourceId;
    var parentThis = this;

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
        if(typeof(value.updatedAt) != 'undefined') {
          parentThis.lastActiveTime.push(moment(value.updatedAt).fromNow());
        } else {
          parentThis.lastActiveTime.push(moment(value.createdAt).fromNow());
        }
      });
      },function(error){
      console.log('error', error);
    });
    this.xColumns = [];
    this.yColumns = [];
    this.dateColumns = [ 'cdatetime', 'cdate2', 'ctime'];
    this.DatafileService.listColumns();
    DatasetStorageService.on('DATASET_DID_CHANGE', function(){
     parentThis.DatafileService.listColumns(true);
     parentThis.xColumns = parentThis.DatafileService.xColumns;
     parentThis.yColumns = parentThis.DatafileService.yColumns;
    });
    this.xColumns = this.DatafileService.xColumns;
    this.yColumns = this.DatafileService.yColumns;

    this.xColumns.push('cdatetime');
    this.xColumns.push('cdate2');
    this.xColumns.push('ctime');
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
        sizeX : value.sizeX,
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
    console.log('vizIds', this.vizIds, 'placementArr', this.placementArr);
    parentThis.VizpadDataService.updateVizPad(newVizObj, parentThis.vizPadObj.id).then(function(success){
      parentThis.$rootScope.$broadcast('vizPadUpdated');
      parentThis.VizpadDataService.setVizArr(success.vizs);
      parentThis.select(ev);
    }, function(error){
      console.log('error');
    });
  }
}
export default VizListCtrl;
