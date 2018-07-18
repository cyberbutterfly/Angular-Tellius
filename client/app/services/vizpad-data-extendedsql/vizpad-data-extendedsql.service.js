// import headerCellTemplate from './headerCell.jade';
import '../../api/wrapper/wrapper';

/*eslint-disable */
class VizpadDataExtendedSqlService {
  /*@ngInject*/
  constructor($http, ApiWrapper, DatafileService, $q, $rootScope, $location, DatasetStorageService) {
    this.api = ApiWrapper;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.vizObj = {};
    this.DatafileService = DatafileService;
    this.externalPath = DatafileService.filePath;
    this.DatasetStorageService = DatasetStorageService;
    this.$q = $q;
    this.fileId = '';
    var parentThis = this;
    this.currentDataset = this.DatasetStorageService.currentDataset;
    this.vizPadId = this.$location.path()
      .split('vizPad/view/')[1];
  }

  getCombineChartData(viz, vizpad) {
    let filters = '';
    let selectString = viz.xAxis.column + ','+ viz.yAxis.aggregation+'(' + viz.yAxis.column + ')';

    filters = this.getFilterString(viz, vizpad);

    let reqObj = {
      "datasetId": this.DatafileService.fileId, // this.name
      "from": this.DatafileService.fileId,
      "select": selectString,
      "groupBy": viz.xAxis.column,
      // "orderBy": "avg("+viz.yAxis.column+")",
      // "resolution": "monthly",
      "maximumAllowedRows": 100,
      "offset": 0
    }

    if (filters != '') {
      reqObj.where = filters;
    }

    const defer = this.$q.defer();

    this.DatafileService.extendedSqlObj(reqObj).then((success) => {

      let compareReqObj = {
        "datasetId": this.DatafileService.fileId, // this.name
        "from": this.DatafileService.fileId,
        "select": viz.xAxis.column + ','+ viz.yAxis.aggregation+'(' + viz.combinedGraphMeasure.column + ')',
        "groupBy": viz.xAxis.column,
        "maximumAllowedRows": 100,
        "offset": 0
      }

      if (filters != '') {
        reqObj.where = filters;
      }

      var result = {
        data: []
      };
      angular.forEach(success.rows, function(row) {
        let tempObj = {};
        tempObj[viz.xAxis.column] = row[0];
        tempObj[viz.yAxis.column] = row[1];
        result.data.push(tempObj);
      });

      this.DatafileService.extendedSqlObj(compareReqObj).then((compareData) => {
        let compareResult = {
          data: []
        };
        angular.forEach(compareData.rows, function(row) {
          let tempObj = {};
          tempObj[viz.xAxis.column] = row[0];
          tempObj[viz.combinedGraphMeasure.column] = row[1];
          compareResult.data.push(tempObj);
        });

        let finalData = {
          vizData: result,
          comparedData: compareResult
        };

        defer.resolve(finalData);
      }, (error) => {
          console.log("error", error)
      });

    }, (error) => {
        console.log("error", error)
    });

    return defer.promise;

  }


  createViz(vizObj) {
    var parentThis = this;
    var defer = this.$q.defer();

    var promise = this.api.post('/viz', vizObj);

    promise.then(function(success) {
      defer.resolve(success);
    }, function(error) {
      defer.reject(error);
    });
    return defer.promise;
  }

  setVizArr(vizObj) {
    this.vizObj = vizObj;
    // this.$rootScope.$broadcast('vizArrChanged');
  }

  getHeatmapData(file, viz, vizPad) {
    var defer = this.$q.defer();
    var parentThis = this;
    var filters = '';

    angular.forEach(vizPad.filters, function(filter) {

      if (typeof parseInt(filter.value) === "number") {
        filters += filter.column + filter.operator + filter.value +
          " and ";
      } else if (typeof parseInt(filter.value) === "string") {
        filters += filter.column + filter.operator + "'" + filter.value +
          "'" + " and ";
      };
    });

    if (typeof(viz) != 'undefined') {
      angular.forEach(viz.filters, function(filter) {
        if (typeof parseInt(filter.value) === "number") {
          filters += filter.column + filter.operator + filter.value +
            " and ";
        } else if (typeof parseInt(filter.value) === "string") {
          filters += filter.column + filter.operator + "'" + filter.value +
            "'" + " and ";
        };
      });
    }

    this.DatafileService.getFileId(this.externalPath, "csv")
      .then(function(success) {
        parentThis.DatafileService.getTransformedData(success.id, filters)
          .then(function(response) {

            if (viz.yAxis.column.indexOf("_") > -1) {
              var arr = viz.yAxis.column.split("_");
            } else {
              var arr = [];
              arr.push(parentThis.viz.yAxis.column);
            }


            if (typeof viz.color != "null") {
              var groupBy = viz.xAxis.column + ',' + viz.color;
            } else {
              var groupBy = viz.xAxis.column;
            }

            let req = {
              "id": success.id,
              "functiontype": "aggregate",
              "options": {
                "groupby": groupBy,
                "aggregationtypes": viz.yAxis.aggregation,
                "aggtype-standard": viz.yAxis.aggregation,
                "aggregationcolumns": viz.yAxis.column.split("_")[0],
              }
            }

            parentThis.DatafileService.getAggregatedData(req)
              .then(function(success) {
                defer.resolve(success);
              }, function(error) {
                defer.reject(error);
              });
          }, function(error) {
            defer.reject(error);
          });

      }, function(error) {
        defer.reject(error);
      });

    return defer.promise;
  }

