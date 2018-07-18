import template from './confirm.jade';

export class ConfirmService {
  /*@ngInject*/
  constructor($rootScope, ngDialog) {
    this.$rootScope = $rootScope;
    this.ngDialog = ngDialog;
  }

  open({
    label = 'Are you sure?',
  }) {
    const scope = this.$rootScope.$new();
    const ENTER_CODE = 13;
    scope.label = label;

    const _eventHandler = function _eventHandler(ev) {
      if (ev.keyCode === ENTER_CODE) {
        this.confirmDialog('undefined');
        ev.preventDefault();
      }
    };

    return this.ngDialog.openConfirm({
        scope,
        template: template(),
          plain: true,
          controller: /*@ngInject*/ ($scope, $element) => {
            $scope.confirmDialog = () => {
              $scope.confirm('undefined');
            };
            const handler = _eventHandler.bind($scope);
            $element[0].addEventListener('keydown', handler);

            $scope.$on('$destroy', () => {
              $element[0].removeEventListener('keydown', handler);
            });
          },
    });
  }
}
