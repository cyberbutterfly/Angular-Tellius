/*@ngInject*/
const State = $stateProvider => {
  $stateProvider.state('app.analytics', {
    url: 'analytics',
    redirectTo: 'app.analytics.list',
    template: `<analytics-view-model></analytics-view-model>`,
  });
};

export default State;
