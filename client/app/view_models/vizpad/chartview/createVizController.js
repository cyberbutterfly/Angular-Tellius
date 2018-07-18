class CreateVizController {
  /*@ngInject*/
  constructor($scope, $mdDialog, items, DatasetStorageService, DatafileService) {
    var parentThis = this;
    this.$scope.vizPadObj  = items.vizPadObj;
    DatafileService.listColumns(false);
    this.$scope.xColumns  = DatafileService.xColumns;
    this.$scope.yColumns  = DatafileService.yColumns;
    this.$scope.items  = items;
    this.$scope.showLibraryTab = false;
    this.currentDataSourceId = DatasetStorageService._currentSourceId;

    items.newVizObj = {
        "ownerId": items.userDetails.id,
        "dataId": parentThis.currentDataSourceId,
        "type": parentThis.chart,
        "title": $scope.newVizName,
        "xAxis": {"column": $scope.newVizXColumn, "resolution": "weekly"},
        "yAxis": {"column": $scope.newVizYColumn, "aggregation": "avg"},
        "colorPaletteDataColors": "56d6b3e0c246301416f1ea09",
        "filters": [],
        "timeRange": {
            "type": "all",
            "filterColumn": "time"
        },
        "thumbnail": "",
        "third_column":"date",
        "fourth_column":"date"
    };
    if($('.tophead-right.largescreen').width() < 413) {
        this.$scope.showLibraryTab = true;
    }

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

      items.newVizObj.title = $scope.newVizName;
      items.newVizObj.yAxis.column = $scope.newVizYColumn;
      items.newVizObj.xAxis.column = $scope.newVizXColumn;

      items.VizpadDataService.createViz(items.newVizObj).then(function (success){
        parentThis.vizIds = [];
        angular.forEach(items.vizPadObj.vizs, function (value, index){
          if(typeof(value.id) != 'undefined' || value.id != null) {
            parentThis.vizIds.push(value.id);
          }
        });
        parentThis.vizIds.push(success.id);

        var twoCrossThreeObj = items.PlacementObjectService.getFreeSpace(2,3, items.vizPadObj.placement)
        var threeCrossThreeObj = items.PlacementObjectService.getFreeSpace(3,3, items.vizPadObj.placement)
        var fourCrossThreeObj = items.PlacementObjectService.getFreeSpace(4,3, items.vizPadObj.placement)
        var fiveCrossThreeObj = items.PlacementObjectService.getFreeSpace(5,3, items.vizPadObj.placement)
        var sixCrossThreeObj = items.PlacementObjectService.getFreeSpace(6,3, items.vizPadObj.placement)

        var newPlacementObj = {
          sizeY : 2,
          col : twoCrossThreeObj.col,
          vizId : success.id,
          sizeX : 3,
          row : twoCrossThreeObj.row
        }

        // if (threeCrossThreeObj.row == fourCrossThreeObj.row && threeCrossThreeObj.col == fourCrossThreeObj.col) {
        //     var newPlacementObj = {
        //       sizeY : 3,
        //       col : fourCrossThreeObj.col,
        //       vizId : success.id,
        //       sizeX : 4,
        //       row : fourCrossThreeObj.row
        //     }
        // } else {
        //     var newPlacementObj = {
        //       sizeY : 3,
        //       col : fourCrossThreeObj.col,
        //       vizId : success.id,
        //       sizeX : 3,
        //       row : fourCrossThreeObj.row
        //     }
        // }

        //  if (fourCrossThreeObj.row == fiveCrossThreeObj.row && fourCrossThreeObj.col == fiveCrossThreeObj.col) {
        //     var newPlacementObj = {
        //       sizeY : 3,
        //       col : fiveCrossThreeObj.col,
        //       vizId : success.id,
        //       sizeX : 5,
        //       row : fiveCrossThreeObj.row
        //     }
        // } else {
        //     var newPlacementObj = {
        //       sizeY : 3,
        //       col : fiveCrossThreeObj.col,
        //       vizId : success.id,
        //       sizeX : 4,
        //       row : fiveCrossThreeObj.row
        //     }
        // }

        // if (fiveCrossThreeObj.row == sixCrossThreeObj.row && fiveCrossThreeObj.col == sixCrossThreeObj.col) {
        //     var newPlacementObj = {
        //       sizeY : 3,
        //       col : sixCrossThreeObj.col,
        //       vizId : success.id,
        //       sizeX : 6,
        //       row : sixCrossThreeObj.row
        //     }
        // } else {
        //     var newPlacementObj = {
        //       sizeY : 3,
        //       col : sixCrossThreeObj.col,
        //       vizId : success.id,
        //       sizeX : 5,
        //       row : sixCrossThreeObj.row
        //     }
        // }

        // if (threeCrossThreeObj.row == sixCrossThreeObj.row && threeCrossThreeObj.col == sixCrossThreeObj.col) {
        //   var newPlacementObj = {
        //     sizeY : 3,
        //     col : freeSpaceObj.col,
        //     vizId : success.id,
        //     sizeX : 6,
        //     row : freeSpaceObj.row
        //   }
        // } else {
        //   var newPlacementObj = {
        //       sizeY : 3,
        //       col : freeSpaceObj.col,
        //       vizId : success.id,
        //       sizeX : 3,
        //       row : freeSpaceObj.row
        //     };
        // }

        items.placementArr.push(newPlacementObj);

        var newVizPadObj = {
          "vizs" : parentThis.vizIds,
          "placement" : items.placementArr

        };
        items.VizpadDataService.updateVizPad(newVizPadObj, items.vizPadObj.id).then(function(success){
          // items.vizArr.push(newVizPadObj["vizs"]);
          items.VizpadDataService.setVizArr(success.vizs);
          items.$rootScope.$broadcast('vizPadUpdated');
        }, function(error){
          items.ErrorHandlerService.error(error);
        });


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
}
export default CreateVizController;
