var svg1 = d3.select("#fundingPie")
	.append("svg")
	.append("g")

svg1.append("g")
	.attr("class", "slices");
svg1.append("g")
	.attr("class", "labels");
svg1.append("g")
	.attr("class", "lines");

var width = 560,
	height = 120,
	radius = Math.min(width, height) / 2;

var pie1 = d3.pie()
	// .startAngle(Math.PI / 1.5)
	// .endAngle(Math.PI * 2 + Math.PI /1.5)
	.sort(null)
	.value(function (d) {

		return d.value;
	});

var arc = d3.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

var pieChartRegion="global"

svg1.attr("transform", "translate(" + width / 2.7 + "," + height / 1.8 + ")");

var key1 = function (d) { return d.data.category; };

var color1 = d3.scaleOrdinal()
	.domain(["Vertical Funds", "Donor Countries", "Programme Countries", "UN Pooled Funds", "UN Agencies","European Union",  "Other"])
	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#ac4f5f"]);


function midAngle(d) {
	return d.startAngle + (d.endAngle - d.startAngle) / 2;
}

function dataMap1(filteredData, fundingCategories) {
	console.timeLog()
	var labels1 = color1.domain();
	labelMap1 = labels1.map(function (label) {

		summ = 0
		for (project in filteredData) {
			donors = filteredData[project]["donors"].split(';');//["budget"])
			for (donor in donors) {
				try {
					category = fundingCategories[donors[donor]].category;

					if (label == "Programme Countries") {
						if (category == "Government" && fundingCategories[donors[donor]].subCategory == filteredData[project].country) {
							budget = parseInt(filteredData[project]["budget"]) / donors.length
							summ = summ + budget
						}
					}

					else if (label == "Donor Countries") {
						if (category == "Government" && fundingCategories[donors[donor]].subCategory != filteredData[project].country) {
							budget = parseInt(filteredData[project]["budget"]) / donors.length
							summ = summ + budget
						}
					}

					else if (category == label) {
						budget = parseInt(filteredData[project]["budget"]) / donors.length
						summ = summ + budget
					}


				}
				catch (error) {
					// console.log("no category");
				}
			}
		}
		return {
			category: label,
			value: summ//filter portfolioData by year and region, 
			//for all projects with one of the funding sources in label:category, 
			//and then sum budgets divided by # of sources for that project

		}
	});
	// console.log(labelMap);
	return labelMap1;
}

function initPieChart1(pieData) {

	/* ------- PIE SLICES -------*/
	var slice = svg1.select(".slices").selectAll("path.slice")
		.data(pie1(pieData), key);

	slice.enter()
		.insert("path")
		.style("fill", function (d) { return color1(d.data.category); })
		.attr("class", "slice")  

	slice
		.transition().duration(1000)
		.attrTween("d", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
			return arc(interpolate(t));
			};
		})

	slice.exit()
		.remove();

	/* ------- TEXT LABELS -------*/

	var text = svg1.select(".labels").selectAll("text")
		.data(pie1(pieData), key1);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.attr("font-size", "12px")
		.text(function (d) {
			//				console.log(d)
			
			return d.data.category + " - " + nFormatter(d.data.value, 1);
		});

	text.transition().duration(1000)
		.attrTween("transform", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate(" + pos + ")";
			};
		})
		.styleTween("text-anchor", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start" : "end";
			};
		});

	text.exit()
		.remove();

	/* ------- SLICE TO TEXT POLYLINES -------*/

	var polyline = svg1.select(".lines").selectAll("polyline")
		.data(pie1(pieData), key1);

	polyline.enter()
		.append("polyline");

	polyline.transition().duration(1000)
		.attrTween("points", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};
		});

	polyline.exit()
		.remove();


}



function setSelectedId(s, v) {

	for (var i = 0; i < s.options.length; i++) {
		//console.log(s.options[i].value, v)
		if (s.options[i].value == v) {
			//console.log("here")
			s.options[i].selected = true;

			return;

		}

	}

}

