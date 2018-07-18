export class FooterCtrl {
  /*@ngInject*/
  constructor($state, ngDialog) {
    this.$state = $state;
    this.ngDialog = ngDialog;
  }

  savePopup() {
    this.ngDialog.open({
      template: `<save-popup close-this-dialog="closeThisDialog()"></save-popup>`,
      plain: true,
      scope: this.$scope,
      className: 'ngdialog-theme-default big',
    });
  }

  Visualize() {
      this.$state.go('app.transform.grid');
  }

  Train() {
      this.$state.go('app.ml.create');
  }

  TrainAutoMode() {
      this.$state.go('app.ml.create');
  }

  TrainUserSelection() {
      this.$state.go('app.ml.create');
  }

  ApplyExisting() {
      this.$state.go('app.ml');
  }

}