  getBubbleGraphData(viz, vizPad) {
    var requestObj = {};
    var filters = '';
    var sourceId = '';
    var parentThis = this;
    var vizFilters = '';
    var vizPadFilters = '';
    var sourceId = '';
    var timeLineFilter = '';
    var parentThis = this;
    var inputs = [];
    console.log("this is viz", viz);
    if (viz.filters.length > 0) {

      let filter = viz.filters[0];

      inputs.push(filter.value);
      if (typeof(filter.secondValue) != 'undefined') {
        inputs.push(filter.secondValue);
      }

      if (filter.from && filter.to) {
        timeLineFilter = filter.dateColumn + ">'" + filter.from + "'and " +
          filter.dateColumn + "<'" + filter.to + "'";
      };
      if(typeof this.vizPadObj != 'undefined') {
        angular.forEach(this.vizPadObj.filters, function(filter, key) {
          if (parentThis.DatafileService.yColumns.indexOf(filter.column) != -
            1) {
            if (key == parentThis.vizPadObj.filters.length - 1) {
              vizFilters = parentThis.operatorToString("integer", filter.column,
                filter.operator, inputs);
            } else {
              vizFilters = parentThis.operatorToString("integer", filter.column,
                filter.operator, inputs) + "and";
            }
          } else {
            if (key == parentThis.vizPadObj.filters.length - 1) {
              vizFilters = parentThis.operatorToString("string", filter.column,
                filter.operator, inputs);
            } else {
              vizFilters = parentThis.operatorToString("string", filter.column,
                filter.operator, inputs) + "and";
            }
          }
        });
      }
      angular.forEach(viz.filters, function(filter, key) {

        if (parentThis.DatafileService.yColumns.indexOf(filter.column) != -
          1) {
          if (key == viz.filters.length - 1) {
            vizFilters = parentThis.operatorToString("integer", filter.column,
              filter.operator, inputs);
          } else {
            vizFilters = parentThis.operatorToString("integer", filter.column,
              filter.operator, inputs) + "and";
          }
        } else {
          if (key == viz.filters.length - 1) {
            vizFilters = parentThis.operatorToString("string", filter.column,
              filter.operator, inputs);
          } else {
            vizFilters = parentThis.operatorToString("string", filter.column,
              filter.operator, inputs) + "and";
          }
        }
      });

      if (vizFilters == '' && vizPadFilters != '')
        filters = vizPadFilters;
      else if (vizFilters != '' && vizPadFilters == '')
        filters = vizFilters
      else if (vizFilters != '' && vizPadFilters != '')
        filters = vizPadFilters + 'and' + vizFilters

      if (timeLineFilter != '')
        filters = timeLineFilter + filters;
    }
    var defer = this.$q.defer();

    let selectString = viz.label + ',' +  viz.yAxis.aggregation+'(' + viz.bubbleAxis + ')'  + ','+ viz.yAxis.aggregation+'(' + viz.yAxis.column + ')' + ','+ viz.yAxis.aggregation+'(' + viz.radius + ')';
    let list = this.DatasetStorageService.getList();
    angular.forEach(list,(value) => {
      if(value.id == this.currentDataset.sourceId) {
        this.name = value.name;
      }
    });
    const reqObj = {
      "datasetId": this.DatafileService.fileId, // this.name
      "from": this.DatafileService.fileId,
      "select": selectString,
      "groupBy": viz.label,
      // "orderBy": "avg("+viz.yAxis.column+")",
      // "resolution": "monthly",
      "maximumAllowedRows": 100,
      "offset": 0
    }

    if (filters != '') {
      reqObj.where = filters;
    }

    this.DatafileService.extendedSqlObj(reqObj)
      .then(function(success) {
        var result = {
          data: []
        };
        angular.forEach(success.rows, function(row) {
          let tempObj = {};
          tempObj[viz.bubbleAxis] = row[1];
          tempObj[viz.yAxis.column] = row[2];
          tempObj[viz.radius] = row[3];
          tempObj[viz.label] = row[0];
          result.data.push(tempObj);
        });
        console.log("this is the result", result);
        defer.resolve(result);
      }, function(error) {
        defer.reject(error);
      })

    return defer.promise;
  }

