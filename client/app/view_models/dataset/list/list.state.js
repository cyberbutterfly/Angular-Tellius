  /*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.dataset.list', {
      url: '/list',
      template: `<dataset-list-view-model></dataset-list-view-model>`,
    })
    .state('app.dataset.list.edit', {
      url: '/edit',
      template: `<ui-view/>`,
    });
};

export default State;
