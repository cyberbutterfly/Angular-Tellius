export class FeatureColumnOptionController {
  /*@ngInject*/
  constructor() {

  }

  setOption(name, value) {
    const option = {
      name,
      value,
    };

    this.onChange({
      column: this.column,
      option,
    });
  }

  isStandardScalar() {
    return this.column.feature.value === 'standardScalar';
  }

  isMinmaxScalar() {
    return this.column.feature.value === 'minmaxScalar';
  }
}
