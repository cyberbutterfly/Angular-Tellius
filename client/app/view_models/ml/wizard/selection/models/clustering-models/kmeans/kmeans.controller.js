import {
  isUndefined,
  isNumber,
  isString,
}
from 'lodash/lang';
import {
  reduce,
}
from 'lodash/collection';

export class KMeansModelController {
  /*@ngInject*/
  constructor($scope, $q, MLAPI, MLStorageService) {
    this.$q = $q;
    this.MLAPI = MLAPI;
    this.MLStorageService = MLStorageService;

    this.FormData = {
      numclusters: 2,
      initializationmode: 'mode',
      initializationsteps: 5,
      maxiteration: 20,
      toi: 0.0004,
    };

    let listener = this.MLStorageService.on('ML::SelectionController:submit', (params) => {
      this.MLStorageService.addModel({
        name: 'kmeans',
        result: this.onSubmit(params),
      });
    });

    $scope.$on('$destroy', () => {
      listener.removeAllListeners();
    });
  }

  onSubmit({
    sourceId,
    featuresColumns,
  }) {
    if (this._validate()) {
      const FormData = reduce(this.FormData, (prev, value, key) => {
        prev[key] = value + '';
        return prev;
      }, {});
      const options = {
        featurescolumn: featuresColumns.join(','),
        ...FormData,
      };

      return this.MLAPI.kmeans({
        id: sourceId,
        options,
      });
    } else { //eslint-disable-line no-else-return
      return this.$q.reject('Wrong argumnets');
    }
  }

  _validate() {
    this.errors = [];

    if (!isUndefined(this.FormData.numclusters) &&
      !isNumber(this.FormData.numclusters)) {
      this.errors.push({
        field: 'numclusters',
        description: 'numclusters is a number',
      });
    }

    if (!isUndefined(this.FormData.numclusters) &&
      this.FormData.numclusters <= 0) {
      this.errors.push({
        field: 'numclusters',
        description: 'numclusters shoud be a positive number',
      });
    }

    if (!isUndefined(this.FormData.initializationmode) &&
      !isString(this.FormData.initializationmode)) {
      this.errors.push({
        field: 'initializationmode',
        description: 'initializationmode is a string',
      });
    }

    if (!isUndefined(this.FormData) &&
      !isNumber(this.FormData.initializationsteps)) {
      this.errors.push({
        field: 'initializationsteps',
        description: 'initializationsteps is a number',
      });
    }

    if (!isUndefined(this.FormData.maxiteration) &&
      !isNumber(this.FormData.maxiteration)) {
      this.errors.push({
        field: 'maxiteration',
        description: 'maxiteration is a number',
      });
    }

    if (!isUndefined(this.FormData.toi) &&
      !isNumber(this.FormData.toi)) {
      this.errors.push({
        field: 'toi',
        description: 'toi is a number',
      });
    }

    return this.errors.length === 0;
  }
}
