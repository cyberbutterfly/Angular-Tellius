import _ from 'lodash';

class Controller {
  /*@ngInject*/
  constructor($scope, resolveData) {
    const {
      measuresData,
      modelList,
      options,
      formState,
    } = resolveData;

    console.log('evaluate: ', {
      measuresData,
      modelList,
      options,
      formState,
    });

    $scope.measuresData = measuresData;
    $scope.modelList    = modelList;
    $scope.options = options;
    $scope.formState = formState;
  }
}

/*@ngInject*/
const resolveData = (
  $state, $stateParams, $q, $timeout,
  EvaluateAPI, CompareAPI, MLAPI, MLWizard, MLStorageService, MeasuresModel, ) => {
  const dfd = $q.defer();
  const state = MLWizard.getState({type: 'evaluate'});

  $timeout(() => {
    if (_.isUndefined(state)) {
      $state.go('app.ml.wizard.selection');
      dfd.reject();
      return;
    }

    const {
      modelType,
      models,
    } = state.options;

    MLAPI.list({
      ids: 'all',
    })
      .then((
        {
          results,
        }
      ) => {
        const modelList = results.filter(model => {
          return model.algorithmtype === modelType;
        });
        const measuresData = _.reduce(models, (prev, {modelname}) => {
            prev[modelname] = _.find(modelList, (i) => {
                return i.modelname === modelname;
              }).evaluationMetric;
            return prev;
          }, {});

          dfd.resolve({
            ...state,
            modelList,
            measuresData,
          });
        });
      });

    // if (
    //   _.isNull(sourceId) ||
    //   _.isNull(subsetSourceId) ||
    //   _.isNull(models)) {
    //   $state.go('app.ml.wizard.selection');
    //   dfd.reject();
    // } else {
    //   MeasuresModel.getMeasures({
    //     subsetSourceId,
    //     models,
    //     labelIndex,
    //     featuresColumns,
    //     modelType,
    //   })
    //     .then(data => {
    //       let algos = [];
    //
    //       if (modelType === 'classification') {
    //         algos = [
    //           'decisiontreeclassifier',
    //           'gbtclassifier',
    //           'randomforestclassifier',
    //         ];
    //       } else if (modelType === 'regression') {
    //         algos = [
    //           'linearregression',
    //           'ridgeregressionwithsgd',
    //           'decisiontreeregressor',
    //         ];
    //       }
    //
    //       return MLAPI.list({
    //         ids: 'all',
    //       })
    //         .then((
    //           {
    //             results,
    //           }
    //         ) => {
    //           const modelList = results.filter(model => {
    //             return algos.includes(model.learningalgorithm);
    //           });
    //
    //           dfd.resolve({
    //             ...state,
    //             modelList,
    //             measuresData: data,
    //           });
    //         })
    //         .catch(err => dfd.reject(err));
    //     })
    //     .catch(err => {
    //       dfd.reject(err);
    //     });
  //   }
  // });
  return dfd.promise;
};

/*@ngInject*/
const State = $stateProvider => {
  $stateProvider.state('app.ml.wizard.evaluate', {
    url: '/evaluate',
    template: `<ml-evaluate-view-model
    options="options"
    form-state="formState"
    model-list="modelList"
    measures-data="measuresData"></ml-evaluate-view-model>`,
    controller: Controller,
    resolve: {
      resolveData,
    },
  });
};

export default State;
