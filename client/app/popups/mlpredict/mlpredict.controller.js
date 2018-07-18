import _ from 'lodash';

class MLPredictController {
  /*@ngInject*/
  constructor($scope, $state, $timeout, $rootScope, DatasetStorageService, DatasetAPI, PredictAPI, TransformAPI, SaveModel) {
    this.$scope = $scope;
    this.$state = $state;
    this.$parent = $scope.$parent;
    this.$timeout = $timeout;
    this.$rootScope = $rootScope;
    this.DatasetStorageService = DatasetStorageService;
    this.DatasetAPI = DatasetAPI;
    this.PredictAPI = PredictAPI;
    this.TransformAPI = TransformAPI;
    this.SaveModel = SaveModel;

    this.errors = [];
    this.datasets = DatasetStorageService.getList();
    this.currentDataset = DatasetStorageService.getRoot();
  }

  onSelectDataset() {
    this.DatasetAPI.getSchema({
      sourceId: this.FormData.selectedDataset,
    }).then((res) => {
      this.datasetColumns = res.columns;
    });
  }

  onSubmit() {
    if (!this._validate()) return;
    let featurescolumns = 'features';
    let savedDatasetId = '';

    this.PredictAPI.predict({
      id: this.FormData.selectedDataset,
      modelName: this.model.modelname,
      options: {
        featurescolumn: featurescolumns,
      },
    }).then((res) => {
      return this.TransformAPI.columnSelect({
        id: res.id,
        columns: ['features,rawPrediction,probability'],
        select: false.toString(),
      });
    }).then((res) => {
      return this.SaveModel.memsql({
        sourceId: res,
        datasetName: '[Predicted] ' + this.newDatasetName,
        rootId: res.id,
        sync: true,
      });
    }).then((res) => {
      console.log(1, res);
      savedDatasetId = res.result.sourceId;
      // this.$rootScope.$emit('LOADING_SHOW');
      console.log(2, res);
      return this.DatasetAPI.getListEx({});
    }).then((res) => {
      // this.$rootScope.$emit('LOADING_HIDE');
      this.DatasetStorageService.setList({
        datasets: res.datasets,
      });

      const idx = _.findIndex(res.datasets, v => {
        return v.datasetId === savedDatasetId;
      });

      this.DatasetStorageService.setRoot(res.datasets[idx]);
      this.$state.go('app.transform.grid');
      this.$parent.closeThisDialog();
    })
    .catch(e => {
      console.log('catch', e);
      // this.$rootScope.$emit('LOADING_HIDE');
      console.log(3, e);
      this.errors.push(e.message);
      return e;
    });
  }

  closeDialog() {
    this.$parent.closeThisDialog();
  }

  _validate() {
    if (this.newDatasetName === null || this.newDatasetName === undefined) {
      this.errors.push({'error': 'you must assign your new dataset a name!'});
    }
    return this.errors.length === 0;
  }
}

export default MLPredictController;
