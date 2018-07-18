import EventEmitter from 'eventemitter3';
import {
  isString,
  isUndefined,
}
  from 'lodash/lang';
import {
  omit,
}
  from 'lodash/object';

export class MLAPI extends EventEmitter {
  /*@ngInject*/
  constructor($q, ApiWrapper, DatasetStorageService) {
    super();

    this.$q                    = $q;
    this.api                   = ApiWrapper;
    this.DatasetStorageService = DatasetStorageService;
  }

  list(
    {
      ids,
      modelNames,
    }
  ) {
    if (!isString(ids) && !isString(modelNames)) {
      return this.$q.reject('Wrong arguments');
    }

    const url     = 'list';
    const payload = {
      options: {
        ids,
        modelnames: modelNames,
      },
    };
    return this._makeMLRequest({
      url,
      payload,
    });
  }

  sample(
    {
      id = this.DatasetStorageService.getCurrent(),
      ratio,
    }
  ) {
    if (isUndefined(ratio)) {
      return this.$q.reject('Wrong arguments');
    }

    let payload = {
      'id': id,
      'transformationtype': 'sampleratio',
      'options': {
        'ratio': ratio.toString(),
      },
    };

    return this._makeMLRequest({
      payload,
    });
  }

  labelIndexer(
    {
      sourceId,
      inputColumn,
      outputColumn = 'index_' + inputColumn,
    }
  ) {
    if (!isString(inputColumn) || !isString(outputColumn)) {
      return this.$q.reject('Wrong arguments');
    }

    const PAYLOAD = {
      'id': sourceId,
      'transformationtype': 'labelindexer',
      'options': {
        'inputcolumn': inputColumn,
        'outputcolumn': outputColumn,
      },
    };

    return this._makeMLRequest({
      payload: PAYLOAD,
    });
  }

  vectorAssembler(
    {
      sourceId,
      inputColumns,
      outputColumn = 'vector_' + inputColumns,
    }
  ) {
    const payload = {
      'id': sourceId,
      'transformationtype': 'vectorassembler',
      'options': {
        'inputcolumns': inputColumns.join(','),
        'outputcolumn': outputColumn,
      },
    };

    return this._makeMLRequest({
      payload,
    });
  }

  multiStringIndex(
    {
      sourceId,
      inputColumns,
      outputColumn = 'vector',
    }
  ) {
    if (!isString(sourceId) || !isString(inputColumns) || !isString(outputColumn)) {
      return this.$q.reject('Wrong arguments');
    }

    let payload = {
      'id': sourceId,
      'transformationtype': 'multistringindexer',
      'options': {
        'inputcolumns': inputColumns,
        'outputcolumn': outputColumn,
      },
    };

    return this._makeMLRequest({
      payload,
    })
      .then(res => {
        return {
          sourceId: res.id,
        };
      });
  }

  oneHotEncoder(
    {
      sourceId,
      inputColumn,
      outputColumn = inputColumn + '_vector',
    }
  ) {
    if (!isString(sourceId) || !isString(inputColumn) || !isString(outputColumn)) {
      return this.$q.reject('Wrong arguments');
    }

    const payload = {
      'id': sourceId,
      'transformationtype': 'onehotencoder',
      'options': {
        'inputcolumn': inputColumn,
        'outputcolumn': outputColumn,
      },
    };

    return this._makeMLRequest({
      payload,
    });
  }

  standardScalar(
    {
      sourceId,
      inputColumn,
      outputColumn = inputColumn + '_standard',
      withmean = 'false',
      withstd = 'false',
    }
  ) {
    if (!isString(sourceId) || !isString(inputColumn) || !isString(outputColumn)) {
      return this.$q.reject('Wrong arguments');
    }

    const payload = {
      'id': sourceId,
      'transformationtype': 'standardscaler',
      'options': {
        'inputcolumn': inputColumn,
        'outputcolumn': outputColumn,
        'withmean': withmean.toString(),
        'withstd': withstd.toString(),
      },
    };

    return this._makeMLRequest({
      payload,
    })
      .then((
        {
          id,
        }
      ) => {
        return {
          sourceId: id,
        };
      });
  }

  minmaxScaler(
    {
      sourceId,
      inputColumn,
      outputColumn = inputColumn + '_vector',
      min = '0',
      max = '1',
    }
  ) {
    if (!isString(sourceId) || !isString(inputColumn) || !isString(outputColumn)) {
      return this.$q.reject('Wrong arguments');
    }

    const payload = {
      'id': sourceId,
      'transformationtype': 'minmaxscaler',
      'options': {
        'inputcolumn': inputColumn,
        'outputcolumn': outputColumn,
        min,
        max,
      },
    };

    return this._makeMLRequest({
      payload,
    })
      .then((
        {
          id,
        }
      ) => {
        return {
          sourceId: id,
        };
      });
  }

  featureIndexer(
    {
      sourceId = this.DatasetStorageService.getCurrent(),
      inputColumn,
      outputColumn = 'index_' + inputColumn,
      maxCategories = '32',
    }
  ) {
    if (!isString(inputColumn) || !isString(outputColumn)) {
      return this.$q.reject('Wrong arguments');
    }

    const PAYLOAD = {
      'id': sourceId,
      'transformationtype': 'featureindexer',
      'options': {
        'inputcolumn': inputColumn,
        'outputcolumn': outputColumn,
        'maxcategories': maxCategories + '',
      },
    };

    return this._makeMLRequest({
      payload: PAYLOAD,
    });
  }

