import {
  MeasuresService,
}
from './measures.service';

/*@ngInject*/
class MeasuresController {
  constructor($element) {
    this.MeasuresService = new MeasuresService;
    const measuresData = this.measuresData;
    const el = $element[0].querySelector('#measuresChart');

    this.chart = this.MeasuresService.getChart({
      el,
      measuresData,
    });
  }
}

export default MeasuresController;
