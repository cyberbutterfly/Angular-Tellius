import '../../api/wrapper/wrapper';

class HighchartsConfigService {
	constructor($q,LineChartService,PieChartService, ScatterPlotService,
  BubbleChartService, PolarChartService, ZoomableChartService,
  WordCloudService, RadialProgressService, DrillService, BarChartsService,
  ConfidenceIntervalService, CombineChartService) {

    this.LineChartService= LineChartService;
    this.PieChartService = PieChartService;
    this.ScatterPlotService = ScatterPlotService;
    this.BubbleChartService = BubbleChartService;
    this.PolarChartService = PolarChartService;
    this.ZoomableChartService = ZoomableChartService;
    this.WordCloudService = WordCloudService;
    this.RadialProgressService = RadialProgressService;
    this.DrillService = DrillService;
    this.BarChartsService = BarChartsService;
    this.ConfidenceIntervalService = ConfidenceIntervalService;
    this.CombineChartService = CombineChartService;
    this.$q = $q;

	}

  getHighchartsObj(viz, vizpad) {
    const defer = this.$q.defer();

    switch (viz.type) {
      case 'column':
        this.BarChartsService.getHighchartsObj(viz, vizpad, "column").then((success) => {
           this.highChartConfigObj = success;
           defer.resolve(this.highChartConfigObj);
        }, (error) => {
            console.log("error", error)
        });
        break;
      case 'barsHorizontal':
        this.BarChartsService.getHighchartsObj(viz, vizpad, "bar").then((success) => {
           this.highChartConfigObj = success;
           defer.resolve(this.highChartConfigObj);
        }, (error) => {
            console.log("error", error)
        });
      break;
      case 'scatter':
        this.ScatterPlotService.getHighchartsObj(viz, vizpad).then((success) => {
           this.highChartConfigObj = success;
           defer.resolve(this.highChartConfigObj);
        }, (error) => {
            console.log("error", error)
        });
        break;
      case 'line':
        this.BarChartsService.getHighchartsObj(viz, vizpad, "line").then((success) => {
            this.highChartConfigObj = success;
           defer.resolve(this.highChartConfigObj);
        }, (error) => {
            console.log("error", error)
        });
        break;
      case 'confidenceLineRange':
        this.ConfidenceIntervalService.getHighchartsObj(viz, vizpad).then((success) => {
            this.highChartConfigObj = success;
          defer.resolve(this.highChartConfigObj);
        }, (error) => {
          console.log("error", error);
        });
        break;
      case 'zoomable':
        this.ZoomableChartService.getHighchartsObj(viz, vizpad).then((success) => {
            this.highChartConfigObj = success;
           defer.resolve(this.highChartConfigObj);
        }, (error) => {
            console.log("error", error)
        });
        break;
      case 'multipleLine':
        if (viz.lineThirdMeasure.column != '') {
          this.LineChartService.getHighchartsObj(viz, vizpad).then((success) => {
              this.highChartConfigObj = success;
            defer.resolve(this.highChartConfigObj);
          }, (error) => {
            console.log("error", error)
          });
        } else {
          defer.resolve(false);
        }
        break;
      case 'barsHorizontalStacked':
        if (viz.color != '') {

          this.BarChartsService.getStackedBarChartHighchartsObj(viz, vizpad, 'bar').then((success) => {
              this.highChartConfigObj = success;
             defer.resolve(this.highChartConfigObj);
          }, (error) => {
              console.log("error", error)
          });
        } else
          defer.resolve(false);
        break;
      case 'barsVerticalStacked':
        if (viz.color != '') {

          this.BarChartsService.getStackedBarChartHighchartsObj(viz, vizpad, 'column').then((success) => {
              this.highChartConfigObj = success;
             defer.resolve(this.highChartConfigObj);
          }, (error) => {
              console.log("error", error)
          });
        } else
          defer.resolve(false);
        break;
      case 'pie':
        this.PieChartService.getHighchartsObj(viz, vizpad).then((success) => {
            this.highChartConfigObj = success;
           defer.resolve(this.highChartConfigObj);
        }, (error) => {
            console.log("error", error)
        });
        break;
      case 'area':
        this.BarChartsService.getHighchartsObj(viz, vizpad, "area").then((success) => {
            this.highChartConfigObj = success;
           defer.resolve(this.highChartConfigObj);
        }, (error) => {
            console.log("error", error)
        });
        break;
      case 'stackedArea':
        if (viz.color != '') {
          if (viz.color != null) {
            this.BarChartsService.getStackedBarChartHighchartsObj(viz, vizpad, 'area').then((success) => {
                this.highChartConfigObj = success;
               defer.resolve(this.highChartConfigObj);
            }, (error) => {
                console.log("error", error)
            });
          }
        } else
          defer.resolve(false);
        break;
      case 'polar':
        this.PolarChartService.getHighchartsObj(viz, vizpad).then((success) => {
            this.highChartConfigObj = success;
           defer.resolve(this.highChartConfigObj);
        }, (error) => {
            console.log("error", error)
        });
        break;
      case 'bubble':
        if (typeof viz.radius != "undefined" || typeof viz.label != "undefined" || typeof viz.bubbleAxis != "undefined") {
          this.BubbleChartService.getHighchartsObj(viz, vizpad).then((success) => {
              this.highChartConfigObj = success;
             defer.resolve(this.highChartConfigObj);
          }, (error) => {
              console.log("error", error)
          });
        }
        break;
      case 'combineColChart':
        if (viz.combinedGraphMeasure.column != '') {
          this.CombineChartService.getHighchartsObj(viz,vizpad).then((success) => {
              this.highChartConfigObj = success;
              defer.resolve(this.highChartConfigObj);
          }, (error) => {
              console.log("error", error)
          });
        } else
          defer.resolve(false);
        break;
      case 'combineBarChart':
        if (viz.combinedGraphMeasure.column != '') {
          this.CombineChartService.getHighchartsObj(viz,vizpad).then((success) => {
              this.highChartConfigObj = success;
              defer.resolve(this.highChartConfigObj);
          }, (error) => {
              console.log("error", error)
          });
        } else
          defer.resolve(false);
        break;
      case 'combineBarStacked':
        if (viz.color != '') {

          this.BarChartsService.getStackedBarChartHighchartsObj(viz, vizpad, 'column').then((success) => {
              this.highChartConfigObj = success;
             defer.resolve(this.highChartConfigObj);
          }, (error) => {
              console.log("error", error)
          });
        } else
          defer.resolve(false);
        break;
      case 'radialProgress':
        this.RadialProgressService.drawChart(viz);
        break;
      case 'wordCloud':
        // this.highChartConfigObj = this.GraphService.SomeService.getHighchartsObj(viz, vizpad);
        break;
      case 'simpleCount':
        // this.highChartConfigObj = this.GraphService.SomeService.getHighchartsObj(viz, vizpad);
        break;
      case 'table':
        // this.highChartConfigObj = this.GraphService.SomeService.getHighchartsObj(viz, vizpad);
        break;
      default:

    }

    return defer.promise;
  }

}
export default HighchartsConfigService;
