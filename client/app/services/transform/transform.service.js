import '../../api/wrapper/wrapper';

class TransformService {
	constructor() {
		
	}

	transformForChart(vizPadObj, vizObj, data) {
		var parentThis = this;
		var chart = {};
		switch(vizObj.type) {
			
			case "bar":
				chart = parentThis.verticalBar(vizPadObj, vizObj, data);
				break;
			
			case "lineChart":
				chart = parentThis.lineChart(vizPadObj, vizObj, data);
				break;
			
			case "pieChart":
				chart = parentThis.pieChart(vizPadObj, vizObj, data);
				break;

		}

		return chart;
	}

	verticalBar(vizPadObj, vizObj, data) {
		
		var x = [];
		var y = [];
		var parentThis = this;

		angular.forEach(data.data, function(d){
			x.push(d.Dest);
			y.push(parseInt(d.AirTime_avg));
		});



		var chart = {

			chart: {
		    	type: vizObj.type,
		    	color : {
		        	linearGradient : [0,0, 0, 300],
		        	stops : [
		          		[0, 'rgb(256, 256, 256)'],
		          		[1, 'rgb(0, 0, 0)']
		        	]
		    	},
			    renderTo: vizObj.title,
			    width: $(".chartcontainer").width()-70,
			},
			title: {
			    text: 'Airlines'
			},
			xAxis: {
			    categories: x,
			},
			yAxis: {
			    title: {
			        text: "AirTime"
			    }
			},
			
			series: [{
			    name: vizObj['x-axis'],
			    data: y,
			    color : {
			        linearGradient : [0, 0, 0, 300],
			        stops : [
			            [0, '#00C3DB'],
			            [1, '#5867C3'],
			        ]
			    },
			}]
		}

		console.log('in service ', chart);

		return chart;
	}

	lineChart(vizPadObj, vizObj, data) {

	}

	pieChart(vizPadObj, vizObj, data) {

	}
	
}
export default TransformService;