  getPolarChartData(viz, vizpad) {
    var requestObj = {};
    var filters = '';
    var sourceId = '';
    var parentThis = this;

    filters = this.getFilterString(viz, vizpad);

    var defer = this.$q.defer();

    let selectString = '';

    angular.forEach(viz.polarArea, (polarColumn) => {
        if (polarColumn != null) {
          selectString += ','+ polarColumn;
        }
    });

    if (selectString == '') {
      selectString = viz.yAxis.column;
    } else {
      selectString = selectString.substring(1);
    }

    let list = this.DatasetStorageService.getList();
    angular.forEach(list,(value) => {
      if(value.id == this.currentDataset.sourceId) {
        this.name = value.name;
      }
    });
    const reqObj = {
      "datasetId": this.DatafileService.fileId, // this.name
      "from": this.DatafileService.fileId,
      "select": selectString,
      "groupBy": viz.label,
      // "orderBy": "avg("+viz.yAxis.column+")",
      // "resolution": "monthly",
      "maximumAllowedRows": 100,
      "offset": 0
    }

    if (filters != '') {
      reqObj.where = filters;
    }

    this.DatafileService.extendedSqlObj(reqObj)
      .then(function(success) {
        var result = {
          data: []
        };
        angular.forEach(success.rows, function(row) {
          let tempObj = {};
          tempObj[viz.polarArea[0]] = parseInt(row[0]);
          if (viz.polarArea[1]) {
            tempObj[viz.polarArea[1]] = parseInt(row[1]);
          }
          if (viz.polarArea[2]) {
            tempObj[viz.polarArea[2]] = parseInt(row[2]);
          }
          result.data.push(tempObj);
        });

        defer.resolve(result);
      }, function(error) {
        defer.reject(error);
      })

    return defer.promise;
  }


  getRadialProgressData(viz) {
    var reqObj = {
      id: this.DatafileService.fileId,
      viewtype: "colstats",
      options: {
        columnnames: viz.yAxis.column.split("_")[0]
      }
    }

    var defer = this.$q.defer();

    this.DatafileService.getColStats(reqObj)
      .then(function(success) {
        defer.resolve(success);
      }, function(error) {
        defer.reject(error);
      })

    return defer.promise;
  }

  getVizArr() {
    this.vizArr = this.vizObj;
    angular.forEach(this.vizArr, function(value, index) {
      value.timeRange['dateColumn'] = '';
    });
    return this.vizArr;
  };

  getVizLibrary() {
    var parentThis = this;
    var defer = this.$q.defer();
    var promise = this.api.get('/viz');

    promise.then(function(success) {
      defer.resolve(success);
    }, function(error) {
      defer.reject(error);
    });
    return defer.promise;
  }

  updateViz(vizObj, id) {
    var parentThis = this;
    var defer = this.$q.defer();

    var promise = this.api.put('/viz/' + id, vizObj);

    promise.then(function(success) {
      defer.resolve(success);
    }, function(error) {
      defer.reject(error);
    });
    return defer.promise;
  }


  removeViz(vizId) {
    var parentThis = this;
    var defer = this.$q.defer();
    var promise = this.api.delete('/viz/' + vizId);

    promise.then(function(success) {
      defer.resolve(success);
    }, function(error) {
      defer.reject(error);
    });
    return defer.promise;
  }

  createVizpad(vizpadObj) {
    var parentThis = this;
    var defer = this.$q.defer();
    var promise = this.api.post('/vizpad', vizpadObj);

    promise.then(function(success) {
      defer.resolve(success);
    }, function(error) {
      defer.reject(error);
    });
    return defer.promise;
  }

  setVizPadObj(vizPadObj, index) {
    this.vizPadObj = vizPadObj;
    this.vizPadIndex = index;
  }

