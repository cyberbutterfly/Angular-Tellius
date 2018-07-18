import _ from 'lodash';

export default class DatasetResolve {
  /*@ngInject*/
  constructor($timeout, DatasetStorageService) {
    this.$timeout = $timeout;
    this.DatasetStorageService = DatasetStorageService;
  }

  getPromise({...options,
  }) {
    return new Promise((resolve) => {
      const _handler = data => {
        resolve(data);
      };

      this.DatasetStorageService.once(
        'DATASET_DID_CHANGE', _handler, this);

      if (_.isNull(this.DatasetStorageService.getRoot())) {
        this.DatasetStorageService.once('ROOT_DATASET_CHANGED', ({
          dataset,
        }) => {
          this.DatasetStorageService.setCurrent(dataset.datasetId,
            options, false);
        });
      } else if (!_.isNull(this.DatasetStorageService.getCurrent()) &&
        !_.isNull(this.DatasetStorageService.getDataset()) &&
        !_.isNull(this.DatasetStorageService.getRoot()) &&
        this.DatasetStorageService.getCurrent() === this.DatasetStorageService
        .getDataset()
        .sourceId
      ) {
        const optionsKeys = Object.keys(options);
        const keys = Object.keys(this.DatasetStorageService.getDataset());
        const diff = _.difference(optionsKeys, keys)
          .reduce((prev, value) => {
            prev[value] = true;
            return prev;
          }, {});
        const dataset = this.DatasetStorageService.getRoot();
        if (_.isEmpty(diff)) {
          resolve(this.DatasetStorageService.getDataset());
        } else {
          this.DatasetStorageService.setCurrent(dataset.datasetId, diff);
        }
      } else {
        const dataset = this.DatasetStorageService.getRoot();
        this.DatasetStorageService.setCurrent(dataset.datasetId, options);
      }
    });
  }
}
