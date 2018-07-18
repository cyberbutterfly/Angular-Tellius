import _ from 'lodash';
import EventEmitter from 'eventemitter3';

export class BaseModel extends EventEmitter {
  /*@ngInject*/
  constructor() {
    super();
  }

  isSelected(type) {
    return _.indexOf(this.selectedModels, type) !== -1;
  }
}

export default class FormCtrl {
  /*@ngInject*/
  constructor($scope, MLAPI, MLStorageService) {
    this.$scope           = $scope;
    this.MLAPI            = MLAPI;
    this.MLStorageService = MLStorageService;
  }

  bindEvents(
    {
      modelName,
    }
  ) {
    const handler = _.partial(this.__onSubmitHandler, modelName);
    this.MLStorageService.on('ML::SelectionController:submit', handler, this);

    this.$scope.$on('$destroy', () => {
      this.MLStorageService.removeListener('ML::SelectionController:submit', handler);
    });
  }

  formDataToString(FormData) {
    return _.reduce(FormData, (prev, value, key) => {
      prev[key] = value + '';
      return prev;
    }, {});
  }

  trainPipeline({
    sourceId,
    pipelineIds,
    modelName,
    modelData,
    FormData,
    algorithm,
  }) {
    pipelineIds = pipelineIds.slice();
    pipelineIds.push(modelData.id);

    return this.MLAPI.trainPipeline({
      sourceId,
      pipelineIds,
      modelName,
    })
      .then(() => {
        return {
          modelname: modelName,
          ...modelData,
          FormData,
          algorithm,
        };
      })
      .catch(e => {
        console.log(e);
        return Promise.reject(e);
      });
  }

  __onSubmitHandler(modelName, params) {
    this.MLStorageService.addModel({
      name: modelName,
      result: this.onSubmit(params),
    });
  }

}
