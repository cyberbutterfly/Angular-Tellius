import {TRANSFORM_TYPES, NULL_TYPES} from "./ml-transformation.types";
import PromiseSeries from "promise-series";
import _ from "lodash";

export class MLTransformation {
  /*@ngInject*/
  constructor($q, MLAPI, TransformAPI) {
    this.$q           = $q;
    this.MLAPI        = MLAPI;
    this.TransformAPI = TransformAPI;
  }

  columnTransformation(
    {
      targetVariable,
      sourceId,
      columns,
      schema,
    }
  ) {
    if (!_.isString(targetVariable) || !_.isString(sourceId) || !_.isArray(
        columns)) {
      return this.$q.reject('Wrong arguments');
    }

    const cols = this._transformInputData({
      columns,
    });

    return this._handleNull({
      targetVariable,
      sourceId,
      columns: cols,
      schema,
    })
      .then(this._toDecimal.bind(this))
      .then(this._setSubsetSourceId.bind(this))
      // .then(this._multiStringIndex.bind(this))
      .then(this._labelIndexer.bind(this))
      .then(this._targetVariableIndexer.bind(this))
      .then(this._oneHotEncoderTransform.bind(this))
      .then(this._standardScalar.bind(this))
      .then(this._minmaxScaler.bind(this))
      .then(this._vectorAssembler.bind(this));
  }

  getTransformTypes() {
    return TRANSFORM_TYPES;
  }

  getNullTypes() {
    return NULL_TYPES;
  }

  _handleNull(
    {
      targetVariable,
      sourceId,
      columns,
      schema,
    }
  ) {
    const transformTypes    = this.getTransformTypes();
    const TransformTypeKeys = Object.keys(transformTypes)
      .map(i => {
        return transformTypes[i];
      });

    const uniqTransformTypes = _.uniqWith(_.flatten(TransformTypeKeys), (a, b) => {
      return a.value === b.value;
    });

    const cols = uniqTransformTypes
      .filter(type => {
        return type.value !== 'noScalar';
      })
      .map(type => {
        return type.value;
      })
      .filter(type => {
        return !_.isUndefined(columns[type]);
      })
      .map(item => {
        return columns[item]
          .map(column => {
            return column;
          });
      })
      .map(i => {
        return i;
      })
      .reduce((prev, i) => {
        return prev.push(i);
      })
      .reduce((prev, column) => {
        const type = column.handleNull.value;

        if (_.isUndefined(prev[type])) {
          prev[type] = [];
        }

        prev[type].push(column.name);

        return prev;
      }, {});

    return Object.keys(cols)
      .reduce((prev, key) => {
        const columnNames = cols[key];

        return prev.then(data => {
          return this.TransformAPI.handleNull({
            sourceId: data.sourceId,
            columnNames: columnNames.join(','),
            handleWith: key,
          })
            .then(res => {
              return {
                sourceId: res,
              };
            });
        });
      }, this.$q.resolve({
        sourceId: sourceId,
      }))
      .then(res => {
        return {
          sourceId: res.sourceId,
          initialSourceId: res.sourceId,
          targetVariable,
          columns,
          schema,
        };
      })
      .catch(err => console.log(err));
  }

  _transformInputData(
    {
      columns,
    }
  ) {
    const result = columns.reduce((prev, column) => {
      const columnType = column.feature.value;

      if (_.isUndefined(prev[columnType])) {
        prev[columnType] = [column];
      } else {
        prev[columnType].push(column);
      }
      return prev;
    }, {});

    return result;
  }

  _labelIndexer(
    {
      targetVariable,
      sourceId,
      initialSourceId,
      subsetSourceId,
      columns,
      schema,
      pipelineIds = [],
    }
  ) {
    return new Promise((resolve) => {
      const columnNames = _.map(_.flatten(_.values(columns)), column => {
        return column.name;
      });
      const series      = new PromiseSeries();
      for (const column of columnNames) {
        const promise = (data) => {
          return this.MLAPI.labelIndexer({
            sourceId: data ? data.id : sourceId,
            inputColumn: column,
            outputColumn: 'index_' + column,
          })
            .then(res => {
              if (!_.isUndefined(data)) {
                pipelineIds.push(data.id);
              }
              return res;
            });
        };
        series.add(promise);
      }

      try {
        series.run()
          .then((data) => {
            pipelineIds.push(data.id);
            resolve({
              targetVariable,
              sourceId: data.id,
              initialSourceId,
              subsetSourceId,
              columns,
              schema,
              pipelineIds,
            });
          });
      }
      catch (e) {
        resolve({
          targetVariable,
          sourceId,
          initialSourceId,
          subsetSourceId,
          columns,
          schema,
          pipelineIds,
        });
      }
    });
  }

