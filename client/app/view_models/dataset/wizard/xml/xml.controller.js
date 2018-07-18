export class createDatasetXMLController {
  /*@ngInject*/
  constructor($scope, $state) {
    this.$scope = $scope;
    this.$state = $state;

    this.FormData = {
      flatten: true,
      rowTag: 'ROW',
      ...this.options,
    };
  }

  onSubmit() {
    const data = {
      options: {
        ...this.FormData,
      },
    };

    this.$state.go('app.dataset.wizard.schema', data);
  }
}
