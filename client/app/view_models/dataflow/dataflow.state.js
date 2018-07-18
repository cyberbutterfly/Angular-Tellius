/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.dataflow', {
      url: 'dataflow',
      template: `<dataflow-view data="data"></dataflow-view>`,
      resolve: {
        $dataset: /*@ngInject*/ datasetResolve => {
          return datasetResolve.getPromise({
            schema: true,
          });
        },
      },
    });
};

export default State;
