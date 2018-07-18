import angular from 'angular';
import EventEmitter from 'eventemitter3';
import _ from 'lodash';

class DatasetStorageService extends EventEmitter {
  /*@ngInject*/
  constructor(DatasetAPI) {
    super();

    this.DatasetAPI = DatasetAPI;

    this.__datasetList = null;
    this.__rootDataset = null;
    this.currentDataset = null;
    this._currentSourceId = null;

    this._ids = [];
    this._datasets = [];

    this.on('DATASET_WILL_CHANGE', (sourceId, options) => {
      this.DatasetAPI.getDataset({
          sourceId,
          isSaved: this.isSaved(),
            ...options,
        })
        .then((dataset) => {
          if (this.currentDataset && this.currentDataset.sourceId ===
            dataset.sourceId) {
            this.currentDataset = _.merge(this.currentDataset, dataset);
          } else {
            this.currentDataset = dataset;
          }

          this.emit('DATASET_DID_CHANGE', dataset);
        });
    });

    this.on('DATASET_LIST_WILL_CHANGE', () => {
      DatasetAPI.getListEx({})
        .then(({
          datasets,
        }) => {
          this.setList({
            datasets,
          });
        });
    });
  }

  getList() {
    return this.__datasetList;
  }

  setList({
    datasets,
  }) {
    this.__datasetList = datasets;
    this.emit('DATASET_LIST_DID_CHANGE', {
      datasets,
    });
  }

  getCurrentIndex(sourceId) {
    let process = sourceId || this._currentSourceId;

    return this._ids.indexOf(process);
  }

  getColumns() {
    let result = false;

    if (angular.isObject(this.currentDataset) && angular.isArray(this.currentDataset
        .columns)) {
      result = this.currentDataset.columns;
    }

    return result;
  }

  getColumnType(columnName) {
    let result = false;

    if (angular.isString(columnName) && this.currentDataset.schema && this.currentDataset
      .schema.fields.length) {
      let filteredColumns = this.currentDataset.schema.fields
        .filter((item) => {
          return item.name === columnName;
        });

      if (filteredColumns[0]) {
        let column = filteredColumns[0];

        let type = column.dataType.slice(0, column.dataType.length - 4)
          .toLowerCase();

        result = type;
      }
    }

    return result;
  }

  getDataset(options) {
    if (options && options.typeStats && (
        this.currentDataset && !this.currentDataset.typeStats ||
        !this.currentDataset
      )) {
      this.setCurrent(this._currentSourceId, {
        ...options,
      });
    }

    return _.cloneDeep(this.currentDataset);
  }

  getCurrent() {
    if (this._currentSourceId === null) {
      return this.__rootDataset.currentSourceId;
    }
    return this._currentSourceId;
  }

  setCurrent(sourceId, options) {
    if (_.isString(sourceId)) {
      const currCursor = this.getCurrentIndex();
      const newCursor = this.getCurrentIndex(sourceId);
      const rootIndex = _.findIndex(this.__datasetList, (i) => {
        return this.getRoot()
          .datasetId === i.datasetId;
      });
      const isLast = () => {
        return currCursor === this._ids.length - 1 && currCursor !==
          newCursor;
      };

      this.__datasetList[rootIndex].currentSourceId = sourceId;
      this._currentSourceId = sourceId;

      if (isLast() || currCursor === -1) {
        this._ids.push(sourceId);
      } else if (newCursor === -1) {
        this._ids = this._ids.splice(0, currCursor + 1);
        this._ids.push(sourceId);
      }

      this.emit('DATASET_WILL_CHANGE', sourceId, options);
    }

    return this._currentSourceId;
  }

  isSaved() {
    let result;

    try {
      result = this.getRoot()
        .datasetStorage === 'database';
    } catch (e) {
      result = false;
    }
    return result;
  }

  getRoot() {
    return _.cloneDeep(this.__rootDataset);
  }

  setRoot(dataset, options, setCurrent = true) {
    this.__rootDataset = dataset;
    this.currentDataset = null;

    localStorage.setItem('SelectedDatasetId', dataset.datasetId);

    this.emit('ROOT_DATASET_CHANGED', {
      dataset,
    });

    if (setCurrent) {
      this.setCurrent(dataset.datasetId, options);
    }
  }

  isUndo() {
    let index = this.getCurrentIndex();

    return index > 0;
  }

  undo() {
    let index = this.getCurrentIndex();

    if (this._ids[index - 1]) {
      this._currentSourceId = this._ids[index - 1];
    }

    this.setCurrent(this._currentSourceId, {
      typeStats: true,
    });
    return this._currentSourceId;
  }

  isRedo() {
    let index = this.getCurrentIndex();

    return index < this._ids.length - 1;
  }

  redo() {
    let index = this.getCurrentIndex();

    if (this._ids[index + 1]) {
      this._currentSourceId = this._ids[index + 1];
    }

    this.setCurrent(this._currentSourceId, {
      typeStats: true,
    });
    return this._currentSourceId;
  }

}

export default DatasetStorageService;
