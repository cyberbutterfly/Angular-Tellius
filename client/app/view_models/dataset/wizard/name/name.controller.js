import {
  isString,
}
from 'lodash/lang';

export class DatasetNameController {
  /*@ngInject*/
  constructor($scope, $state, $timeout, $interval, LoadAPI, DatasetAPI,
    UploadService,
    DatasetStorageService, ApiWrapper) {
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.$interval = $interval;

    this.LoadAPI = LoadAPI;
    this.DatasetAPI = DatasetAPI;
    this.UploadService = UploadService;
    this.DatasetStorageService = DatasetStorageService;
    this.ApiWrapper = ApiWrapper;

    this.FormData = {
      cache: false,
      ...this.options,
    };
    this.errors = [];
  }

  onSubmit() {
    const options = {
      flatten: 'true',
      files: this.UploadService.files,
      ...this.options,
      ...this.FormData,
    };

    if (this._validation()) {
      const stop = this.$interval(() => {
        this.progress = this.ApiWrapper.getProgress();
      }, 250);

      this.LoadAPI.load(options)
        .then(({
          sourceId,
        }) => {
          this.$interval.cancel(stop);
          this.$timeout(() => {
            this.DatasetAPI.getListEx({})
              .then(({
                datasets,
              }) => {
                const dataset = datasets
                  .filter(i => i.datasetId === sourceId)[0];
                this.DatasetStorageService.setRoot(dataset, {}, false);
                this.DatasetStorageService.emit(
                  'DATASET_LIST_WILL_CHANGE');
              });
          }, 1000);

          this.LoadAPI.emit('LOAD_EVENT', {
            options: options,
            sourceId: sourceId,
          });

          const data = {
            options: {
              sourceId,
              ...this.FormData,
            },
          };

          this.$state.go('app.dataset.wizard.measures', data);
          this.LoadAPI.emit('LOADING_NEW_DATASET', {
            options: options,
            sourceId: sourceId,
          });
        });
    }
  }

  _validation() {
    this.errors = [];

    if (!isString(this.FormData.name)) {
      this.errors.push({
        field: 'name',
        value: 'Name shoud be a string',
      });
    }

    return this.errors.length === 0;
  }
}
