import {
  isString,
}
from 'lodash/lang';

export class createDatasetCSVController {
  /*@ngInject*/
  constructor($scope, $state) {
    this.$scope = $scope;
    this.$state = $state;

    this.FormData = {
      delimiter: ',',
      header: true,
      quote: '"',
      ...this.options,
    };

    this.errors = [];
  }

  onSubmit() {
    const data = {
      options: {
        ...this.FormData,
      },
    };

    if (this._validate()) {
      this.$state.go(`app.dataset.wizard.name`, data);
    }
  }

  _validate() {
    this.errors = [];

    if (!isString(this.FormData.delimiter)) {
      this.errors.push({
        field: 'delimiter',
        value: 'delimiter should be exist',
      });
    }

    return this.errors.length === 0;
  }

}
