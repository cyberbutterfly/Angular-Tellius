/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.settings.groups.members', {
      url: '/members',
      template: `<settings-groups-members-view-model></settings-groups-members-view-model>`,
    });
};

export default State;
