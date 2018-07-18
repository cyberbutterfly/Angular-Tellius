import EventEmitter from 'eventemitter3';
import _ from 'lodash';
import catchAll from 'catch.all';

class DatasetAPI extends EventEmitter {
  /*@ngInject*/
  constructor(
    ApiWrapper, $q, $state,
    DatasetDescriptionModel
  ) {
    super();

    this.api = ApiWrapper;
    this.$q = $q;
    this.$state = $state;
    this.DatasetDescriptionModel = DatasetDescriptionModel;
  }

  makeRequest(payload) {
    return this.api.post('view', payload);
  }

  getDataset({
    sourceId,
    isSaved,
    ...options,
  }) {
    const {
      data,
      metadata,
      schema,
      typeStats,
      featurestats,
    } = options;

    const promises = [];

    if (data) {
      promises.push(this.getData({
        sourceId,
      }));
    }

    if (metadata) {
      promises.push(this.getMetadata({
        sourceId,
      }));
    }

    if (schema || typeStats) {
      promises.push(this.getSchema({
        sourceId,
        isSaved,
      }));
    }

    if (typeStats) {
      promises.push(this.getTypeStats({
        sourceId,
        columnnames: typeStats,
      }));
    }

    if (featurestats) {
      promises.push(this.getFeatureStats({
        sourceId,
        columnnames: featurestats,
          isSaved,
      }));
    }

    return this.$q.all(
        promises)
      .then((values) => {
        let dataset = values.reduce((prev, curr) => {
          return {
            ...prev,
            ...curr,
          };
        });

        const types = ['schema', 'typeStats', 'featurestats'];
        let res = [];

        types
          .filter(type => {
            return !_.isUndefined(dataset[type]);
          })
          .forEach(type => {
            switch (type) {
              case 'schema':
                dataset[type].fields.forEach((i, key) => {
                  const resItem = _.find(res, ({
                    name,
                  }) => {
                    return i.name === name;
                  });

                  if (_.isUndefined(resItem)) {
                    res.push({
                      name: i.name,
                      ..._.omit(i, ['name', 'fields']),
                    });
                  } else {
                    res.splice(key, 1, {
                      ..._.omit(i, ['columnName']),
                        ...resItem,
                    });
                  }
                });
                break;
              case 'typeStats':
                dataset[type].forEach((i, key) => {
                  const resItem = _.find(res, ({
                    name,
                  }) => {
                    return i.columnName === name;
                  });

                  if (_.isUndefined(resItem)) {
                    res.push({
                      name: i.columnName,
                      ..._.omit(i, ['columnName']),
                    });
                  } else {
                    res.splice(key, 1, {
                      ..._.omit(i, ['columnName']),
                        ...resItem,
                    });
                  }
                });

                break;
              case 'featurestats':
                dataset[type].forEach((i, key) => {
                  const resItem = _.find(res, ({
                    name,
                  }) => {
                    return i.columnName === name;
                  });

                  if (_.isUndefined(resItem)) {
                    res.push({
                      name: i.columnName,
                      ..._.omit(i, ['columnName']),
                    });
                  } else {
                    res.splice(key, 1, {
                      ..._.omit(i, ['columnName']),
                        ...resItem,
                    });
                  }
                });

                break;
              default:
            }
          });

        dataset.columnsInfo = res;

        if (typeStats) {
          dataset.schema = this._mergeSchemaTypeStats(dataset.schema,
            dataset.typeStats);
        }

        dataset.sourceId = sourceId;

        this.emit('DATASET_CHANGED', {
          dataset,
        });

        return dataset;
      })
      .catch(catchAll(promises)
        .then(errors => {
          if (errors.length) {
            console.log('DatasetAPI.getDataset errors:', errors);
            localStorage.removeItem('SelectedDatasetId');
            this.$state.go('app.dataset.list');
          }
          return errors;
        }));
  }

  deleteDataset({
    sourceId,
  }) {
    const payload = {
      id: sourceId,
    };

    return this.api.post('delete', payload);
  }

