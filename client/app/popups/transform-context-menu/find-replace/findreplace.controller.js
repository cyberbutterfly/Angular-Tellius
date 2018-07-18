import angular from 'angular';

export class FindReplaceController {
  /*@ngInject*/
  constructor($scope, DatasetStorageService, ColumnAPI) {
    this.$scope                = $scope;
    this.ColumnAPI             = ColumnAPI;
    this.DatasetStorageService = DatasetStorageService;

    this.FormData = {};

    this.FormData.columnnames = [this.columnName];

    this.columns = this.DatasetStorageService.getColumns();
  }

  _validate() {
    this.errors = [];

    if (angular.isUndefined(this.FormData.find)) {
      this.errors.push('Find is undefined');
    }

    if (angular.isUndefined(this.FormData.replace)) {
      this.errors.push('Replace is undefined');
    }

    if (angular.isUndefined(this.FormData.columnnames)) {
      this.errors.push('Column is not selected');
    }

    this.errors.join(', ');

    return this.errors.length === 0;
  }

  onSubmit() {
    if (this._validate(this.FormData)) {
      this.ColumnAPI.replace(this.FormData)
        .then(() => {
          this.$scope.$parent.closeThisDialog();
        });
    }
  }
}