  labelConverter(
    {
      SourceId = this.DatasetStorageService.getCurrent(),
      inputColumn,
      outputColumn = inputColumn + 'state',
    }
  ) {
    if (!isString(inputColumn) || !isString(outputColumn)) {
      return this.$q.reject('Wrong arguments');
    }
    const PAYLOAD = {
      'id': SourceId,
      'transformationtype': 'labelconverter',
      'options': {
        'inputcolumn': inputColumn,
        'outputcolumn': outputColumn,
      },
    };

    return this._makeMLRequest({
      payload: PAYLOAD,
    });
  }

  decisiontreeclassifier(
    {
      id,
      options,
    }
  ) {
    if (isUndefined(id) || isUndefined(options)) {
      return this.$q.reject('Wrong arguments');
    }

    const API_URL = 'trainmodel/classification';
    const ALGO    = 'decisiontreeclassifier';

    options.delay = 'true';

    const payload = {
      'id': id,
      'modelname': options.modelname,
      'learningalgorithm': ALGO,
      'options': omit(options, 'modelname'),
    };

    return this._makeMLRequest({
      url: API_URL,
      payload,
      spinner: false,
    });
  }

  treeRegression(
    {
      id = this.DatasetStorageService.getCurrent(),
      options,
    }
  ) {
    if (isUndefined(id) || isUndefined(options)) {
      return this.$q.reject('Wrong arguments');
    }

    options.delay = 'true';
    const API_URL = 'trainmodel/regression';
    const ALGO    = 'decisiontreeregressor';
    const payload = {
      'id': id,
      'modelname': options.modelname,
      'learningalgorithm': ALGO,
      'options': omit(options, 'modelname'),
    };

    return this._makeMLRequest({
      url: API_URL,
      payload,
      spinner: false,
    });
  }

  linearRegression(
    {
      id = this.DatasetStorageService.getCurrent(),
      options,
    }
  ) {
    options.delay = 'true';
    const API_URL = 'trainmodel/regression';
    const ALGO    = 'linearregression';
    const payload = {
      'id': id,
      'modelname': options.modelname,
      'learningalgorithm': ALGO,
      'options': omit(options, 'modelname'),
    };

    return this._makeMLRequest({
      url: API_URL,
      payload,
      spinner: false,
    });
  }

  ridgeRegressionWithSGD(
    {
      id = this.DatasetStorageService.getCurrent(),
      options,
    }
  ) {
    options.delay = 'true';
    const API_URL = 'trainmodel/regression';
    const ALGO    = 'ridgeregressionwithsgd';
    const payload = {
      'id': id,
      'modelname': options.modelname,
      'learningalgorithm': ALGO,
      'options': omit(options, 'modelname'),
    };

    return this._makeMLRequest({
      url: API_URL,
      payload,
      spinner: false,
    });
  }

  kmeans(
    {
      id = this.DatasetStorageService.getCurrent(),
      options,
    }
  ) {
    const API_URL = 'trainmodel/clustering';
    const ALGO    = 'kmeans';
    const payload = {
      'id': id,
      'modelname': options.modelname,
      'learningalgorithm': ALGO,
      'options': omit(options, 'modelname'),
    };

    return this._makeMLRequest({
      url: API_URL,
      payload,
      spinner: false,
    });
  }

  deleteModel({modelname}) {
    const payload = {
      modelname,
    };

    return this.api.post('/ml/delete', payload);
  }

  randomforestclassifier(
    {
      id = this.DatasetStorageService.getCurrent(),
      options,
    }
  ) {
    options.delay = 'true';
    const API_URL = 'trainmodel/classification';
    const ALGO    = 'randomforestclassifier';
    const payload = {
      'id': id,
      'modelname': options.modelname,
      'learningalgorithm': ALGO,
      'options': omit(options, 'modelname'),
    };

    return this._makeMLRequest({
      url: API_URL,
      payload,
      spinner: false,
    });
  }

  gbtclassifier(
    {
      id = this.DatasetStorageService.getCurrent(),
      options,
    }
  ) {
    options.delay = 'true';
    const API_URL = 'trainmodel/classification';
    const ALGO    = 'gbtclassifier';
    const payload = {
      'id': id,
      'modelname': options.modelname,
      'learningalgorithm': ALGO,
      'options': omit(options, 'modelname'),
    };

    return this._makeMLRequest({
      url: API_URL,
      payload,
      spinner: false,
    });
  }

  trainPipeline(
    {
      sourceId,
      pipelineIds,
      modelName,
    }
  ) {
    return this.api.post('/ml/trainpipeline', {
      id: sourceId,
      pipelineids: pipelineIds.join(','),
      modelname: modelName,
    });
  }

  _makeMLRequest(
    {
      url = 'featuretransform',
      payload,
      spinner,
    }
  ) {
    return this.api.post('/ml/' + url, payload, undefined, spinner);
  }
}
