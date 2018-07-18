/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.settings.app', {
      url: '/app',
      template: `<settings-app-view-model></settings-app-view-model>`,
    });
};

export default State;
