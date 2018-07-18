import _ from 'lodash';
import {
  ROCService,
}
from './ROC.service';

export class ROCController {
  /*@ngInject*/
  constructor($element) {
    this.el = $element[0].querySelector('#rocChart');
    this.ROCService = new ROCService;
  }

  $onChanges({
    rocData,
  }) {
    if (!_.isUndefined(this.chart)) {
      this.chart.destroy();
    }

    this.chart = this.ROCService.getChart({
      el: this.el,
      rocData: rocData.currentValue,
    });
  }
}
