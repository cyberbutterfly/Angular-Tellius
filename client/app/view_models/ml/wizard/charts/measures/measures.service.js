import _ from 'lodash';
import highcharts from 'highcharts';

export class MeasuresService {
  /*@ngInject*/
  constructor() {}

  getChart({
    el,
    measuresData,
  }) {
    const {
      categories,
      data,
    } = _.reduce(measuresData, (prev, value, key) => {
      if (!isNaN(parseInt(value * 100, 10))) {
        prev.categories.push(key);
        prev.data.push(parseInt(value * 100, 10));
      }

      return prev;
    }, {
      categories: [],
      data: [],
    });

    return new highcharts.Chart({
      chart: {
        renderTo: el,
        type: 'bar',
        height: 180,
        style: {
          fontFamily: '"Maison Neue", sans-serif',
        },
        events: {
          load: function refresh(chart) {
            setTimeout(function refreshChart() {
              chart.target.reflow();
            }, 10);
          },
        },
      },
      colors: ['#5c6bc0', '#f65161', '#fdd835'],
      title: {
        text: null,
      },
      xAxis: {
        categories: categories,
      },
      yAxis: {
        min: 0,
        max: 100,
        labels: {
          overflow: 'justify',
        },
        title: {
          text: '',
        },
      },
      tooltip: {
        valueSuffix: ' %',
      },
      plotOptions: {
        bar: {
          groupPadding: 0.1,
          pointWidth: 10,
          colorByPoint: true,
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '14px',
              fontWeight: 'normal',
              color: '#546e7a',
              textShadow: 'none',
            },
            formatter: function formatLabel() {
              return this.y + '%';
            },
          },
        },
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      series: [{
        showInLegend: false,
        data: data,
      }],
    });
  }
}