function updatePieChart1(pieData) {




	/* ------- PIE SLICES -------*/
	var slice = svg1.select(".slices").selectAll("path.slice")
		.data(pie1(pieData), key)
		

	slice.enter()
		.insert("path")
		.style("fill", function (d) { return color1(d.data.category); })
		.attr("class", "slice")

	slice
		.transition().duration(1000)
		.attrTween("d", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				return arc(interpolate(t));
			};
		})

	slice.on('click', function (d) {
		oldFund = $("#fundingCategorySelect").find(":selected").text();
		fund = d.data.category//.toLowerCase()
		if (fund != oldFund) {

			console.log(fund)
			setSelectedId(document.getElementById('fundingCategorySelect'), fund)
			$('#fundingCategorySelect')
				.trigger('change');
		}
		else {
			setSelectedId(document.getElementById('fundingCategorySelect'), "All")
			$('#fundingCategorySelect')
				.trigger('change');
		}
	});

	slice.on('mouseover', function() {

		svg1.selectAll("path").style('opacity', 0.5);
		d3.select(this)
		  .style('opacity', 1);
	  })
	  .on('mouseout', function() {
		svg1.selectAll("path").style('opacity', 1);
	  });

	slice.exit()
		.remove();


	/* ------- TEXT LABELS -------*/

	var text = svg1.select(".labels").selectAll("text")
		.data(pie1(pieData), key1);

		sumall=0
		for(source in pieData){
	sumall+=pieData[source].value
	}

	text.text(function (d) {
		//console.log(d.data.category,d.data.value/sumall)
		if (d.data.value/sumall<0.0236) { return ""; } else {
			return d.data.category + " - " + nFormatter(d.data.value, 1);
		}
	});

	text.transition().duration(1000)
		.attrTween("transform", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate(" + pos + ")";
			};
		})
		.styleTween("text-anchor", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start" : "end";
			};
		});

	text.exit()
		.remove();

	/* ------- SLICE TO TEXT POLYLINES -------*/

	var polyline = svg1.select(".lines").selectAll("polyline")
		.data(pie1(pieData), key1);

	polyline.transition().duration(1000)
		.attrTween("points", function (d) {
			//console.log(d.data.value,sumall)
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
					if (d.data.value/sumall<0.0236) { 
						return [arc.centroid(d2),arc.centroid(d2),arc.centroid(d2)]
				} else {
					
					return [arc.centroid(d2), outerArc.centroid(d2), pos];

				}
			};
		});

	polyline.exit()
		.remove();
	//console.log("addd")
};




//////pie chart 2


var svg2 = d3.select("#regionPie")
	.append("svg")
	.append("g")

svg2.append("g")
	.attr("class", "slices");
svg2.append("g")
	.attr("class", "labels");
svg2.append("g")
	.attr("class", "lines");


var pie2 = d3.pie()
	.sort(null)
	.value(function (d) {
		return d.value;
	});

var arc = d3.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

svg2.attr("transform", "translate(" + width / 2.2 + "," + height / 1.8 + ")");

var key = function (d) { return d.data.category; };

var color2 = d3.scaleOrdinal()
	.domain(["Caribbean", "AIS", "Pacific"])
	.range(["#008080", "#97002B", "#F0A500"]);

function dataMap2(filteredData, regionCategories) {
	var labels = color2.domain();
	labelMap = labels.map(function (label) {
		//console.log(label)
		sum = 0
		for (project in filteredData) {
			try {
				region = filteredData[project]["region"]
				// console.log(filteredData[project]["country"])
				// console.log(region)
				//region="Caribbean"
				if (region == label) {
					budget = parseInt(filteredData[project]["budget"])
					sum = sum + budget
				}


			}
			catch (error) {
				//		console.log(filteredData[project]["country"])
				// console.log("no category");
			}

		}
		return {
			category: label,
			value: sum//filter portfolioData by year and region, 
			//for all projects with one of the funding sources in label:category, 
			//and then sum budgets divided by # of sources for that project

		}
	});
	// console.log(labelMap);
	return labelMap;
}



function initPieChart2(pieData) {

	/* ------- PIE SLICES -------*/
	var slice = svg2.select(".slices").selectAll("path.slice")
		.data(pie2(pieData), key)

	slice.enter()
		.insert("path")
		.style("fill", function (d) { return color2(d.data.category); })
		.attr("class", "slice")

	slice
		.transition().duration(1000)
		.attrTween("d", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				return arc(interpolate(t));
			};
		})

	slice.exit()
		.remove();

	/* ------- TEXT LABELS -------*/

	var text = svg2.select(".labels").selectAll("text")
		.data(pie2(pieData), key);

	//console.log(pieData)



	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.attr("font-size", "12px")
		.text(function (d) {
			if (d.data.value == 0) { return ""; } else {
				return d.data.category + " - " + nFormatter(d.data.value, 1);
			}
		});


	text.transition().duration(1000)
		.attrTween("transform", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate(" + pos + ")";
			};
		})
		.styleTween("text-anchor", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start" : "end";
			};
		});

	text.exit()
		.remove();

	/* ------- SLICE TO TEXT POLYLINES -------*/

	var polyline = svg2.select(".lines").selectAll("polyline")
		.data(pie2(pieData), key);

	polyline.enter()
		.append("polyline");

	polyline.transition().duration(1000)
		.attrTween("points", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};
		});

	polyline.exit()
		.remove();
}








