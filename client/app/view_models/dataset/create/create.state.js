/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.dataset.create', {
      url: '/create',
      template: `<create-view-model></create-view-model>`,
    });
};

export default State;
