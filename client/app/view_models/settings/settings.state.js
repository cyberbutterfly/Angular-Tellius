/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.settings', {
      url: 'settings',
      redirectTo: 'app.settings.user',
      template: `<settings-view-model></settings-view-model>`,
    });
};

export default State;