  _oneHotEncoderTransform(
    {
      targetVariable,
      sourceId,
      labelIndex,
      initialSourceId,
      subsetSourceId,
      columns = [],
      schema,
      pipelineIds = [],
    }
  ) {
    return new Promise(resolve => {
      const TransformType = 'oneHotEncoding';

      if (!_.isArray(columns[TransformType])) {
        resolve({
          targetVariable,
          sourceId,
          initialSourceId,
          subsetSourceId,
          labelIndex,
          columns,
          schema,
          pipelineIds,
        });
      } else {
        const columnNames = _.map(columns[TransformType]
          .filter(i => {
            return i.type !== 'continuous';
          })
          .filter(type => {
            return type.value !== 'noScalar';
          }), column => {
          return column.name;
        });

        const series = new PromiseSeries();

        for (const column of columnNames) {
          const promise = (data) => {
            return this.MLAPI.oneHotEncoder({
              sourceId: data ? data.id : sourceId,
              inputColumn: 'index_' + column,
              outputColumn: `${TransformType}_${column}`,
            })
              .then(res => {
                if (!_.isUndefined(data)) {
                  pipelineIds.push(data.id);
                }
                return res;
              });
          };

          series.add(promise);
        }

        try {
          series.run()
            .then((data) => {
              pipelineIds.push(data.id);

              resolve({
                targetVariable,
                sourceId: data.id,
                initialSourceId,
                subsetSourceId,
                labelIndex,
                columns,
                schema,
                pipelineIds,
              });
            });
        }
        catch (e) {
          resolve({
            targetVariable,
            sourceId,
            initialSourceId,
            subsetSourceId,
            labelIndex,
            columns,
            schema,
            pipelineIds,
          });
        }
      }
    });
  }

  _vectorAssembler(
    {
      targetVariable,
      sourceId,
      initialSourceId,
      labelIndex,
      subsetSourceId,
      columns,
      schema,
      pipelineIds = [],
    }
  ) {
    const IndexedColumns = this.__getIndexedColumns({columns});

    return this.MLAPI.vectorAssembler({
      sourceId: sourceId,
      inputColumns: IndexedColumns,
      outputColumn: 'features',
    })
      .then((
        {
          id,
        }
      ) => {
        pipelineIds.push(id);
        return {
          targetVariable,
          sourceId: id,
          initialSourceId,
          subsetSourceId,
          labelIndex,
          columns,
          schema,
          pipelineIds,
        };
      });
  }

  _minmaxScaler(
    {
      targetVariable,
      sourceId,
      initialSourceId,
      labelIndex,
      subsetSourceId,
      columns,
      schema,
      pipelineIds = [],
    }
  ) {
    const TransformType = 'minmaxScalar';
    return new Promise((resolve, reject) => {

      const columnNames = _.map(columns[TransformType], column => {
        return column.name;
      })
      .filter(type => {
        return type.value !== 'noScalar';
      });

      const series = new PromiseSeries();

      for (const column of columnNames) {
        const promise = (data) => {
          return this.MLAPI.multiStringIndex({
            sourceId: data ? data.sourceId : sourceId,
            inputColumns: `${column}`,
            outputColumn: `${TransformType}_${column}_vector`,
          })
            .then(multiStringResult => {
              if (!_.isUndefined(multiStringResult)) {
                pipelineIds.push(multiStringResult.sourceId);
              }

              const currentColumn = _.find(_.flatten(_.values(columns)), (v) => {
                return v.name === column;
              });

              return this.MLAPI.minmaxScaler({
                sourceId: multiStringResult.sourceId,
                inputColumn: `${TransformType}_${column}_vector`,
                outputColumn: `${TransformType}_${column}`,
                ...currentColumn.options,
              })
                .catch(err => {
                  reject(err);
                });
            });
        };

        series.add(promise);
      }

      try {
        series.run()
          .then((data) => {
            pipelineIds.push(data.sourceId);

            resolve({
              targetVariable,
              sourceId: data.sourceId,
              initialSourceId,
              subsetSourceId,
              labelIndex,
              columns,
              schema,
              pipelineIds,
            });
          });
      }
      catch (e) {
        resolve({
          targetVariable,
          sourceId,
          initialSourceId,
          subsetSourceId,
          labelIndex,
          columns,
          schema,
          pipelineIds,
        });
      }
    });
  }

