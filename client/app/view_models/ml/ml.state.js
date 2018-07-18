/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.ml', {
      url: 'ml',
      redirectTo: 'app.ml.create',
      template: `<ml-view-model></ml-view-model>`,
    });
};

export default State;
