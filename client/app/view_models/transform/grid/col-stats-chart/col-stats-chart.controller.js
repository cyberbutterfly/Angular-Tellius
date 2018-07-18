import angular from 'angular';

import {
  ColStatsChartService,
  }
from './col-stats-chart.service';

export class ColStatsChartController {
    /*@ngInject*/
    constructor($element, $scope, $attrs) {
        this.$element = $element;
        this.$scope = $scope;
        this.$attrs = $attrs;

        this.chart = null;
        this.$scope.$watch('$ctrl.colStatsChartData', this.createChart.bind(this));

        let rootEl = angular.element(this.$element[0]);
        this.$scope.$watch(function watchWidthChange() {
            return rootEl.css('width');
        }, this.widthChange.bind(this));
    }

    createChart(colStatsChartData) {
        this.ColStatsChartService = new ColStatsChartService;
        let el = this.$element[0].querySelector('#ColStatsChart');
        let selectedStatsColumn = this.selectedStatsColumn;
        this.chart = this.ColStatsChartService.getChart({
            el,
            colStatsChartData,
            selectedStatsColumn,
        });
    }

    widthChange() {
        this.chart.reflow();
    }

}
