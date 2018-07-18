import _ from 'lodash';

class ListCtrl {
  /*@ngInject*/
  constructor($scope, $state, $filter, ngDialog, DatasetStorageService,
    DatasetAPI, ConfirmService) {
    this.$scope = $scope;
    this.$state = $state;
    this.$filter = $filter;
    this.ngDialog = ngDialog;
    this.DatasetStorageService = DatasetStorageService;
    this.DatasetAPI = DatasetAPI;
    this.ConfirmService = ConfirmService;
  }

  $onInit() {
    this.datasets = this.DatasetStorageService.getList();

    this.savedDatasets = _.filter(this.datasets, (v) => {
      return v.datasetStorage === 'database';
    });

    this.unsavedDatasets = _.difference(this.datasets, this.savedDatasets);

    this.DatasetStorageService.on('DATASET_LIST_DID_CHANGE', ({
      datasets,
    }) => {
      this.datasets = datasets;
      this.$scope.$digest();
    });

    this.__activeTab = 'datasources';
  }

  selectDataset(selectDataset) {
    this.DatasetStorageService.setRoot(selectDataset, {
      typeStats: false,
    }, false);
    this.$state.go('app.transform.grid');
  }

  edit(dataset) {
    console.log('edit', dataset);
  }

  delete(dataset) {
    this.ConfirmService.open({
      label: 'Delete',
    })
    .then(() => {
      return this.DatasetAPI.deleteDataset({
        sourceId: dataset.datasetId,
      });
    })
    .then(() => {
      this.DatasetStorageService.emit('DATASET_LIST_WILL_CHANGE');
    });
  }

  order(predicate) {
    let orderBy = this.$filter('orderBy');
    this.predicate = predicate;
    this.reverse = (this.predicate === predicate) ? !this.reverse : false;
    this.savedDatasets = orderBy(this.savedDatasets, predicate, this.reverse);
    this.unsavedDatasets = orderBy(this.unsavedDatasets, predicate, this.reverse);
  }

  setActive(type) {
    this.__activeTab = type;
  }

  isActive(type) {
    return type === this.__activeTab;
  }
}

export default ListCtrl;
