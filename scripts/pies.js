var portfolioPieWidth = 560,
	portfolioPieHeight = 120,
	radius = Math.min(portfolioPieWidth, portfolioPieHeight) / 2;

var pie = d3.pie()
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

var pieKey = function (d) { return d.data.category; };

//pie chart initializations

var svgFundingPie = d3.select("#fundingPie")
	.append("svg")
	.append("g")
var svgRegionPie = d3.select("#regionPie")
	.append("svg")
	.append("g")

svgFundingPie.append("g")
	.attr("class", "slices");
svgFundingPie.append("g")
	.attr("class", "labels");
svgFundingPie.append("g")
	.attr("class", "lines");
svgRegionPie.append("g")
	.attr("class", "slices");
svgRegionPie.append("g")
	.attr("class", "labels");
svgRegionPie.append("g")
	.attr("class", "lines");

var pieChartRegion = "global"

var colorFunding = d3.scaleOrdinal()
	.domain(["Vertical Funds", "Donor Countries", "Programme Countries", "UN Pooled Funds", "UN Agencies", "European Union", "Other"])
	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#ac4f5f"]);

var colorRegion = d3.scaleOrdinal()
	.domain(["Caribbean", "AIS", "Pacific"])
	.range(["#008080", "#97002B", "#F0A500"]);

svgRegionPie.attr("transform", "translate(" + portfolioPieWidth / 2.2 + "," + portfolioPieHeight / 1.8 + ")");
svgFundingPie.attr("transform", "translate(" + portfolioPieWidth / 2.7 + "," + portfolioPieHeight / 1.8 + ")");


///functions

function dataMapFunding(filteredData, fundingCategories) {
	console.timeLog()
	var labels1 = colorFunding.domain();
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

function dataMapRegion(filteredData) {
	var labels2 = colorRegion.domain();
	labelMap = labels2.map(function (label) {
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

function initPieChart(svgNum, colorFunc, pieData) {
	console.log(svgNum)

	/* ------- PIE SLICES -------*/
	var slice = svgNum.select(".slices").selectAll("path.slice")
		.data(pie(pieData), pieKey)

	slice.enter()
		.insert("path")
		.style("fill", function (d) { return colorFunc(d.data.category); })
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

	var text = svgNum.select(".labels").selectAll("text")
		.data(pie(pieData), pieKey);

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

	var polyline = svgNum.select(".lines").selectAll("polyline")
		.data(pie(pieData), pieKey);

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

function updatePieChart(svgNum, colorFunc, pieData) {

	/* ------- PIE SLICES -------*/
	var slice = svgNum.select(".slices").selectAll("path.slice")
		.data(pie(pieData), pieKey);

	slice.enter()
		.insert("path")
		.style("fill", function (d) { return colorFunc(d.data.category); })
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

	if (svgNum == svgRegionPie) {
		slice.on('click', function (d) {

			oldRegion = selectedRegion


			region = d.data.category.toLowerCase()

			//	console.log(oldRegion, region, oldRegion == region)


			newRegion = region
			if (region == oldRegion) {
				newRegion = "global"
			}
			console.log(newRegion)
			pieChartRegion = newRegion

		});
	}
	else if (svgNum == svgFundingPie) {
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
	}

	slice.on('mouseover', function () {

		svgNum.selectAll("path").style('opacity', 0.5);
		d3.select(this)
			.style('opacity', 1);
	})
		.on('mouseout', function () {
			svgNum.selectAll("path").style('opacity', 1);
		});


	slice.exit()
		.remove();

	/* ------- TEXT LABELS -------*/

	var text = svgNum.select(".labels").selectAll("text")
		.data(pie(pieData), pieKey);

	// 	//console.log(pieData)




	sumall = 0
	for (source in pieData) {
		sumall += pieData[source].value
	}

	text.text(function (d) {
		//console.log(d.data.category,d.data.value/sumall)
		if (d.data.value / sumall < 0.0236) { return ""; } else {
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

	var polyline = svgNum.select(".lines").selectAll("polyline")
		.data(pie(pieData), pieKey);


	polyline.transition().duration(1000)
		.attrTween("points", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {

				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				if (d.data.value / sumall < 0.0236) {
					return [arc.centroid(d2), arc.centroid(d2), arc.centroid(d2)]
				} else {

					return [arc.centroid(d2), outerArc.centroid(d2), pos];
				}
			};
		});

	polyline.exit()
		.remove();
}

function midAngle(d) {
	return d.startAngle + (d.endAngle - d.startAngle) / 2;
}
