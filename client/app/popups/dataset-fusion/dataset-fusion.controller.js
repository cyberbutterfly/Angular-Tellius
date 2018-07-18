import _ from 'lodash';

export class DatasetFusionController {
  /*@ngInject*/
  constructor($scope, $q, DatasetStorageService, DatasetAPI, FusionAPI,
    ArrayUtils) {
    this.$scope = $scope;
    this.$q = $q;
    this.DatasetStorageService = DatasetStorageService;
    this.ArrayUtils = ArrayUtils;
    this.DatasetAPI = DatasetAPI;
    this.FusionAPI = FusionAPI;

    this.rootDataset = this.DatasetStorageService.getRoot();
    this.FormData = {};
    this.errors = [];
    this.selectedJoinKeys = [{}];

    this.combinedDataSelectedItem = null;
    this.combinedDataSearchText = null;
    this.FormData.combinedDataSelectedColumn = [];
  }

  getDatasetById(id) {
    let result = this.datasets.filter((item) => {
      return item.id === id;
    });

    if (_.isArray(result) && result.length !== 0) {
      result = result[0];
    }

    return result;
  }

  onSelectDataset() {
    const currentDataset = this.DatasetStorageService.getDataset();

    this.DatasetAPI.getDataset({
        sourceId: this.FormData.selectedDataset,
        typeStats: false,
      })
      .then(selectedDataset => {
        this.FormData.columns1 = currentDataset.columns;
        this.FormData.columns2 = selectedDataset.columns;
        this.columns = _.uniq(_.concat(currentDataset.columns,
          selectedDataset.columns));
      });
  }

  addJoinType() {
    this.selectedJoinKeys.push({});
  }

  removeJoinType(item) {
    this.selectedJoinKeys.splice(this.selectedJoinKeys.indexOf(item), 1);
  }

  selectColumns() {
    this.FormData.combinedDataSelectedColumn = [].concat(this.columns);
  }

  closeDialog() {
    this.closeThisDialog()();
  }

  onSubmit() {
    this.errors = [];
    
    if(!this._validate()) return;

    const joinKeys = this.selectedJoinKeys.reduce((prev, item) => {
      Object.keys(item)
        .filter(i => i !== '$$hashKey')
        .forEach(i => {
          if (_.isUndefined(prev[i])) {
            prev[i] = [item[i]];
          } else {
            prev[i].push(item[i]);
          }
        }, {});

      return prev;
    }, {});

    if (_.isEmpty(joinKeys)) {
      return false;
    }

    const ids = []
      .concat(this.DatasetStorageService.getRoot()
        .currentSourceId, this.FormData.selectedDataset)
      .join(',');
    const joinType = this.FormData.jointype;
    let columnNames = this.FormData.combinedDataSelectedColumn;

    if (_.isEqual(columnNames, this.columns)) {
      columnNames = 'all';
    }

    const RequestData = {
      ids,
      datasetname: this.FormData.datasetname,
        joinKeys1: joinKeys.joinKeys1.join(','),
        joinKeys2: joinKeys.joinKeys2.join(','),
        joinType,
        columnNames: this.FormData.combinedDataSelectedColumn,
    };

    this.FusionAPI.makeRequest(RequestData)
      .then(() => {
        this.closeDialog('redirect');
      })
      .catch((errors) => {
        this.errors.push(errors);
      });
  }

  _validate() {
    /* make sure user populated dataset name field */
    if(this.FormData.datasetname === null) {
      this.errors.push({message: 'You must provide a name for your new dataset!'});
    }

    return this.errors.length === 0;
  }
}
