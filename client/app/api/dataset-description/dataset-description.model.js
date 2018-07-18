import EventEmitter from 'eventemitter3';

export class DatasetDescriptionModel extends EventEmitter {
  /*@ngInject*/
  constructor(ApiWrapper) {
    super();
    this.api = ApiWrapper;
  }

  getDatasetDescription({
    sourceId,
  }) {
    return this.api.get(`dataset/${sourceId}`);
  }

  create({
    sourceId,
    measures,
    dimensions,
    dateFormat,
    timeColumn,
  }) {
    dimensions = dimensions.map(i => {
      return {
        name: i,
        'type': 'dimension',
      };
    });

    measures = measures.map(i => {
      return {
        name: i,
        'type': 'measure',
      };
    });

    const columns = [].concat(dimensions, measures);

    return this.api.post('dataset', {
      'datasetId': sourceId,
      'columns': columns,
      'dateFormat': dateFormat,
      'timeColumn': timeColumn,
    });
  }

  update({
    sourceId,
    measures,
    dimensions,
    dateFormat,
    timeColumn,
    mapColumns,
  }) {
    dimensions = dimensions.map(i => {
      return {
        name: i,
        'type': 'dimension',
      };
    });

    measures = measures.map(i => {
      return {
        name: i,
        'type': 'measure',
      };
    });

    const columns = [].concat(dimensions, measures);

    return this.api.put('dataset/' + sourceId, {
      'columns': columns,
      'dateFormat': dateFormat,
      'timeColumn': timeColumn,
      'mapColumns': mapColumns,
    });
  }
}