  getVizObj(id) {
    var parentThis = this;
    var defer = this.$q.defer();

    var promise = this.api.get('/viz/' + id);

    promise.then(function(success) {
      defer.resolve(success);
    }, function(error) {
      defer.reject(error);
    });
    return defer.promise;
  }

  getSelectedVizData(viz) {

    var requestObj = {};
    var filters = '';
    var sourceId = '';
    var parentThis = this;

    if (typeof viz != 'undefined') {
      angular.forEach(viz.filters, function(filter) {
        if (typeof parseInt(filter.value) === "number") {
          filters += filter.column + filter.operator + filter.value +
            " and ";
        } else if (typeof parseInt(filter.value) === "string") {
          filters += filter.column + filter.operator + "'" + filter.value +
            "'" + " and ";
        };
      });
    }

    var defer = this.$q.defer();

    this.DatafileService.getFileId(this.externalPath, "csv")
      .then(function(success) {
        parentThis.fileId = success.id;
        parentThis.DatafileService.getTransformedData(success.id, filters)
          .then(function(response) {

            if (viz.yAxis.column.indexOf("_") > -1) {
              var arr = viz.yAxis.column.split("_");
            } else {
              var arr = [];
              arr.push(viz.yAxis.column);
            }

            if (typeof viz.third_column != "undefined" && typeof viz.fourth_column !=
              "undefined") {
              var groupBy = viz.xAxis.column + ',' + viz.third_column +
                ',' + viz.fourth_column;
            } else if (typeof viz.third_column != "undefined") {
              var groupBy = viz.xAxis.column + ',' + viz.third_column;
            } else if (typeof viz.fourth_column != "undefined") {
              var groupBy = viz.xAxis.column + ',' + viz.fourth_column;
            } else {
              var groupBy = viz.xAxis.column;
            }

            let req = {
              "id": success.id,
              "functiontype": "aggregate",
              "options": {
                "groupby": groupBy,
                "aggregationtypes": viz.yAxis.aggregation,
                "aggtype-standard": viz.yAxis.aggregation,
                "aggregationcolumns": arr[0],
              }
            }

            parentThis.DatafileService.getAggregatedData(req)
              .then(function(success) {
                defer.resolve(success);
              }, function(error) {
                defer.reject(error);
              });
          }, function(error) {
            defer.reject(error);
          });

      }, function(error) {
        defer.reject(error);
      });

    return defer.promise;
  }

  getVizpadObj(id) {
    var parentThis = this;
    var defer = this.$q.defer();

    var promise = this.api.get('/vizpad/' + id);

    promise.then(function(success) {
      defer.resolve(success);
    }, function(error) {
      defer.reject(error);
    });
    return defer.promise;

  }

  getAllVizpad() {
    var parentThis = this;
    var defer = this.$q.defer();
    var promise = this.api.get('/vizpad?includingShared=true');

    promise.then(function(success) {
      defer.resolve(success);
    }, function(error) {
      defer.reject(error);
    });
    return defer.promise;
  }

  updateVizPad(vizObj, id) {
    var parentThis = this;
    var defer = this.$q.defer();
    var promise = this.api.put('/vizpad/' + id, vizObj);

    promise.then(function(success) {
      defer.resolve(success);
    }, function(error) {
      defer.reject(error);
    });
    return defer.promise;
  }

  removeVizPad(vizPadId) {
    var parentThis = this;
    var defer = this.$q.defer();
    var promise = this.api.delete('/vizpad/' + vizPadId);

    promise.then(function(success) {
      defer.resolve(success);
    }, function(error) {
      defer.reject(error);
    });
    return defer.promise;
  }

