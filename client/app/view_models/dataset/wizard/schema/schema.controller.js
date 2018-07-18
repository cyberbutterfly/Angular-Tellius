import _ from 'lodash';

export class SchemaController {
  /*@ngInject*/
  constructor($state, DatasetStorageService) {
    this.$state = $state;
    this.DatasetStorageService = DatasetStorageService;

    this.isAdvancedOptions = false;
    this.FormData = {
      ...this.options,
    };

    this.treeOptions = {
      nodeChildren: 'fields',
      dirSelectable: true,
    };
  }

  toggleAdvancedOptions() {
    this.isAdvancedOptions = !this.isAdvancedOptions;
  }

  onSubmit() {
    const flatten = this.isAdvancedOptions ? false : true;
    let options = this.FormData;

    if (!this.isAdvancedOptions) {
      options = _.omit(options, ['keycolumn', 'valuecolumn', 'groupingcolumn']);
    }

    const data = {
      options: {
        flatten,
        ...options,
      },
    };

    this.$state.go('app.dataset.wizard.name', data);
  }

}
