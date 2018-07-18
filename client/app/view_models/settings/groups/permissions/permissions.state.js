/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.settings.groups.permissions', {
      url: '/permissions',
      template: `<settings-groups-permissions-view-model></settings-groups-permissions-view-model>`,
    });
};

export default State;
