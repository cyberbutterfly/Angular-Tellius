// import headerCellTemplate from './headerCell.jade';

class SetupVizService {
  /*@ngInject*/
  constructor($rootScope, UserService) {
    this.$rootScope = $rootScope;
    this.UserService = UserService;
    this.showSetup = false;
  }

  hideSetup() {
    this.showSetup = true;
  }

}

export default SetupVizService;
