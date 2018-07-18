import angular from 'angular';

export class AddColumnPopupCtrl {
  /*@ngInject*/
  constructor($scope, ColumnAPI, DatasetStorageService) {
    let vm = this;

    vm.$scope                = $scope;
    vm.ColumnAPI             = ColumnAPI;
    vm.DatasetStorageService = DatasetStorageService;

    vm.actionType = null;
    vm.columns    = DatasetStorageService.getColumns();

    vm.stringFunctions = [
      'left',
      'right',
      'mid',
    ];
    vm.dateFunctions   = [
      'minute',
      'hour',
      'day',
      'date',
      'month',
      'dayofweek',
    ];
    vm.subsetFunctions = [].concat(vm.stringFunctions);

    vm.formData = {};

    vm.tabsOptions = {
      onReady: (instance)=> {
        instance.on('paneSelected', (data) => {
          let title = null;

          if (angular.isDefined(data.pane.title)) {
            title = data.pane.title.replace(/\s/g, '').toLowerCase();
          }

          vm.actionType = title;
        });
      },
    };
  }

  onSubmit() {
    let vm = this;

    let options = this.optionsHandler(vm.formData);

    if (options) {
      vm.ColumnAPI.addColumn(options).then(() => {
        vm.$scope.$parent.closeThisDialog();
      });

      vm.errors = '';
    } else {
      vm.errors = 'Validation errors';
    }
  }

  isStringColumn() {
    let columnType = this.DatasetStorageService.getColumnType(this.formData.subsetColumn);
    return columnType === 'string';
  }

  isStringFunction() {
    let vm = this;

    return vm.stringFunctions.indexOf(vm.formData.subsetType) !== -1;
  }

  optionsHandler(formData) {
    let vm = this;

    if (angular.isUndefined(formData)) {
      return false;
    }

    let options = {
      columntype: vm.actionType,
      columnname: formData.columnName,
    };

    switch (vm.actionType) {
    case 'indicator':
      options.columntype = 'indicator';
      options.indicator  = formData.indicator;
      break;
    case 'fixedvalue':
      options.columntype  = 'fixedstring';
      options.fixedstring = formData.fixedstring;
      break;
    case 'signature':
      options.columntype = 'signature';
      options.signature  = formData.signature;
      break;
    case 'subset':
      options.columntype = 'subset';

      if (this.isStringFunction() && angular.isDefined(formData.stringPosition)) {
        options.stringPosition = ', ' + formData.stringPosition;
      } else {
        options.stringPosition = undefined;
      }

      if (angular.isString(formData.subsetType) && angular.isString(formData.subsetColumn)) {
        options.subset = `${formData.subsetType}(${formData.subsetColumn}${options.stringPosition})`;
      } else {
        options.subset = undefined;
      }

      if (!this.isStringColumn()) {
        options.subset = undefined;
      }
      break;
    default:
      return false;
    }

    for (let prop in options) {
      if (options.hasOwnProperty(prop)) {
        if (options[prop] === undefined) {
          return false;
        }
      }
    }

    return options;
  }
}
