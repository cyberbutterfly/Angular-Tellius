/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.settings.groups.datasets', {
      url: '/datasets',
      template: `<settings-groups-datasets-view-model></settings-groups-datasets-view-model>`,
    });
};

export default State;
