// import headerCellTemplate from './headerCell.jade';
import '../../api/wrapper/wrapper';

/*eslint-disable */
class VizpadDataService {
  /*@ngInject*/
  constructor($http, ApiWrapper, DatafileService, $q, $rootScope, $location) {
    this.api = ApiWrapper;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.vizObj = {};
    this.DatafileService = DatafileService;
    this.externalPath = DatafileService.filePath;
    this.$q = $q;
    this.fileId = '';
    var parentThis = this;
    this.vizPadId = this.$location.path()
      .split('vizPad/view/')[1];
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

  getWordCloudData(viz) {
    const defer = this.$q.defer();
    let req = {
      "id": this.DatafileService.fileId,
      "functiontype": "aggregate",
      "options": {
        "groupby": viz.xAxis.column,
        "aggregationtypes": "count",
        "aggtype-standard": "count",
        "aggregationcolumns": viz.xAxis.column,
      }
    }

    this.DatafileService.getAggregatedData(req)
      .then(function(response) {
        var wordCloudData = [];
        var arr = Object.keys(data[0]);
        var countVar = arr[1].split("_");

        angular.forEach(data, function(d) {
          let tempObj = {
            text: d[arr[0]],
            size: parseInt(d[arr[1]])
          }
          wordCloudData.push(tempObj);
        });
        defer.resolve(wordCloudData);
      }, function(error) {
        defer.reject();
      });

      return defer.promise;
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
            defered.reject(error);
          });

      }, function(error) {
        defer.reject(error);
      });

    return defer.promise;
  }

  getRadialProgressData(viz) {
    var parentThis = this;
    var defer = this.$q.defer();
    this.DatafileService.getFileId(this.externalPath, "csv")
      .then(function(success) {
        parentThis.fileId = success.id;
        var reqObj = {
          id: parentThis.fileId,
          viewtype: "colstats",
          options: {
            columnnames: viz.yAxis.column.split("_")[0]
          }
        }


        parentThis.DatafileService.getColStats(reqObj)
          .then(function(success) {
            defer.resolve(success);
          }, function(error) {
            defer.reject(error);
          })

      }, function(error) {});
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

  setVizPadObj(vizPadObj) {
    this.vizPadObj = vizPadObj;
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
            defered.reject(error);
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
            defered.reject(error);
          });

      }, function(error) {
        defer.reject(error);
      });

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

    var req = {
      "id": this.fileId,
      "functiontype": "aggregate",
      "options": {
        "groupby": xAxis,
        "aggregationtypes": vizObj.yAxis.aggregation,
        "aggtype-standard": vizObj.yAxis.aggregation,
        "aggregationcolumns": yAxis,
      }
    }
    var defer = this.$q.defer();

    this.DatafileService.getAggregatedData(req)
      .then(function(success) {
        defer.resolve(success);
      }, function(error) {
        defer.reject(error);
      });

    return defer.promise;
  }

  addFilter(filter, type, viz) {

    if (type === "viz")
      viz.filters.push(filter);
    else if (type === "vizPad")
      this.vizPadObj.filters.push(filter);
    else if (type === "timeLine")
      this.vizPadObj.timeRange = filter;

    if (filter.type && filter.type === "all") {
      type = "vizPad";
      this.vizPadObj.timeRange = {};
    };

    var requestObj = {};
    var filters = '';
    var vizFilters = '';
    var vizPadFilters = '';
    var sourceId = '';
    var timeLineFilter = '';
    var parentThis = this;
    var inputs = [];
    if (typeof(filter.secondValue) != 'undefined') {
      inputs.push(filter.value);
      inputs.push(filter.secondValue);
    } else
      inputs.push(filter.value);

    if (filter.from && filter.to) {
      timeLineFilter = filter.dateColumn + ">'" + filter.from + "'and " +
        filter.dateColumn + "<'" + filter.to + "'";
    };
    if (this.vizPadObj != 'undefined' && typeof this.vizPadObj != 'undefined') {
      console.log('in filtrer', parentThis.vizPadObj);
      angular.forEach(parentThis.vizPadObj.filters, function(filter, key) {
        if (parentThis.DatafileService.yColumns.indexOf(filter.column) !=
          -1) {
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

    var defer = this.$q.defer();

    this.DatafileService.getFileId(this.externalPath, "csv")
      .then(function(success) {
        parentThis.fileId = success.id;
        // parentThis.DatafileService.getTransformedData(success.id,filters).then(function(response){
        // var arr = parentThis.vizObj['y-axis'].split("_");
        var groupBy = viz.xAxis.column;
        if (parentThis.vizPadObj.timeRange.dateColumn) {
          var groupBy = groupBy + ',' + parentThis.vizPadObj.timeRange.dateColumn;
        }
        if (filter.column) {
          var groupBy = groupBy + ',' + filter.column;
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

        parentThis.DatafileService.getAggregatedId(req)
          .then(function(success) {

            parentThis.DatafileService.getTransformedData(success.id,
                filters)
              .then(function(response) {
                parentThis.DatafileService.getData(response.sourceId)
                  .then(function(success) {
                    defer.resolve(success);
                  }, function(error) {
                    defer.reject(error);
                  })
              }, function(error) {
                defered.reject(error);
              });
          }, function(error) {
            defer.reject(error);
          });
        // },function(error){
        //     defered.reject(error);
        // });

      }, function(error) {
        defer.reject(error);
      });

    return defer.promise;
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

export default VizpadDataService;
/*eslint-enable */