  getData(viz, vizpad) {

    let selectString = viz.xAxis.column + ','+ viz.yAxis.aggregation+'(' + viz.yAxis.column + ')';
    if (viz.drill.drillColumn != "" && viz.drill.column != viz.xAxis.column) {
      selectString = viz.drill.drillColumn + ','+ viz.yAxis.aggregation+'(' + viz.yAxis.column + ')';
    }

    let vizFilters = '';
    let vizPadFilters = '';
    const parentThis = this;
    let filters = '';


    angular.forEach(vizpad.filters, function(filter, key) {
      let inputs = [];
      inputs.push(filter.value);
      if (typeof filter.secondValue != "undefined") {
        inputs.push(filter.secondValue);
      }
      if (parentThis.DatafileService.yColumns.indexOf(filter.column) != -
        1) {
        if (key == vizpad.filters.length - 1) {
          vizPadFilters = parentThis.operatorToString("integer", filter.column,
            filter.operator, inputs);
        } else {
          vizPadFilters = parentThis.operatorToString("integer", filter.column,
            filter.operator, inputs) + "and";
        }
      } else {
        if (key == vizpad.filters.length - 1) {
          vizPadFilters = parentThis.operatorToString("string", filter.column,
            filter.operator, inputs);
        } else {
          vizPadFilters = parentThis.operatorToString("string", filter.column,
            filter.operator, inputs) + "and";
        }
      }
    });

    angular.forEach(viz.filters, function(filter, key) {
      let inputs = [];
      inputs.push(filter.value);
      if (typeof filter.secondValue != "undefined") {
        inputs.push(filter.secondValue);
      }
      if (parentThis.DatafileService.yColumns.indexOf(filter.column) != -
        1) {
        if (key == viz.filters.length - 1) {
          vizFilters = parentThis.operatorToString("integer", filter.column,
            filter.operator, inputs);
        } else {
          vizFilters = parentThis.operatorToString("integer", filter.column,
            filter.operator, inputs) + "and";
        }
      } else {
        if (key == viz.filters.length - 1) {
          vizFilters = parentThis.operatorToString("string", filter.column,
            filter.operator, inputs);
        } else {
          vizFilters = parentThis.operatorToString("string", filter.column,
            filter.operator, inputs) + "and";
        }
      }
    });

    // if (vizpad.timeRange.) {
    //
    //
    // }

    if (vizFilters == '' && vizPadFilters != '')
      filters = vizPadFilters;
    else if (vizFilters != '' && vizPadFilters == '')
      filters = vizFilters
    else if (vizFilters != '' && vizPadFilters != '')
      filters = vizPadFilters + 'and' + vizFilters

    // if (timeLineFilter != '')
    //   filters = timeLineFilter + filters;


    const reqObj = {
      "datasetId": this.DatafileService.fileId, // this.name
      "from": this.DatafileService.fileId,
      "select": selectString,
      "groupBy": viz.xAxis.column,
      // "orderBy": "avg("+viz.yAxis.column+")",
      // "resolution": "monthly",
      "maximumAllowedRows": 100,
      "offset": 0
    }
    
    if (filters != '') {
      reqObj.where = filters;
    } else if (viz.drill.drillColumn != "" && viz.drill.column != viz.xAxis.column) {
      reqObj.where = viz.drill.drillFilter;
      reqObj.groupBy = viz.drill.drillColumn;
    }

    if (reqObj.where == '') {
      delete reqObj.where;
    }
    const defer = this.$q.defer();

    this.DatafileService.extendedSqlObj(reqObj).then((success) => {
      var result = {
        data: []
      };
      angular.forEach(success.rows, function(row) {
        let tempObj = {};
        tempObj[viz.xAxis.column] = row[0];
        tempObj[viz.yAxis.column] = row[1];
        result.data.push(tempObj);
      });
      defer.resolve(result);
    }, (error) => {
        console.log("error", error)
    });

    return defer.promise;
  }

  getVizData(file, viz, vizPad) {

    var requestObj = {};
    var filters = '';
    var sourceId = '';
    var parentThis = this;

    if (typeof vizPad != 'undefined') {
      angular.forEach(vizPad.filters, function(filter) {
        if (typeof parseInt(filter.value) === "number") {
          filters += filter.column + filter.operator + filter.value +
            " and ";
        } else if (typeof parseInt(filter.value) === "string") {
          filters += filter.column + filter.operator + "'" + filter.value +
            "'" + " and ";
        };
      });
    }

    if (typeof(viz) != 'undefined') {
      angular.forEach(viz.filters, function(filter) {
        if (typeof parseInt(filter.value) === "number") {
          filters += filter.column + filter.operator + filter.value +
            " and ";
        } else if (typeof parseInt(filter.value) === "string") {
          filters += filter.column + filter.operator + "'" + filter.value +
            "'" + " and ";
        };
      });
    }

    var defer = this.$q.defer();

    let selectString = viz.xAxis.column + ','+ viz.yAxis.aggregation+'(' + viz.yAxis.column + ')';
    let list = this.DatasetStorageService.getList();
    angular.forEach(list,(value) => {
      if(value.id == this.currentDataset.sourceId) {
        this.name = value.name;
      }
    });
    const reqObj = {
      "datasetId": this.DatafileService.fileId, // this.name
      "from": this.DatafileService.fileId,
      "select": selectString,
      "groupBy": viz.xAxis.column,
      // "orderBy": "avg("+viz.yAxis.column+")",
      // "resolution": "monthly",
      "maximumAllowedRows": 100,
      "offset": 0
    }

    this.DatafileService.extendedSqlObj(reqObj)
      .then(function(success) {
        var result = {
          data: []
        };
        angular.forEach(success.rows, function(row) {
          let tempObj = {};
          tempObj[viz.xAxis.column] = row[0];
          tempObj[viz.yAxis.column] = row[1];
          result.data.push(tempObj);
        });
        defer.resolve(result);
      }, function(error) {
        defer.reject(error);
      })

    return defer.promise;
  }

