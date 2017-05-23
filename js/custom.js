var width = 720, 
height = 480, 
xMargin = 60, 
yMargin = 60,
xLabelX = 360,
xLabelY = height,
yLabelX = xMargin - 35,
yLabelY = yMargin + 40;

var trend1 = {}, trend2 = {};

var colorScale = d3.scale.ordinal()
				.domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
				.range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]);


var svg = d3.select("div#trends")
			.append("svg")
			.attr("class", "trends")
			.attr("height", height)
			.attr("width", width);

ARTFORMS = ["Opera","Play","Craft Fair","Dance","Classical","Jazz","Festival","Musical","Art Museum","Park","Salsa","Ballet"]

d3.csv("data/california-trends.csv", function(data){
	for (i=0; i<ARTFORMS.length; i++){
		trend1[ARTFORMS[i]] = [];
	}
	for (i=0; i<data.length; i++){
		trend1[data[i].Artform].push({Year: data[i].Year, Popularity: data[i].Popularity});
	}

	drawTrends(trend1)
	
	drawParsets(state1);
});

d3.csv("data/nmexico-trends.csv", function(data){
	for (i=0; i<ARTFORMS.length; i++){
		trend2[ARTFORMS[i]] = [];
	}
	for (i=0; i<data.length; i++){
		trend2[data[i].Artform].push({Year: data[i].Year, Popularity: data[i].Popularity});
	}
});

function drawTrends(trends){
	svg.selectAll(".trend-line").remove();
	svg.selectAll(".trend-circle").remove();
	for (i=0; i<ARTFORMS.length; i++){
		showTrends(trends[ARTFORMS[i]], ARTFORMS[i], colorScale(i));
	}	
}

var xScale = d3.scale.linear()
				.domain([2002, 2012])
				.range([xMargin, width - xMargin]);

var yScale = d3.scale.log()
				.base(2)
				.domain([1, 250])
				.range([height - yMargin, yMargin]);

// Define x and y Axis
var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom")
					.tickFormat(d3.format("d"))
					.ticks("5");

var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("left")
					.ticks("7")
					.tickFormat(d3.format("d"));

svg.append("g")
	.attr("class", "axis")
	.attr("id", "trendX")
	.attr("transform", "translate(0," + (height - yMargin) + ")")
	.call(xAxis);

svg.append("g")
	.attr("class", "axis")
	.attr("id", "trendY")
	.attr("transform", "translate("+ xMargin + ","+ 0 +")")
	.call(yAxis);

function drawPlots(id, name){
	if (id == 'california'){
		drawTrends(trend1);
		drawParsets(state1);
	}
	if (id == 'nmexico'){
		drawTrends(trend2);
		drawParsets(state2);
	}
}

function showTrends(data, artform, color){
	var group = svg.append('g')
					.attr('class', artform)

	var line = d3.svg.line()
					.x(function(d){ return xScale(d.Year); })
					.y(function(d){ return yScale(d.Popularity); })

	var dataLine = group.append("path")
					.datum(data)
					.attr("class", "trend-line")
					.attr("d", line)
					.attr("opacity", 0.5)
					.attr("stroke", color);

	var dataCircles = group.selectAll("circle")
					.data(data)
					.enter()
					.append("circle")
					.attr("class", "trend-circle")
					.attr("cx", function(d){ return xScale(d.Year); })
					.attr("cy", function(d){ return yScale(d.Popularity); })
					.attr("r", 5)
					.attr("fill", colorScale(i));
}