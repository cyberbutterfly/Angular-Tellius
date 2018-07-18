const __eventHandler = function __eventHandler({
  jobId,
}) {
  if (this.jobId === jobId) {
    this.DatasetStorageService.emit('DATASET_LIST_WILL_CHANGE');
    this.JobsStorage.removeListener('JOB_UPDATED', __eventHandler);
  }
};

export class Controller {
  /*@ngInject*/
  constructor($scope, DatasetStorageService, JobsStorage, SaveModel) {
    this.$scope = $scope;
    this.SaveModel = SaveModel;
    this.DatasetStorageService = DatasetStorageService;
    this.JobsStorage = JobsStorage;

    this.FormData = {
      datasetName: '',
    };

    this.errors = [];
  }

  $onDestroy() {
    this.JobsStorage.removeListener('JOB_UPDATED', __eventHandler);
  }

  onSubmit() {
    this.errors = [];
    const event = {
      ids: {
        current: this.DatasetStorageService.getCurrent(),
        root: this.DatasetStorageService.getRoot(),
      },
      name: this.FormData.datasetName,
    };

    this.SaveModel.memsql({
        sourceId: this.DatasetStorageService.getCurrent(),
        rootId: this.DatasetStorageService.getRoot()
          .name,
        datasetName: this.FormData.datasetName,
      })
      .then(data => {
        this.closeThisDialog();
        event.data = data;

        this.JobsStorage.on('JOB_UPDATED', __eventHandler, data);
        this.DatasetStorageService.emit('SAVE_EVENT', event);
      })
      .catch(err => {
        console.log('err', err);
        this.errors.push({
          field: 'backend',
          description: err,
        });
        this.$scope.$digest();
      });
  }
}