  changeAxes(xAxis, yAxis, viz) {
    var vizObj;
    if (typeof viz != 'undefined') {
      vizObj = viz;
    } else {
      vizObj = this.vizObj[0];
    }

    vizObj.xAxis.column = xAxis;
    vizObj.yAxis.column = yAxis;

    let selectString = viz.xAxis.column + ','+ viz.yAxis.aggregation+'(' + viz.yAxis.column + ')';

    if (viz.lineThirdMeasure.column != '') {
      if (viz.lineThirdMeasure.aggregation == '') {
        viz.lineThirdMeasure.aggregation = 'avg'
      }
      selectString = viz.xAxis.column + ','+ viz.yAxis.aggregation+'(' + viz.yAxis.column + ')' +
                          ','+ viz.lineThirdMeasure.aggregation+'(' + viz.lineThirdMeasure.column + ')';
    }

    const reqObj = {
      "datasetId": this.DatafileService.fileId, // this.name
      "from": this.DatafileService.fileId,
      "select": selectString,
      "groupBy": vizObj.xAxis.column,
      // "orderBy": "avg("+vizObj.yAxis.column+")",
      "maximumAllowedRows": 100,
      "offset": 0
    }

    var defer = this.$q.defer();
    if (true) {};
    this.DatafileService.extendedSqlObj(reqObj)
      .then(function(success) {
        var result = {
          data: []
        };
        angular.forEach(success.rows, function(row) {
          let tempObj = {};
          tempObj[vizObj.xAxis.column] = row[0];
          tempObj[vizObj.yAxis.column] = row[1];
          result.data.push(tempObj);
        });

        defer.resolve(result);
      }, function(error) {
        defer.reject(error);
      })

    return defer.promise;
  }

  addFilter(filter, type, viz, vizpad) {
    this.vizPadObj = vizpad;
    // if (type === "viz")
    //   viz.filters.push(filter);
    // if (type === "vizPad")
    //   this.vizPadObj.filters.push(filter);
    // if (type === "timeLine" && typeof this.vizPadObj != 'undefined')
    //   vizpad.timeRange = filter;

    if (filter.type && filter.type === "all") {
      type = "vizPad";
      vizpad.timeRange = {};
    };
    console.log("filter", filter);
    var requestObj = {};
    var filters = '';
    var vizFilters = '';
    var vizPadFilters = '';
    var sourceId = '';
    var timeLineFilter = '';
    var parentThis = this;
    var inputs = [];

    inputs.push(filter.value);
    if (typeof(filter.secondValue) != 'undefined') {
      inputs.push(filter.secondValue);
    }

    if (filter.from && filter.to) {
      timeLineFilter = filter.dateColumn + ">'" + filter.from + "'and " +
        filter.dateColumn + "<'" + filter.to + "'";
    };
    if(typeof this.vizPadObj != 'undefined') {
      angular.forEach(this.vizPadObj.filters, function(filter, key) {
        if (parentThis.DatafileService.yColumns.indexOf(filter.column) != -
          1) {
          if (key == parentThis.vizPadObj.filters.length - 1) {
            vizFilters = parentThis.operatorToString("integer", filter.column,
              filter.operator, inputs);
          } else {
            vizFilters = parentThis.operatorToString("integer", filter.column,
              filter.operator, inputs) + "and";
          }
        } else {
          if (key == parentThis.vizPadObj.filters.length - 1) {
            vizFilters = parentThis.operatorToString("string", filter.column,
              filter.operator, inputs);
          } else {
            vizFilters = parentThis.operatorToString("string", filter.column,
              filter.operator, inputs) + "and";
          }
        }
      });
    }
    angular.forEach(viz.filters, function(filter, key) {

      if (parentThis.DatafileService.yColumns.indexOf(filter.column) != -
        1) {
        if (key == viz.filters.length - 1) {
          vizFilters = parentThis.operatorToString("integer", filter.column,
            filter.operator, inputs);
        } else {
          vizFilters = parentThis.operatorToString("integer", filter.column,
            filter.operator, inputs) + "and";
        }
      } else {
        if (key == viz.filters.length - 1) {
          vizFilters = parentThis.operatorToString("string", filter.column,
            filter.operator, inputs);
        } else {
          vizFilters = parentThis.operatorToString("string", filter.column,
            filter.operator, inputs) + "and";
        }
      }
    });

    if (vizFilters == '' && vizPadFilters != '')
      filters = vizPadFilters;
    else if (vizFilters != '' && vizPadFilters == '')
      filters = vizFilters
    else if (vizFilters != '' && vizPadFilters != '')
      filters = vizPadFilters + 'and' + vizFilters

    if (timeLineFilter != '')
      filters = timeLineFilter + filters;

    const defer = this.$q.defer();

    let selectString = viz.xAxis.column + ',avg(' + viz.yAxis.column +')';

    const reqObj = {
      "datasetId": this.DatafileService.fileId, // this.name
      "from": "airlines",
      "select": selectString,
      "groupBy": viz.xAxis.column,
      "where": filters,
      // "orderBy": "avg("+viz.yAxis.column+")",
      // "resolution": "monthly",
      "maximumAllowedRows": 100,
      "offset": 0
    }

    this.DatafileService.extendedSqlObj(reqObj)
      .then(function(success) {
        var result = {
          data: []
        };
        angular.forEach(success.rows, function(row) {
          let tempObj = {};
          tempObj[viz.xAxis.column] = row[0];
          tempObj[viz.yAxis.column] = row[1];
          result.data.push(tempObj);
        });
        defer.resolve(result);
      }, function(error) {
        defer.reject(error);
      })

      return defer.promise;
  }

