export class ModelTypeSelectorController {
  /*@ngInject*/
  constructor() {

  }

  isClassification() {
    return this.modelType !== 'classification';
  }

  isRegression() {
    return this.modelType !== 'regression';
  }
}
