/*@ngInject*/
const State = $stateProvider => {
  $stateProvider.state('login', {
    url: '/log',
    template: `<login-view-model></login-view-model>`,
  });
};

export default State;