  getSchema({
    sourceId,
    isSaved,
  }) {
    const payload = {
      'id': sourceId,
      'viewtype': 'schema',
    };
    return new Promise((resolve, reject) => {
      if (isSaved) {
        this.DatasetDescriptionModel.getDatasetDescription({
            sourceId,
          })
          .then(({
            columns,
          }) => {
            const res = {
              schema: {
                fields: [],
              },
              columns: [],
            };
            columns.forEach(({
              name,
              type,
            }) => {
              res.schema.fields.push({
                name: name,
                dataType: 'IntegerType',
                type: type,
                fields: [],
              });

              res.columns.push(name);
            });
            resolve(res);
          }, reject);
      } else {
        this.makeRequest(payload)
          .then(this.setColumns)
          .then(resolve, reject);
      }
    });
  }

  getTypeStats({
    sourceId,
    nrows = '100',
      columnnames,
  }) {
    if (!_.isString(columnnames)) {
      columnnames = 'all';
    }

    nrows = nrows + '';
    const payload = {
      'id': sourceId,
      'viewtype': 'typestats',
      'options': {
        nrows,
        columnnames,
      },
    };

    return this.makeRequest(payload)
      .then(this.setColumns);
  }

  getFeatureStats({
    sourceId,
    columnnames,
    isSaved,
    maxcategories = '100',
  }) {
    if (!_.isString(columnnames)) {
      columnnames = 'all';
    }

    return new Promise((resolve, reject) => {
      console.log(1, 'getFeatureStats');
      if (isSaved) {
        console.log(2, 'getFeatureStats');
        this.DatasetDescriptionModel.getDatasetDescription({
            sourceId,
          })
          .then(({
            columns,
          }) => {
            const res = {
              featurestats: [],
            };
            columns.forEach(({
              name,
              type,
            }) => {
              res.featurestats.push({
                columnName: name,
                featureType: type,
                featureCategory: 'categorical',
              });
            });
            resolve(res);
          }, reject);
      } else {
        console.log(3, 'getFeatureStats');
        const payload = {
          id: sourceId,
          viewtype: 'featurestats',
          options: {
            columnnames,
            maxcategories,
          },
        };

        this.makeRequest(payload)
          .then(resolve, reject);
      }
    });
  }

  getData({
    sourceId,
    nrows = '100',
      columnnames = 'all',
  }) {
    nrows = nrows + '';
    const payload = {
      'id': sourceId,
      'viewtype': 'data',
      'options': {
        nrows,
        columnnames,
      },
    };

    return this.makeRequest(payload);
  }

  getMetadata({
    sourceId,
  }) {
    const payload = {
      'id': sourceId,
      'viewtype': 'metadata',
    };

    return this.makeRequest(payload);
  }

  getRootDataset({
    sourceId,
  }) {
    const payload = {
      options: {
        ids: sourceId,
      },
    };

    return this.api.post('list', payload)
      .then(res => {
        return {
          dataset: res.results[0],
        };
      });
  }

  getRootDatasetEx({
    sourceId,
  }) {
    return this.api.get('/api/datasetAttributes/' + sourceId)
      .then((res) => {
        return {
          dataset: res.datasetAttributes,
        };
      });
  }

  getList({
    ids,
    names,
    source,
  }) {
    if (!_.isString(ids) || !_.isString(names)) {
      ids = 'all';
    }

    const payload = {
      options: {
        ids,
        names,
        source,
      },
    };

    return this.api.post('list', payload)
      .then(res => {
        return {
          datasets: res.results,
        };
      });
  }

  getListEx() {
    //this.api.post(url, data, headers, spinner)
    return this.api.get('/api/datasetAttributes')
      .then((res) => {
        return {
          datasets: res.datasetAttributes,
        };
      })
      .then(({
        datasets,
      }) => {
        return {
          datasets: datasets.map(i => i.datasetAttributes),
        };
      });
  }

  setColumns(schema) {
    if (schema && schema.schema && schema.schema.fields) {
      let columns = schema.schema.fields.map((res) => {
        return res.name;
      });
      schema.columns = columns;
    }

    return schema;
  }

  _mergeSchemaTypeStats(datasetSchema, datasetTypeStats) {
    try {
      const schema = datasetSchema.fields.map(item => {
        const typeStats = _.omit(datasetTypeStats.filter(column => {
          return column.columnName === item.name;
        })[0], ['columnName']);

        return {
          typeStats: typeStats,
          ...item,
        };
      });

      return {
        fields: schema,
      };
    } catch (e) {
      return {
        fields: [],
      };
    }
  }

}

export default DatasetAPI;
