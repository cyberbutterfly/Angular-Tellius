export class MatrixController {
  /*@ngInject*/
  constructor() {
    this.matrix = this.matrixData.confusionMatrix.split(',');
  }
}
