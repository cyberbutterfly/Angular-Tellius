/*@ngInject*/
const State = $stateProvider => {
  $stateProvider.state('app.dataset.wizard', {
    url: '/wizard',
    template: '<dataset-wizard></dataset-wizard>',
  });
};

export default State;
