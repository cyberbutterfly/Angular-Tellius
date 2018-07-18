export class DataflowAPIMock {
    /*@ngInject*/
    constructor($q) {
        this.$q = $q;
    }

    getData() {
        return new Promise((resolve) => {
            resolve(
                {
                    'nodes': [
                      {
                          'id': 'load01',
                          'type': 'load',
                          'text': 'Loaded Dataset "Airlines"',
                          'tasks': '0',
                      },
                      {
                          'id': 'fusion01',
                          'type': 'fusion',
                          'text': 'Dataset Fusion between "Airlines" and "Month Prices"',
                          'tasks': '2',
                      },
                      {
                          'id': 'agregate01',
                          'type': 'agregate',
                          'text': 'Aggregated Columns "DepTime" and "CRSDepTime"',
                          'tasks': '0',
                      },
                      {
                          'id': 'agregate02',
                          'type': 'agregate',
                          'text': 'Aggregated Columns "ArrDelay" and "DepDelay"',
                          'tasks': '0',
                      },
                      {
                          'id': 'transform01',
                          'type': 'transform',
                          'text': 'Transformed Dataset "23"',
                          'tasks': '5',
                      },
                      {
                          'id': 'ml01',
                          'type': 'mltrain',
                          'text': 'Ml Models Training "Airlines"',
                          'tasks': '0',
                      },
                      {
                          'id': 'transform02',
                          'type': 'transform',
                          'text': 'Transformed Dataset "24"',
                          'tasks': '0',
                      },
                      {
                          'id': 'transform03',
                          'type': 'transform',
                          'text': 'Transformed Dataset "25"',
                          'tasks': '1',
                      },
                      {
                          'id': 'save01',
                          'type': 'save',
                          'text': 'Saved Dataset "Airlines 1"',
                          'tasks': '0',
                      },
                      {
                          'id': 'save02',
                          'type': 'save',
                          'text': 'Saved Dataset "Airlines 2"',
                          'tasks': '0',
                      },
                      {
                          'id': 'save03',
                          'type': 'save',
                          'text': 'Saved Dataset "Airlines 3"',
                          'tasks': '2',
                      },
                    ],
                    'edges': [
                      {
                          'source': 'load01',
                          'target': 'fusion01',
                      },
                      {
                          'source': 'fusion01',
                          'target': 'agregate01',
                      },
                      {
                          'source': 'fusion01',
                          'target': 'agregate02',
                      },
                      {
                          'source': 'fusion01',
                          'target': 'transform01',
                      },
                      {
                          'source': 'fusion01',
                          'target': 'ml01',
                      },
                      {
                          'source': 'agregate01',
                          'target': 'transform02',
                      },
                      {
                          'source': 'transform01',
                          'target': 'save01',
                      },
                      {
                          'source': 'transform01',
                          'target': 'transform03',
                      },
                      {
                          'source': 'transform01',
                          'target': 'save02',
                      },
                      {
                          'source': 'transform03',
                          'target': 'save03',
                      },
                    ],
                });
        });
    }

    getNodeTypes() {
      const types = [
            {'name': 'Load', 'type': 'load', 'group': 'data-io' },
            {'name': 'Save', 'type': 'save', 'group': 'data-io' },
            {'name': 'Transform', 'type': 'transform', 'group': 'data-m' },
            {'name': 'Fusion', 'type': 'fusion', 'group': 'data-m' },
            {'name': 'Split', 'type': 'split', 'group': 'data-m' },
            {'name': 'Aggregate', 'type': 'aggregate', 'group': 'data-m' },
            {'name': 'ML Train', 'type': 'mltrain', 'group': 'ml' },
            {'name': 'ML Predict', 'type': 'mlpredict', 'group': 'ml' },
      ];
      return types;
    }

    getNodeTypesGroups() {
      const groups = [
            {'name': 'Dataset Input/Output', 'id': 'data-io'},
            {'name': 'Data Manipulation', 'id': 'data-m'},
            {'name': 'Machine Learning', 'id': 'ml'},
      ];
      return groups;
    }
}
