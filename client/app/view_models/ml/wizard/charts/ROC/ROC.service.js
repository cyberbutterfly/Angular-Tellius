import _ from 'lodash';
import highcharts from 'highcharts';

export class ROCService {
  /*@ngInject*/
  constructor() {

  }

  getChart({
    el,
    rocData,
  }) {
    const series = _.reduce(rocData, (prev, value, key) => {
      let {
        truePositiveRate,
        falsePositiveRate,
      } = value;

      truePositiveRate = truePositiveRate ? truePositiveRate.split(',') : [];
      falsePositiveRate = falsePositiveRate ? falsePositiveRate.split(',') : [];

      const data = falsePositiveRate.map((v, k) => {
        return [Number(v), Number(truePositiveRate[k])];
      });

      prev.push({
        name: key,
        data,
      });
      return prev;
    }, []);

    return new highcharts.Chart({
      chart: {
        renderTo: el,
        type: 'spline',
        height: 500,
        width: 780,
        style: {
          fontFamily: '"Maison Neue", sans-serif',
        },
      },
      series: series,
      colors: ['#5c6bc0', '#f65161', '#26c6da', '#fbc02d'],
      title: {
        text: null,
      },
      xAxis: {
        tickInterval: 0.1,
        min: 0,
        max: 1,
        tickWidth: 0,
        title: {
          text: 'FALSE POSITIVE RATE',
          margin: 15,
          style: {
            color: '#37474f',
            fontSize: '12px',
            useHTML: true,
          },
        },
        gridLineColor: '#dbe5ea',
        gridLineWidth: 1,
      },
      yAxis: {
        tickInterval: 0.1,
        min: 0,
        max: 1,
        title: {
          text: 'TRUE POSITIVE RATE',
          margin: 25,
          style: {
            color: '#37474f',
            fontSize: '12px',
            useHTML: true,
          },
        },
        gridLineWidth: 1,
        gridLineColor: '#dbe5ea',
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: false,
        borderWidth: 1,
        backgroundColor: ('#FFFFFF'),
        shadow: false,
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false,
            lineWidth: 4,
          },
        },
      },
    });
  }
}
