export class HeaderController {
  /*@ngInject*/
  constructor(UserService) {
    this.UserService = UserService;

    this.user = this.UserService.getCurrentUserAuthData();
  }

  logout() {
    this.UserService.logout();
  }
}
