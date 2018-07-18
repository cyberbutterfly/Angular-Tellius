class LoginCtrl {
  /*@ngInject*/
  constructor($auth, $state, $mdToast, UserService) {
    this.$mdToast = $mdToast;
    this.$state = $state;
    this.$auth = $auth;
    this.UserService = UserService;

    this.userName = '';
    this.password = '';
  }

  login() {
    this.UserService.login(this.userName, this.password)
      .then(() => {
        this.$state.go('app.dashboard');
      }, () => {
        this.$mdToast.show(
          this.$mdToast.simple()
          .content('Invalid credentials!')
          .hideDelay(3000)
        );
      });
  }
}

export default LoginCtrl;
