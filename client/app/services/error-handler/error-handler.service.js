import errorDialog from './error-message.jade'
import successDialog from './success-message.jade'

class ErrorHandlerService {
  /*@ngInject*/
  constructor(ApiWrapper, $q, $rootScope, $mdDialog) {
    this.api = ApiWrapper;
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.$mdDialog = $mdDialog;
  }

  error(error, ev) {
    var parentThis = this;
    this.$mdDialog.show({
      controller: parentThis.ShowDialogController,
      template: errorDialog(),
      parent: angular.element(document.body),
      targetEvent: ev,
      locals: {
        message: error
      },
      clickOutsideToClose: true,
    })
    .then(function(answer) {

    }, function() {

    });
  };

  ShowDialogController($scope, $mdDialog, message) {
    $scope.message = message;
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }

  success(message, ev) {
    var parentThis = this;

    this.$mdDialog.show({
      controller: parentThis.ShowDialogController,
      template: successDialog(),
      parent: angular.element(document.body),
      targetEvent: ev,
      locals: {
        message: message
      },
      clickOutsideToClose: true,
    })
    .then(function(answer) {

    }, function() {

    });
  }
}

export default ErrorHandlerService;