  _standardScalar(
    {
      targetVariable,
      sourceId,
      initialSourceId,
      labelIndex,
      subsetSourceId,
      columns,
      schema,
      pipelineIds = [],
      featuresColumns = [],
    }
  ) {
    const TransformType = 'standardScalar';
    return new Promise((resolve, reject) => {

      const columnNames = _.map(columns[TransformType], column => {
        return column.name;
      })
      .filter(type => {
        return type.value !== 'noScalar';
      })

      const series = new PromiseSeries();

      for (const column of columnNames) {
        const promise = (data) => {
          return this.MLAPI.multiStringIndex({
            sourceId: data ? data.sourceId : sourceId,
            inputColumns: `${column}`,
            outputColumn: `${TransformType}_${column}_vector`,
          })
            .then(multiStringResult => {
              if (!_.isUndefined(multiStringResult)) {
                pipelineIds.push(multiStringResult.sourceId);
              }

              const currentColumn = _.find(_.flatten(_.values(columns)), (v) => {
                return v.name === column;
              });

              return this.MLAPI.standardScalar({
                sourceId: multiStringResult.sourceId,
                inputColumn: `${TransformType}_${column}_vector`,
                outputColumn: `${TransformType}_${column}`,
                ...currentColumn.options,
              })
                .catch(err => {
                  reject(err);
                });
            });
        };

        series.add(promise);
      }

      try {
        series.run()
          .then((data) => {
            pipelineIds.push(data.sourceId);

            resolve({
              targetVariable,
              sourceId: data.sourceId,
              initialSourceId,
              subsetSourceId,
              labelIndex,
              columns,
              schema,
              pipelineIds,
            });
          });
      }
      catch (e) {
        resolve({
          targetVariable,
          sourceId,
          initialSourceId,
          subsetSourceId,
          labelIndex,
          columns,
          schema,
          pipelineIds,
        });
      }
    });
  }

  _multiStringIndex(
    {
      targetVariable,
      sourceId,
      columns,
      featuresColumns = [],
    }
  ) {
    const dfd = this.$q.defer();

    if (!_.isArray(columns.index)) {
      dfd.resolve({
        targetVariable,
        sourceId,
        columns,
        featuresColumns,
      });
    } else {
      const inputColumns = columns.index.map(i => {
        return i.name;
      })
        .join(',');
      const outputColumn = 'vector';

      this.MLAPI.multiStringIndex({
        sourceId,
        inputColumns: inputColumns,
        outputColumn: outputColumn,
      })
        .then(res => {
          featuresColumns.push(outputColumn);
          let obj = {
            'targetVariable': targetVariable,
            'sourceId': res.sourceId,
            'columns': columns,
            'featuresColumns': featuresColumns,
          };

          dfd.resolve(obj);
        }, err => dfd.reject(err));
    }

    return dfd.promise;
  }

  _toColumnsDecimal(
    {
      targetVariable,
      sourceId,
      columns,
      featuresColumns = [],
    }
  ) {
    const dfd = this.$q.defer();
    if (!_.isArray(columns.index)) {
      dfd.resolve({
        targetVariable,
        sourceId,
        columns,
        featuresColumns,
      });
    } else {
      columns.index.filter(i => {
        return i.dataType === 'IntegerType';
      })
        .map((column) => {
          featuresColumns.push(column.name);
          return column;
        })
        .reduce((prev, column) => {
          const COLUMN_TYPE = 'decimal';

          return prev.then(res => {
            return this.TransformAPI.cast({
              id: res.id,
              column: column.name,
              type: COLUMN_TYPE,
            })
              .then(result => {
                return {
                  id: result,
                };
              });
          });
        }, this.$q.resolve({
          id: sourceId,
        }))
        .then(res => {
          return dfd.resolve({
            targetVariable: targetVariable,
            sourceId: res.id,
            columns,
            featuresColumns,
          });
        });
    }

    return dfd.promise;
  }

