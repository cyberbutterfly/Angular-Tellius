import angular from 'angular';
import EventEmitter from 'eventemitter3';

class DatasetAPIMock extends EventEmitter {
  constructor($q) {
    super();
    this.$q = $q;
  }

  getDataset() {
    return this.$q.all(
      [
        this.getData(),
        this.getMetadata(),
        this.getSchema(),
      ]
      )
      .then((values) => {
        let dataset = values.reduce((prev, curr) => {
          return Object.assign({}, prev, curr);
        });
        dataset.columns = ['iata', 'airport', 'city', 'state', 'country', 'lat', 'long'];

        this.emit('DATASET_CHANGED', {
          dataset,
        });
        return dataset;
      });
  }

  getMetadata() {
    return this.$q((resolve) => {
      let data = {
        'metaData': {
          'size': 3375,
          'noOfColumns': 7,
        },
      };

      resolve(data);
    });
  }

  getSchema() {
    return this.$q((resolve) => {
      let data = {
        'schema': {
          'fields': [
            {
              'name': 'iata',
              'dataType': 'StringType',
              'fields': [],
            },
            {
              'name': 'airport',
              'dataType': 'StringType',
              'fields': [],
            },
            {
              'name': 'city',
              'dataType': 'StringType',
              'fields': [],
            },
            {
              'name': 'state',
              'dataType': 'StringType',
              'fields': [],
            },
            {
              'name': 'country',
              'dataType': 'StringType',
              'fields': [],
            },
            {
              'name': 'lat',
              'dataType': 'StringType',
              'fields': [],
            },
            {
              'name': 'long',
              'dataType': 'StringType',
              'fields': [],
            },
          ],
        },
      };

      resolve(data);
    });
  }

  getData() {
    return this.$q((resolve) => {
      let data = {
        'data': [
          {
            'city': 'Bay Springs',
            'state': 'MS',
            'country': 'USA',
            'long': '-89.23450472',
            'iata': '00M',
            'airport': 'Thigpen ',
            'lat': '31.95376472',
          },
          {
            'city': 'Livingston',
            'state': 'TX',
            'country': 'USA',
            'long': '-95.01792778',
            'iata': '00R',
            'airport': 'Livingston Municipal',
            'lat': '30.68586111',
          },
          {
            'city': 'Colorado Springs',
            'state': 'CO',
            'country': 'USA',
            'long': '-104.5698933',
            'iata': '00V',
            'airport': 'Meadow Lake',
            'lat': '38.94574889',
          },
          {
            'city': 'Perry',
            'state': 'NY',
            'country': 'USA',
            'long': '-78.05208056',
            'iata': '01G',
            'airport': 'Perry-Warsaw',
            'lat': '42.74134667',
          },
          {
            'city': 'Hilliard',
            'state': 'FL',
            'country': 'USA',
            'long': '-81.90594389',
            'iata': '01J',
            'airport': 'Hilliard Airpark',
            'lat': '30.6880125',
          },
        ],
      };

      resolve(data);
    });
  }

  getAll() {
    return this.$q((resolve) => {
      resolve([
        {
          id: 0,
          type: 'json',
          name: 'Cool dataset',
          created: '2015-11-17T14:54:40.493Z',
          size: 1000000,
          jobs: 2,
          schedule: '15 min daily',
        },
        {
          id: 1,
          type: 'csv',
          name: 'Yet another dataset',
          created: '2014-09-17T14:54:40.493Z',
          size: 2000000,
          jobs: 0,
          schedule: '30 min per week',
        },
        {
          id: 2,
          type: 'url',
          name: 'Url dataset',
          created: '2014-09-17T14:54:40.493Z',
          size: 2000000,
          jobs: 0,
          schedule: '30 min per week',
          data: {
            resourceUrl: 'http://whitehouse.gov',
          },
        },
        {
          id: 3,
          type: 's3',
          name: 'AWS dataset',
          created: '2014-09-17T14:54:40.493Z',
          size: 2000000,
          jobs: 1,
          schedule: '15 min daily',
          data: {
            key: 'awskey',
            secret: 'awssecret',
            bucket: 'bucket',
          },
        },
      ]);
    });
  }

  delete() {
    return this.$q((resolve) => {
      resolve(true);
    });
  }
}

const module = angular.module('Tellius.api.datasetMock', []);

module.service('DatasetAPIMock', DatasetAPIMock);

export default module;
