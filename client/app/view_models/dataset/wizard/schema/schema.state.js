import {
  isNull,
}
from 'lodash/lang';

const _getColumns = (fields, parent, columns = []) => {
  fields.forEach(item => {
    if (parent) {
      item.path = parent + '.' + item.name;
    } else {
      item.path = item.name;
    }
    columns.push(item);
    if (item.fields.length !== 0) {
      columns = _getColumns(item.fields, item.path || item.name, columns);
    }
  });

  return columns;
};

/*@ngInject*/
const schema = ($state, $stateParams, LoadAPI, DatasetAPI, UploadService) => {
  return LoadAPI.load({
      files: UploadService.files,
      name: `dataset${Math.ceil(Math.random() * 10000)}`,
      flatten: false,
      ...$stateParams.options,
    })
    .then(({
      sourceId,
    }) => {
      return DatasetAPI.getSchema({
          sourceId,
        })
        .then(data => {
          return {
            sourceId,
            fields: data.schema.fields,
          };
        });
    })
    .then(({
      sourceId,
      fields,
    }) => {
      DatasetAPI.deleteDataset({
        sourceId,
      });
      return fields;
    })
    .catch(() => {
      $state.go('app.dataset.create');
    });
};

class Controller {
  /*@ngInject*/
  constructor($scope, $state, $stateParams, $schema) {
    if (isNull($stateParams.options)) {
      $state.go('app.dataset.create');
    } else {
      $scope.schema = $schema;
      $scope.columns = _getColumns($schema);
      $scope.options = $stateParams.options;
    }
  }
}

/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.dataset.wizard.schema', {
      url: '/schema',
      template: `<dataset-schema
      schema="schema"
      columns="columns"
      options="options"></dataset-schema>`,
      params: {
        options: null,
      },
      controller: Controller,
      resolve: {
        $schema: schema,
      },
    });
};

export default State;
