import catchAll from 'catch.all';
const getResolved = items => {
  return new Promise(resolve => {
    const resolved = [];

    for (const [index, promise] of items.entries()) {
      promise.then(value => {
        resolved.push(value);
        if (index === items.length - 1) {
          resolve(resolved);
        }
      }, () => {
        if (index === items.length - 1) {
          resolve(resolved);
        }
      });
    }
  });
};

export class SelectionController {
  /*@ngInject*/
  constructor($q, $scope, $state, DatasetStorageService, MLStorageService, MLWizard) {
    this.$q                    = $q;
    this.$scope                = $scope;
    this.$state                = $state;
    this.DatasetStorageService = DatasetStorageService;
    this.MLStorageService      = MLStorageService;
    this.MLWizard              = MLWizard;

    this.loading               = false;

    this.categories = this.MLStorageService.getCategories(this.options.modelType);
    this.columns    = DatasetStorageService.getColumns();

    this._setModels({
      categories: this.categories,
    });
  }

  isLoading() {
    return this.loading;
  }

  prev() {
    this.$state.go('app.ml.wizard.transformation');
  }

  isClassification() {
    return this.options.modelType === 'classification';
  }

  isRegression() {
    return this.options.modelType === 'regression';
  }

  isClustering() {
    return this.options.modelType === 'clustering';
  }

  onSubmit() {
    this.errors = [];
    this.MLStorageService.resetModels();
    this.loading = true;

    const listener = this.$scope.$watchCollection(
      '$ctrl.MLStorageService._models', (
        newVal
      ) => {
        if (newVal && newVal.length === this.selectedModels.length) {
          const promises = this.MLStorageService.getModels()
            .map(model => {
              return model.result;
            });

          Promise.all(promises)
            .then(models => {
              listener();
              const FormData = {};

              models.forEach(model => {
                FormData[model.algorithm] = model.FormData;
              });

              this.MLWizard.setState({
                type: 'selection',
                data: {
                  options: {
                    ...this.options,
                    selectedModels: this.selectedModels,
                  },
                  formState: FormData,
                },
              });

              this.MLWizard.setState({
                type: 'evaluate',
                data: {
                  options: {
                    ...this.options,
                    models,
                  },
                },
              });

              this.$state.go('app.ml.wizard.evaluate');
            }, data => {
              catchAll(promises)
                .then(errors => {
                  getResolved(promises)
                  .then(resolved => {
                    if (resolved.length !== 0) {
                      listener();

                      const FormData = {};

                      resolved.forEach(model => {
                        FormData[model.algorithm] = model.FormData;
                      });

                      this.MLWizard.setState({
                        type: 'selection',
                        data: {
                          options: {
                            ...this.options,
                            selectedModels: this.selectedModels,
                          },
                          formState: FormData,
                        },
                      });

                      this.MLWizard.setState({
                        type: 'evaluate',
                        data: {
                          options: {
                            ...this.options,
                            models: resolved,
                          },
                        },
                      });
                    } else {
                      this.loading = false;

                      for (const error of errors) {
                        this.errors.push({
                          field: 'model',
                          description: error,
                        });
                      }

                      this.$scope.$apply();
                    }
                  });
                });
              return data;
            });
        } else {
          this.MLStorageService.resetModels();
        }
      }, true);


    this.MLStorageService.emit('ML::SelectionController:submit', {
      ...this.options,
    });
  }

  _setModels(
    {
      categories,
    }
  ) {
    try {
      this.selectedModels = this.options.selectedModels || [categories[0].name];
    } catch (err) {
      this.selectedModels = [];
    }
  }
}
