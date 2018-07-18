import share from './shareDialog.jade'
import create from './createDialog.jade'
// import datepicker from './../chartview/datePickerModal.jade'
// import rangepicker from './../chartview/dateRangePickerModal.jade'
import filter from './filterDialog.jade'
import ngMaterial from 'angular-material';
import moment from 'moment';
import _ from 'lodash';

/*@ngInject*/
function DialogController($scope, $mdDialog) {
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

class VizpadViewCtrl {
  /*@ngInject*/
  constructor($state, $scope, $mdDialog, $mdMedia, $timeout, $q, $log, ErrorHandlerService,
    VizpadDataService, UserService, $http, DatafileService, DatasetStorageService) {

    this.foo = 'bar';
    this.isOpen = false;
    var parentThis = this;

    // this.availableModes = ['md-fling', 'md-scale'];

    this.selectedMode = 'md-scale';
    this.selectedDirection = 'left';
    this.$scope = $scope;
    this.$mdDialog = $mdDialog;
    this.$timeout = $timeout;
    this.$q = $q;
    this.$log = $log;
    this.$state = $state;
    this.$mdMedia = $mdMedia;
    this.UserService = UserService;
    this.ErrorHandlerService = ErrorHandlerService;
    this.DatafileService = DatafileService;
    this.DatasetStorageService = DatasetStorageService;
    $scope.myDate = new Date();
    $scope.minDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth() - 2,
      $scope.myDate.getDate()
    );
    $scope.datasetWatcher = function(){
      parentThis.DatafileService.listColumns(true);
      parentThis.DatafileService.getDatasetDescription().then((success) => {
        parentThis.DatafileService.hierarchyArr = [];
        if(success.hierarchies.length > 0) {
         angular.forEach(success.hierarchies[0].columns, function(h){
           let tempObj = {
             hierarchy: h,
             current: false
           }
           parentThis.DatafileService.hierarchyArr.push(tempObj);
         });
       }
      }, (error) => {

      });;
      var datasetId = DatasetStorageService._currentSourceId;
      parentThis.getVizpad();

    };

    DatasetStorageService.on("DATASET_DID_CHANGE", $scope.datasetWatcher);

    $scope.$on("$destroy",function(){
      DatasetStorageService.off("DATASET_DID_CHANGE", $scope.datasetWatcher);
    });
    $scope.maxDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth() + 2,
      $scope.myDate.getDate()
    );
    this.simulateQuery = false;
    this.VizpadDataService = VizpadDataService;
    this.vizpadList = [];

    this.getVizpad();

    this.isDisabled = false;

    $scope.onlyWeekendsPredicate = function(date) {
      let day = date.getDay();
      return day === 0 || day === 6;
    };

    this.userDetails = this.UserService.getCurrentUserAuthData();
  }

  removeVizPad(vizpad, index) {
    this.VizpadDataService.removeVizPad(vizpad.id);
    this.vizpadList.splice(index, 1);
  }

  showChartView(ev, index) {
    this.VizpadDataService.setVizArr(this.vizpadList[index].vizs);
    this.VizpadDataService.setVizPadObj(this.vizpadList[index], index);
    this.$state.transitionTo(`app.vizpad.chartview`, {
      vizpadId : this.vizpadList[index].id
    });
  }

  getVizpad() {
    var parentThis = this;
    this.VizpadDataService.getAllVizpad().then(function(success){
      var datasetId = parentThis.DatasetStorageService._currentSourceId;
      parentThis.vizpadList = success.vizPads;
      parentThis.showCreateFirst = true;
      parentThis.lastActiveTime = [];
      parentThis.vizpadList = _.remove(parentThis.vizpadList, function(vizpad){
        if (typeof vizpad.vizs === "undefined" && vizpad.vizs.length == 0) {
          return true;
        }
        else if (vizpad.vizs.length > 0 && typeof vizpad.vizs[0].dataId != "undefined"){
          return vizpad.vizs[0].dataId == datasetId;
        }
      });

      angular.forEach(parentThis.vizpadList, function (value, index){

        if (value.vizs.length > 0 && value.vizs[0].thumbnail != "") {
          parentThis.DatafileService.getThumbnail(value.vizs[0].thumbnail).then(function(response){
            value.imgData = response;
          },function(error){
            // parentThis.ErrorHandlerService.error(error);
          });
        }

        if(typeof(value.updatedAt) != 'undefined') {
          parentThis.lastActiveTime.push(moment(value.updatedAt).fromNow());
        } else {
          parentThis.lastActiveTime.push(moment(value.createdAt).fromNow());
        }
      });
      },function(error){
        parentThis.ErrorHandlerService.error(error);
    });
  }

  CreateVizpad() {

    var self = this;
    var vizpadTitlesArr = [];
    this.vizpadTitle = "Untitled Vizpad";
    this.currentDataSourceId = this.DatasetStorageService._currentSourceId;
    self.VizpadDataService.getAllVizpad().then(function(success){
      angular.forEach(success.vizPads, function(value, index){
        vizpadTitlesArr.push(value.title);
      });

      var copyCountVizpad = 1;
      while(vizpadTitlesArr.indexOf(self.vizpadTitle) != -1) {
        self.vizpadTitle = "Untitled Vizpad " + copyCountVizpad;
        copyCountVizpad ++;
      }
      self.$timeout(function() {
        var VizpadObj = {
          "ownerId": self.userDetails.id,
          "title": self.vizpadTitle,
          "vizs": [],
          "placement": [],
          "layout": "{\"testLayoutProperty\": true}",
          "filters": [],
          "timeRange": {
            "type": "all"},
          "thumbnail": "",
          "sharingByLink": true,
          "sharedWith": [],
        };
        self.VizpadDataService.createVizpad(VizpadObj).then(function(success){
          self.vizpadList.push(VizpadObj);
          self.$state.transitionTo(`app.vizpad.chartview`,{vizpadId : success.id});
        }, function(error){
          self.ErrorHandlerService.error(error);
        });
      }, 300);
    }, function(error){
      self.ErrorHandlerService.error(error);
    });
  }

  showFilter(ev, $mdDialog, $scope) {
    var parentThis = this;

    this.$mdDialog.show({
      controller: DialogController,
      template: filter(),
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      // fullscreen: $mdMedia('sm') && parentThis.$scope.customFullscreen,
    })
    .then(function(answer) {
      parentThis.$scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      parentThis.$scope.status = 'You cancelled the dialog.';
    });
    parentThis.$scope.$watch(function() {
      // return $mdMedia('sm');
    }, function(sm) {
      parentThis.$scope.customFullscreen = (sm === true);
    });
  };


  showSubnav(x) {
    var parentThis = this;
    if (x == parentThis.$scope.showDropdown) {
      parentThis.$scope.showDropdown = 0;
    } else {
      parentThis.$scope.showDropdown = x;
    }
  };
}
export default VizpadViewCtrl;
