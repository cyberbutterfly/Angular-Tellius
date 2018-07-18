/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.dataset', {
      url: 'dataset',
      redirectTo: 'app.dataset.list',
      template: `<dataset-view-model></dataset-view-model>`,
    });
};

export default State;
