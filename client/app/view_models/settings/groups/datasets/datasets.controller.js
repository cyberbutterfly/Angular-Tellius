class SettingsGroupsDatasetsController {
  /*@ngInject*/
  constructor($scope, $mdToast, GroupsModel, DatasetAPI, ConfirmService, ngDialog) {
    this.$scope                     = $scope;
    this.$mdToast                   = $mdToast;
    this.GroupsModel                = GroupsModel;
    this.DatasetAPI                 = DatasetAPI;
    this.ConfirmService             = ConfirmService;
    this.ngDialog                   = ngDialog;
    this.selectedGroupDetails       = this.$scope.$parent.$ctrl.selectedGroup;
  }

  removeDataset (dataset) {
    this.ConfirmService.open({
      label: 'Delete',
    })
      .then(() => {
        let datasetAccesses = angular.copy(this.selectedGroupDetails.datasetAccesses);
        _.remove(datasetAccesses, { id: dataset.id });

        return this.GroupsModel.updateGroup({
          id: this.selectedGroupDetails.id,
          datasetAccesses: datasetAccesses,
        });
      })
      .then(() => {
        this.$scope.$parent.$ctrl.refreshSelectedGroup();
        this.$mdToast.show(
          this.$mdToast.simple()
            .content('Selected dataset removed successfully!')
            .hideDelay(3000)
        );
      });
  }

  addDatasets () {
    if (!this.selectedGroupDetails) {
      return;
    }

    const savedThis = this;
    this.getDatasetsThatCanBeAdded().then(candidateDatasets => {
      this.ngDialog.open({
        template: `<settings-groups-add-datasets-popup candidate-datasets="candidateDatasets" submit-selected-datasets="submitSelectedDatasets(selectedDatasets)"></settings-groups-add-datasets-popup>`,
        plain: true,
        controller: ($scope) => {
          $scope.candidateDatasets = candidateDatasets;
          $scope.submitSelectedDatasets = (selectedDatasets) => {
            $scope.closeThisDialog(selectedDatasets);
          };
        },
        className: 'ngdialog-theme-default',
      }).closePromise.then((selectedDatasets) => {
          let datasetAccesses = angular.copy(savedThis.selectedGroupDetails.datasetAccesses) || [];
          datasetAccesses = datasetAccesses.concat(selectedDatasets.value);

          return savedThis.GroupsModel.updateGroup({
            id: savedThis.selectedGroupDetails.id,
            datasetAccesses: datasetAccesses,
          });
        }).then(() => {
          savedThis.$scope.$parent.$ctrl.refreshSelectedGroup();
          savedThis.$mdToast.show(
            savedThis.$mdToast.simple()
              .content('Selected datasets added successfully!')
              .hideDelay(3000)
          );
        });
    });
  }

  getDatasetsThatCanBeAdded () {
    const savedThis = this;
    return this.DatasetAPI.getListEx().then(allDatasetsResult => {
      const datasetsResult = _.filter(allDatasetsResult.datasets, (datasetIterator) => {
        return (_.findIndex(savedThis.selectedGroupDetails.datasetAccesses, { id: datasetIterator.id }) < 0);
      });
      return datasetsResult;
    });
  }
}

export default SettingsGroupsDatasetsController;
