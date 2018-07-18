import highcharts from 'highcharts';

export class ColStatsChartService {
  /*ngInject*/
  constructor() {}

  getChart({
    el,
    colStatsChartData,
    selectedStatsColumn,
  }) {
    const data = new Array();
    for (let i = 0; i < colStatsChartData.length; i++) {
      const arr = new Array();
      const single = colStatsChartData[i];
      const keys = Object.keys(single);

      let name = single[keys[0]];
      let val = parseFloat(single[keys[2]]);

      if (isNaN(val)) {
        val = 0.0;
      }

      arr.push(name);
      arr.push(val);
      data.push(arr);
    }

    const seriesName = selectedStatsColumn;
    const chart = new highcharts.Chart({
      chart: {
        renderTo: el,
        type: 'column',
      },
      title: {
        text: null,
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        title: {
          text: null,
        },
        gridLineColor: '#dbe5ea',
      },
      tooltip: {
        formatter: function tooltip() {
          return this.series.name + ' <b>' + this.key + '</b> = <b>' +
            this.y + '</b>';
        },
      },
      credits: {
        enabled: false,
      },
      series: [{
        data: data,
        name: seriesName,
        color: '#26c6da',
      }],
    });

    return chart;
  }
}
