import angular from 'angular';

export class AddNodePopupCtrl {
  /*@ngInject*/
  constructor($scope, jsPlumbService, DataflowAPIMock) {
    let vm = this;

    vm.$scope = $scope;
    vm.jsPlumbService = jsPlumbService;
    vm.DataflowAPIMock = DataflowAPIMock;

    let toolkit = this.jsPlumbService.getToolkit('flowchartToolkit');

    vm.nodeTypes = DataflowAPIMock.getNodeTypes();
    vm.parents = toolkit.getNodes();

    vm.formData = {};
  }

  onSubmit() {
    let vm = this;

    let options = this.optionsHandler(vm.formData);

    if (options) {
      let toolkit = this.jsPlumbService.getToolkit('flowchartToolkit');

      let newNode = toolkit.addNode(options);
      toolkit.addEdge({source: vm.formData.parent, target: newNode});

      vm.$scope.$parent.closeThisDialog();
      vm.errors = '';
    } else {
      vm.errors = 'Input errors';
    }
  }
  optionsHandler(formData) {
    if (angular.isUndefined(formData)) {
      return false;
    }

    let options = {
      type: formData.type,
      text: formData.text,
      tasks: '0',
    };

    return options;
  }
}