  addAdvancedFilter(viz) {
    const defer = this.$q.defer();

    let selectString = viz.xAxis.column + ',avg(' + viz.yAxis.column +')';

    const reqObj = {
      "datasetId": this.DatafileService.fileId, // this.name
      "from": "airlines",
      "select": selectString,
      "groupBy": viz.xAxis.column,
      "where": this.DatafileService.filterString,
      // "orderBy": "avg("+viz.yAxis.column+")",
      // "resolution": "monthly",
      "maximumAllowedRows": 100,
      "offset": 0
    }

    this.DatafileService.extendedSqlObj(reqObj)
      .then(function(success) {
        var result = {
          data: []
        };
        angular.forEach(success.rows, function(row) {
          let tempObj = {};
          tempObj[viz.xAxis.column] = row[0];
          tempObj[viz.yAxis.column] = row[1];
          result.data.push(tempObj);
        });

        defer.resolve(result);
      }, function(error) {
        defer.reject(error);
      })

      return defer.promise;
  }

  getStackedChartData(viz, vizpad) {
    const defer = this.$q.defer();

    let selectString = viz.xAxis.column + ',' + viz.color + ',' + viz.yAxis.column;
    const reqObj = {
      "datasetId": this.DatafileService.fileId,
      "datasetId": this.DatafileService.fileId,
      "select": selectString,
      "groupBy": viz.color + ',' + viz.xAxis.column ,
      "maximumAllowedRows": 100,
      "offset": 0
    }

    this.DatafileService.extendedSqlObj(reqObj).then((success) => {
      var result = {
        data: []
      };
      angular.forEach(success.rows, function(row) {
        let tempObj = {};
        tempObj[viz.xAxis.column] = row[0];
        tempObj[viz.color] = row[1];
        tempObj[viz.yAxis.column] = row[2];
        result.data.push(tempObj);
      });
      defer.resolve(result);
    }, (error) => {
      defer.reject(error)
    });
    return defer.promise;
  }

  getMultipleLineVizData(viz, vizpad) {

    let selectString = viz.xAxis.column + ',avg(' + viz.yAxis.column +')';

    let filters = '';

    if (viz.lineThirdMeasure.column != '') {
      selectString = viz.xAxis.column + ','+ viz.yAxis.aggregation+'(' + viz.yAxis.column + ')' +
                          ','+ viz.lineThirdMeasure.aggregation+'(' + viz.lineThirdMeasure.column + ')';
    }

    filters = this.getFilterString(viz, vizpad);

    const reqObj = {
      "datasetId": this.DatafileService.fileId, // this.name
      "from": this.DatafileService.fileId,
      "select": selectString,
      "groupBy": viz.xAxis.column,
      "maximumAllowedRows": 100,
      "offset": 0
    }

    if (filters != '') {
      reqObj.where = filters;
    }

    const defer = this.$q.defer();
    this.DatafileService.extendedSqlObj(reqObj).then((success) => {
        defer.resolve(success);
    }, (error) => {
        defer.reject(error);
    });

    return defer.promise;

  }

