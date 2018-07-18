/*@ngInject*/
const State = $stateProvider => {
  $stateProvider.state('app.ml.wizard', {
    url: '',
    abstract: true,
    template: '<ml-wizard-view-model></ml-wizard-view-model>',
    controller: /*@ngInject*/($rootScope, MLWizard) => {
      const stop = $rootScope.$on('$stateChangeStart', (evt, to) => {
        const isWizardScreen = (state) => {
          return state.indexOf('app.ml.wizard.') !== -1;
        };

        if (!isWizardScreen(to.name)) {
          stop();
          MLWizard.reset();
        }
      });
    },
    resolve: {
      $dataset: /*@ngInject*/ datasetResolve => {
        return datasetResolve.getPromise({
          schema: true,
          typeStats: true,
          featurestats: true,
        });
      },
    },
  });
};

export default State;