  _targetVariableIndexer(
    {
      targetVariable,
      sourceId,
      initialSourceId,
      subsetSourceId,
      columns,
      schema,
      pipelineIds,
    }
  ) {
    const isString = () => {
      return !_.isEmpty(_.find(schema.fields, i => {
        return i.dataType === 'StringType' && i.name === targetVariable;
      }));
    };

    return new Promise((resolve, reject) => {
      if (isString()) {
        this.MLAPI.labelIndexer({
          sourceId,
          inputColumn: targetVariable,
          outputColumn: 'label',
        })
          .then(res => {
            pipelineIds.push(res.id);
            resolve({
              targetVariable,
              sourceId: res.id,
              initialSourceId,
              labelIndex: 'label',
              subsetSourceId,
              columns,
              schema,
              pipelineIds,
            });
          })
          .catch(reject);
      } else {
        resolve({
          targetVariable,
          sourceId,
          labelIndex: targetVariable,
          initialSourceId,
          subsetSourceId,
          columns,
          schema,
          pipelineIds,
        });
      }
    });
  }

  _columnSelect(
    {
      sourceId,
      targetVariable,
      targetVariableIndex,
      columns,
      featuresColumns = [],
    }
  ) {
    const cols = Object.values(columns)[0].map(column => {
      return 'index_' + column.name;
    })
      .concat('targetVariable');

    return this.TransformAPI.columnSelect({
      id: sourceId,
      columns: cols,
    })
      .then(id => {
        return {
          sourceId: id,
          targetVariable,
          targetVariableIndex,
          columns,
          featuresColumns,
        };
      });
  }

  _setSubsetSourceId(
    {
      sourceId,
      targetVariable,
      targetVariableIndex,
      columns,
      schema,
    }
  ) {
    return this.MLAPI.sample({
      id: sourceId,
      ratio: '0.7',
    })
      .then(data => {
        return {
          sourceId: data.id,
          initialSourceId: data.id,
          targetVariable,
          targetVariableIndex,
          columns,
          schema,
          subsetSourceId: data.id, // changing this to be main piece of dataset (100%)
        };
      });
  }

  _toDecimal(
    {
      sourceId,
      targetVariable,
      targetVariableIndex,
      columns,
      schema,
    }
  ) {
    const cols = _.map(_.flatten(_.values(columns)))
      .filter(column => {
        return column.dataType === 'IntegerType';
      });

    const columnNames = cols.map(column => {
      return column.name;
    });

    const isInteger = () => {
      const integerColumns = _.find(schema.fields, c => {
        return c.name === targetVariable && c.dataType === 'IntegerType';
      });

      return !_.isEmpty(integerColumns);
    };

    if (isInteger(targetVariable)) {
      columnNames.push(targetVariable);
    }

    return new Promise((resolve, reject) => {
      if (_.isArray(cols) && !_.isEmpty(cols)) {
        this.TransformAPI.cast({
          id: sourceId,
          column: columnNames.join(','),
          type: 'decimal',
        })
          .then(result => {
            resolve({
              sourceId: result,
              targetVariable,
              targetVariableIndex,
              columns,
              schema,
            });
          })
          .catch(reject);
      } else {
        resolve({
          sourceId,
          targetVariable,
          targetVariableIndex,
          columns,
          schema,
        });
      }
    });
  }

  __getIndexedColumns({columns}) {
    const IndexedColumns = _.map(columns, (value, type) => {
      return _.map(_.values(value).filter(t => {
        return t.feature.value !== 'noScalar';
      }), column => {
        return `${type}_${column.name}`;
      });
    });

    return _.flatten(IndexedColumns);
  }
}
