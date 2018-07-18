import _ from 'lodash';
import uniqueRandomArray from 'unique-random-array';

/*@ngInject*/
const State = ($stateProvider) => {
  $stateProvider
    .state('app', {
      url: '/',
      abstract: true,
      template: `<layout-app datasets="datasets"></layout-app>`,
      resolve: {
        $init: /*@ngInject*/ ($state, DatasetAPI, DatasetStorageService) => {
          return new Promise((resolve) => {
            DatasetAPI.getListEx({})
              .then(({
                datasets,
              }) => {
                if (datasets.length === 0) {
                  $state.transition.then(({
                    name,
                  }) => {
                    if (name !== 'app.dataset.create') {
                      $state.go('app.dataset.create');
                      return false;
                    }
                  });
                  resolve([]);
                } else {
                  const dataset = _.find(datasets, i => {
                    return i.datasetId === localStorage.getItem(
                      'SelectedDatasetId');
                  });

                  const randomDataset = uniqueRandomArray(datasets)();

                  DatasetStorageService.setList({
                    datasets,
                  });

                  DatasetStorageService.setRoot(dataset ||
                    randomDataset, {}, false);

                  resolve(datasets);

                  return datasets;
                }
              });
          });
        },
        $user: /*@ngInject*/ ($auth, UserService, $state, $timeout) => {
          return new Promise((resolve, reject) => {
            if ($auth.isAuthenticated()) {
              resolve(UserService.getCurrentUserAuthData());
            } else {
              $timeout(() => $state.go('login'));
              reject();
            }
          });
        },
      },
    });
};

export default State;