function updatePieChart2(pieData) {

	/* ------- PIE SLICES -------*/
	var slice = svg2.select(".slices").selectAll("path.slice")
		.data(pie2(pieData), key);

	slice.enter()
		.insert("path")
		.style("fill", function (d) { return color2(d.data.category); })
		.attr("class", "slice")

	slice
		.transition().duration(1000)
		.attrTween("d", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				return arc(interpolate(t));
			};
		})

	slice.on('click', function (d) {

		oldRegion = selectedRegion


		region = d.data.category.toLowerCase()

	//	console.log(oldRegion, region, oldRegion == region)


		newRegion = region
		if (region == oldRegion) {
			newRegion = "global"
		}
		console.log(newRegion)
		pieChartRegion=newRegion

	});

	slice.on('mouseover', function() {

		svg2.selectAll("path").style('opacity', 0.5);
		d3.select(this)
		  .style('opacity', 1);
	  })
	  .on('mouseout', function() {
		svg2.selectAll("path").style('opacity', 1);
	  });


	slice.exit()
		.remove();

	/* ------- TEXT LABELS -------*/

	var text = svg2.select(".labels").selectAll("text")
		.data(pie2(pieData), key);

	//console.log(pieData)


	text.text(function (d) {
		if (d.data.value == 0) { return ""; } else {
			return d.data.category + " - " + nFormatter(d.data.value, 1);
		}
	});



	text.transition().duration(1000)
		.attrTween("transform", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate(" + pos + ")";
			};
		})
		.styleTween("text-anchor", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start" : "end";
			};
		});



	/* ------- SLICE TO TEXT POLYLINES -------*/

	var polyline = svg2.select(".lines").selectAll("polyline")
		.data(pie2(pieData), key);


	polyline.transition().duration(1000)
		.attrTween("points", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
					if (d.data.value/sumall<0.0236) { 
						return [arc.centroid(d2),arc.centroid(d2),arc.centroid(d2)]
				} else {
					
					return [arc.centroid(d2), outerArc.centroid(d2), pos];
				}
			};
		});

	polyline.exit()
		.remove();
};









var pieEventObj = {

	'mouseover': function (d, i, j) {
		pathAnim(d3.select(this), 1);

		/* var thisDonut = charts.select('.type' + j);
		 thisDonut.select('.value').text(function(donut_d) {
			 return d.data.val.toFixed(1) + donut_d.unit;
		 });
		 thisDonut.select('.percentage').text(function(donut_d) {
			 return (d.data.val/donut_d.total*100).toFixed(2) + '%';
		 });*/
	},

	'mouseout': function (d, i, j) {
		var thisPath = d3.select(this);
		if (!thisPath.classed('clicked')) {
			pathAnim(thisPath, 0);
		}
		/*var thisDonut = charts.select('.type' + j);
		setCenterText(thisDonut);*/
	},


	'click': function (d, i, j) {


		var thisPath = d3.select(this);
		var clicked = thisPath.classed('clicked');
		pathAnim(thisPath, ~~(!clicked));
		thisPath.classed('clicked', !clicked);

		//setCenterText(thisDonut);
	}
};

var pathAnim = function (path, dir) {
	switch (dir) {
		case 0:
			path.transition()
				.duration(500)
				.ease('bounce')
				.attr('d', d3.arc()
					.innerRadius((radius - 100))
					.outerRadius(radius - 50)
				);
			break;

		case 1:
			path.transition()
				.attr('d', d3.svg.arc()
					.innerRadius((radius - 100))
					.outerRadius((radius - 50) * 1.08)
				);
			break;
	}
}

// var arc = d3.arc()
// .innerRadius(radius - 100)
// .outerRadius(function(){
// return (d3.select(this).classed('clicked'))? (radius - 50) * 1.08
// 															   : (radius - 50);
// });

// var svg = d3.select("body").append("svg")
// .attr("width", width)
// .attr("height", height)
// .append("g")
// .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// var paths = svg.selectAll("path")
// .data(pie1(dataset.apples));



// paths
// 	.transition()
// 	.duration(1000)
// 	.attr('d', arc);

// paths.enter()
// 	.append('svg:path')
// 		.attr('d', arc)
// 		.style('fill', function(d, i) {
// 			return color(i);
// 		})
// 		.style('stroke', '#FFFFFF')
// 		.on(eventObj)

// paths.exit().remove();

