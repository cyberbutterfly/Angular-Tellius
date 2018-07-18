import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
import HighchartsDrillDown from 'highcharts/modules/drilldown';
HighchartsMore(Highcharts);
HighchartsDrillDown(Highcharts);

import _ from 'lodash';
import $ from 'jquery';

class WordCloudService {
  /*@ngInject*/
  constructor(VizpadDataService, DatafileService) {
    this.DatafileService = DatafileService;
    this.VizpadDataService = VizpadDataService;
  }

  drawChart(viz) {
    this.VizpadDataService.getWordCloudData(viz).then( (wordCloudData) => {
      var frequency_list = wordCloudData;

      var color = d3.scale.linear()
        .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20,
          100
        ])
        .range(viz.colorPaletteDataColors.colors);
      document.getElementById(viz
          .id).innerHTML = '';
      var layout = cloud()
        .size([$("#viz"+viz.id).width(), $("#viz"+viz.id).height()])
        .words(frequency_list)
        .padding(5)
        .rotate(function() {
          return ~~(Math.random() * 2) * 90;
        })
        .font("Impact")
        .fontSize(function(d) {
          return d.size;
        })
        .on("end", draw);

      layout.start();

      function draw(words) {
        d3.select("#viz" + viz.id)
          .append("svg")
          .attr("width", $("#" + viz
              .id)
            .width())
          .attr("height", $("#" + viz
              .id)
            .height())
          .append("g")
          .attr("transform", "translate(" + layout.size()[
              0] / 2 + "," + layout.size()[1] / 2 +
            ")")
          .selectAll("text")
          .data(words)
          .enter()
          .append("text")
          .style("font-size", function(d) {
            return d.size + "px";
          })
          .style("font-family", "Impact")
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] +
              ")rotate(" + d.rotate + ")";
          })
          .text(function(d) {
            return d.text;
          });
      }
    }, (error) => {
      // ErrorHandlerService.error(error);
    });
  }
}
export default WordCloudService;
