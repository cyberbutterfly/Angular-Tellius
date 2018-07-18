export class MenuCtrl {
  /*@ngInject*/
  constructor($scope, $state, DatasetStorageService, FilterService, ngDialog) {
    this.$scope = $scope;
    this.$state = $state;
    this.ngDialog = ngDialog;
    this.DatasetStorageService = DatasetStorageService;
    this.FilterService = FilterService;

    this.rootDataset = this.DatasetStorageService.getRoot();

    this.DatasetStorageService
      .on('DATASET_DID_CHANGE', this._DatasetChangedHandler, this);
    this.DatasetStorageService.on('ROOT_DATASET_CHANGED', this._RootDatasetHandler,
      this);
  }

  $onDestroy() {
    this.DatasetStorageService
      .removeListener('DATASET_DID_CHANGE', this._DatasetChangedHandler);
    this.DatasetStorageService
      .removeListener('ROOT_DATASET_CHANGED', this._RootDatasetHandler);
  }

  savePopup() {
    this.ngDialog.open({
      template: `<save-popup></save-popup>`,
      plain: true,
      scope: this.$scope,
      className: 'ngdialog-theme-default big',
    });
  }

  dataFusionPopup() {
    this.$state.go('app.transform.grid.fusion');
  }

  advancedFiltersPopup() {
    this.$state.go('app.transform.grid.filters');
  }

  aggregatePopup() {
    this.ngDialog.open({
      template: `<aggregate-popup
      close-this-dialog="closeThisDialog()"></aggregate-popup>`,
      plain: true,
      scope: this.$scope,
      className: 'ngdialog-theme-default big',
    });
  }

  isUndoDisabled() {
    return !this.DatasetStorageService.isUndo();
  }

  undo() {
    this.DatasetStorageService.undo();
  }

  isRedoDisabled() {
    return !this.DatasetStorageService.isRedo();
  }

  redo() {
    this.DatasetStorageService.redo();
  }

  _DatasetChangedHandler(dataset) {
    this.metadata = dataset.metadata;
  }

  _RootDatasetHandler({
    dataset,
  }) {
    this.rootDataset = dataset;
  }
}