  getFilterString(viz, vizpad) {
    let vizFilters = '';
    let vizPadFilters = '';
    const parentThis = this;
    let filters = '';


    angular.forEach(vizpad.filters, function(filter, key) {
      let inputs = [];
      inputs.push(filter.value);
      if (typeof filter.secondValue != "undefined") {
        inputs.push(filter.secondValue);
      }
      if (parentThis.DatafileService.yColumns.indexOf(filter.column) != -
        1) {
        if (key == vizpad.filters.length - 1) {
          vizPadFilters = parentThis.operatorToString("integer", filter.column,
            filter.operator, inputs);
        } else {
          vizPadFilters = parentThis.operatorToString("integer", filter.column,
            filter.operator, inputs) + "and";
        }
      } else {
        if (key == vizpad.filters.length - 1) {
          vizPadFilters = parentThis.operatorToString("string", filter.column,
            filter.operator, inputs);
        } else {
          vizPadFilters = parentThis.operatorToString("string", filter.column,
            filter.operator, inputs) + "and";
        }
      }
    });

    angular.forEach(viz.filters, function(filter, key) {
      let inputs = [];
      inputs.push(filter.value);
      if (typeof filter.secondValue != "undefined") {
        inputs.push(filter.secondValue);
      }
      if (parentThis.DatafileService.yColumns.indexOf(filter.column) != -
        1) {
        if (key == viz.filters.length - 1) {
          vizFilters = parentThis.operatorToString("integer", filter.column,
            filter.operator, inputs);
        } else {
          vizFilters = parentThis.operatorToString("integer", filter.column,
            filter.operator, inputs) + "and";
        }
      } else {
        if (key == viz.filters.length - 1) {
          vizFilters = parentThis.operatorToString("string", filter.column,
            filter.operator, inputs);
        } else {
          vizFilters = parentThis.operatorToString("string", filter.column,
            filter.operator, inputs) + "and";
        }
      }
    });

    // if (vizpad.timeRange.) {
    //
    //
    // }

    if (vizFilters == '' && vizPadFilters != '')
      filters = vizPadFilters;
    else if (vizFilters != '' && vizPadFilters == '')
      filters = vizFilters
    else if (vizFilters != '' && vizPadFilters != '')
      filters = vizPadFilters + 'and' + vizFilters

    // if (timeLineFilter != '')
    //   filters = timeLineFilter + filters;

    return filters;

  }

  operatorToString(dataType, columnName, operator, inputs) {

    switch (dataType) {
      case 'integer':
        switch (operator) {
          case 'Less Than':
            return columnName + " > " + inputs[0];
            break;

          case 'Less Than or equal to':
            return columnName + " <= " + inputs[0];
            break;

          case 'Equal To':
            return columnName + " = " + inputs[0];
            break;

          case 'Between':
            return columnName + " >= " + inputs[0] + " and " + columnName +
              " <= " + inputs[1];
            break;

          case 'Greater Than':
            return columnName + " > " + inputs[0];
            break;

          case 'Greater Than or equal to':
            return columnName + " >= " + inputs[0];
            break;
        }
        break;

      case 'string':
        switch (operator) {
          case 'Equal To':

            return columnName + " = '" + inputs[0] + "'";
            break;

          case 'Does not equals':
            return columnName + " != '" + inputs[0] + "'";
            break;

          case 'Contains':
            return columnName + " like '%" + inputs[0] + "%'";
            break;

          case 'Does not contain':
            return columnName + " not like '%" + inputs[0] + "%'";
            break;

          case 'Contains but does not contain':
            return columnName + " like '%" + inputs[0] + "%' and " +
              columnName + " not like '%" + inputs[1] + "%'";
            break;

          case 'Ends with':
            return columnName + " like '%" + inputs[0] + "'";
            break;

          case 'Ends with':
            return columnName + " not like '%" + inputs[0] + "'";
            break;

          case 'Starts with':
            return columnName + " like " + inputs[0] + "%'";
            break;

          case 'Does not start with':
            return columnName + " not like " + inputs[0] + "%'";
            break;

        }
        break;
    }
  }
}

export default VizpadDataExtendedSqlService;
/*eslint-enable */
