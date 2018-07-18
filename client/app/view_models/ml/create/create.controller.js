export class MLCreateController {
  /*@ngInject*/
  constructor($state, MLWizard) {
    this.$state = $state;
    this.MLWizard = MLWizard;
  }

  selectType(type) {
    this.MLWizard.setState({
      type: 'transformation',
      data: {
        options: {
          modelType: type,
        },
      },
    });

    this.$state.go('app.ml.wizard.transformation');
  }
}
