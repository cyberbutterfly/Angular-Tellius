import _ from 'lodash';

export class TransformationController {
  /*@ngInject*/
  constructor($state, DatasetStorageService, MLTransformation, MLWizard) {
    this.$state = $state;
    this.DatasetStorageService = DatasetStorageService;
    this.MLTransformation = MLTransformation;
    this.MLWizard = MLWizard;
  }

  $onInit() {
    const dataset = this.DatasetStorageService.getDataset();
    this.FormData = {
      selection: 1,
      features: 50,
      ratio: 0.7,
      maxcategories: 32,
      selectedColumns: [],
      ...this.formState,
    };

    this.columnsInfo = dataset.columnsInfo;
    this.columnTypes = ['categorical', 'continuous'];
    this.NULL_TYPES = this.MLTransformation.getNullTypes();
    this.TRANSFORM_TYPES = this.MLTransformation.getTransformTypes();
  }

  getColumnCategory(name) {
    const dataset = this.DatasetStorageService.getDataset();
    const selectedColumn = _.find(dataset.columnsInfo, column => {
      return column.name === name;
    });

    let featureCategory;

    try {
      featureCategory = selectedColumn.featureCategory;
    } catch (e) {
      featureCategory = '';
    }

    return featureCategory;
  }

  checkAll() {
    const selectedColumns = this.schema.filter(i => {
      return i.name !== this.options.targetVariable;
    });

    this.FormData.selectedColumns = selectedColumns;
  }

  onChangeTargetVariable() {
    this.FormData.selectedColumns = this.FormData.selectedColumns.filter(i => {
      return i.name !== this.options.targetVariable;
    });
  }

  setColumnOptions(column, option) {
    column.options = column.options || {};
    column.options[option.name] = option.value;
  }

  onChangeTransformType(column) {
    column.options = {};
  }

  setNullHandler(column) {
    const getHandler = (type) => {
      return this.NULL_TYPES.filter(data => {
        return data.value === type;
      })[0];
    };

    if (column.dataType === 'StringType') {
      column.handleNull = getHandler('ignore');
    } else {
      column.handleNull = getHandler('mean');
    }
  }

  prev() {
    this.$state.go('app.ml.create');
  }

  onSubmit() {
    const isChanged = () => {
      return this.MLWizard.isChanged({
        type: 'transformation',
        currentState: {
          formState: this.FormData,
        },
      });
    };

    if (!isChanged()) {
      this.$state.go('app.ml.wizard.selection');
      return false;
    }

    this.MLWizard.setState({
      type: 'transformation',
      data: {
        options: this.options,
        formState: this.FormData,
      },
    });

    this.errors = [];
    if (this._validation()) {
      this.MLTransformation.columnTransformation({
          targetVariable: this.options.targetVariable,
          sourceId: this.DatasetStorageService.getCurrent(),
          schema: this.DatasetStorageService.getDataset().schema,
          columns: this.FormData.selectedColumns,
        })
        .then(res => {
          this.MLWizard.setState({
            type: 'selection',
            data: {
              options: {
                featuresColumns: ['features'],
                modelType: this.options.modelType,
                ...res,
              },
            },
          });

          this.$state.go('app.ml.wizard.selection');
        })
        .catch(err => {
          this.errors.push({
            field: '',
            description: err,
          });

          console.error('ctrl err:', err);
        });
    }
  }

  isTargetValue(columnName) {
    return columnName === this.options.targetVariable;
  }

  _validation() {
    this.errors = [];

    if (!_.isString(this.options.targetVariable)) {
      this.errors.push({
        field: 'targetVariable',
        description: 'Target variable is required',
      });
    }

    if (!_.lte(this.FormData.ratio, 1)) {
      this.errors.push({
        field: 'ratio',
        description: 'Ratio should be less then 1',
      });
    }

    if (!_.gt(this.FormData.ratio, 0)) {
      this.errors.push({
        field: 'ratio',
        description: 'Ratio should be more then 0',
      });
    }

    if (!_.gt(this.FormData.maxcategories, 0)) {
      this.errors.push({
        field: 'maxcategories',
        description: 'Maxcategories should be more then 0',
      });
    }

    if (!_.isArray(this.FormData.selectedColumns) || this.FormData.selectedColumns
      .length === 0) {
      this.errors.push({
        field: 'selectedColumns',
        description: 'Select a column',
      });
    }

    return this.errors.length === 0;
  }
}
