export class createDatasetJSONController {
  /*@ngInject*/
  constructor($scope, $state) {
    this.$scope = $scope;
    this.$state = $state;

    this.FormData = {
      ...this.options,
    };
  }

  onSubmit() {
    const data = {
      options: {
        ...this.FormData,
      },
    };
    this.$state.go('app.dataset.wizard.name', data);
  }
}
