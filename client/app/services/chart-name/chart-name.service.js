// import headerCellTemplate from './headerCell.jade';

class ChartNameService {
  /*@ngInject*/
    constructor(ApiWrapper, $q, $rootScope, $location, VizpadDataService) {
        this.api = ApiWrapper;
        this.$rootScope = $rootScope;
        this.$q = $q;
        this.VizpadDataService = VizpadDataService;

        this.charts = [
            {
                name: "Line charts",
                subTypes: [
                    "Basic line chart"
                ]
            },
            {
                name: "Bar charts",
                subTypes: [
                    "Bars Horizontal",
                    "Bars Horizontal Stacked",
                    "Bars Vertical",
                    "Bars Vertical Stacked",
                ]
            },
            {
                name: "Pie chart",
                subTypes: [
                    "Basic Pie chart"
                ]
            },
            {
                name: "Area charts",
                subTypes: [
                    "Basic Area",
                    "Stacked Area"
                ]
            },
            {
                name: "Scatter plot",
                subTypes: [
                    "Scatter plot"
                ]
            },
            {
                name: "Polar chart",
                subTypes: [
                    "Polar chart"
                ]
            },
            {
                name: "Heat map",
                subTypes: [
                    "Heat map"
                ]
            },
            {
                name: "Bubble chart",
                subTypes: [
                    "Bubble chart"
                ]
            },
            {
                name: "Other charts",
                subTypes: [
                    "Map view",
                    "Word cloud",
                    "Radial progress",
                    "Table view",
                    "Simple Count",
                ]
            }
        ]

    }
}

export default ChartNameService;
