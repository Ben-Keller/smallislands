var svg = d3.select("#fundingPie")
			.append("svg")
			.append("g")

		svg.append("g")
			.attr("class", "slices");
		svg.append("g")
			.attr("class", "labels");
		svg.append("g")
			.attr("class", "lines");

		var width = 300,
			height = 110,
			radius = Math.min(width, height) / 2;

		var pie = d3.pie()
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

		svg.attr("transform", "translate(" + width / 2 + "," + height / 1.8 + ")");

		var key = function (d) { return d.data.category; };

		var color = d3.scaleOrdinal()
			.domain(["European Union", "Donor Countries", "Programme Countries", "UN Agencies", "UN Pooled Funds", "Vertical Funds", "Other"])
			.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#ac4f5f"]);

		function dataMap1(filteredData, fundingCategories) {
			var labels = color.domain();
			labelMap = labels.map(function (label) {
				//console.log(label)
				sum = 0
				for (project in filteredData) {
					donors = filteredData[project]["donors"].split(';');//["budget"])
					for (donor in donors) {
						try {
							category = fundingCategories[donors[donor]].category;

							if (label == "Programme Countries") {
								if (category == "Government" && fundingCategories[donors[donor]].subCategory == filteredData[project].country) {
									budget = parseInt(filteredData[project]["budget"]) / donors.length
									sum = sum + budget
								}
							}

							else if (label == "Donor Countries") {
								if (category == "Government" && fundingCategories[donors[donor]].subCategory != filteredData[project].country) {
									budget = parseInt(filteredData[project]["budget"]) / donors.length
									sum = sum + budget
								}
							}

							else if (category == label) {
								budget = parseInt(filteredData[project]["budget"]) / donors.length
								sum = sum + budget
							}


						}
						catch (error) {
							// console.log("no category");
						}
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

		function updatePieChart1(data) {

			/* ------- PIE SLICES -------*/
			var slice = svg.select(".slices").selectAll("path.slice")
				.data(pie(data), key);

			slice.enter()
				.insert("path")
				.style("fill", function (d) { return color(d.data.category); })
				.attr("class", "slice");

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

			var text = svg.select(".labels").selectAll("text")
				.data(pie(data), key);

			text.enter()
				.append("text")
				.attr("dy", ".35em")
				.attr("font-size", "10px")
				.text(function (d) {
					return d.data.category + " - " + nFormatter(d.data.value, 1);
				});

			function midAngle(d) {
				return d.startAngle + (d.endAngle - d.startAngle) / 2;
			}

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

			var polyline = svg.select(".lines").selectAll("polyline")
				.data(pie(data), key);

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

		svg2.attr("transform", "translate(" + width / 2.5 + "," + height / 1.8 + ")");

		var key2 = function (d) { return d.data.category; };

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

		function updatePieChart2(data) {

			/* ------- PIE SLICES -------*/
			var slice = svg2.select(".slices").selectAll("path.slice")
				.data(pie(data), key2);

			slice.enter()
				.insert("path")
				.style("fill", function (d) { return color2(d.data.category); })
				.attr("class", "slice");

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
				.data(pie(data), key);

			text.enter()
				.append("text")
				.attr("dy", ".35em")
				.attr("font-size", "10px")
				.text(function (d) {
					return d.data.category + " - " + nFormatter(d.data.value, 1);
				});

			function midAngle(d) {
				return d.startAngle + (d.endAngle - d.startAngle) / 2;
			}

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
				.data(pie(data), key2);

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
		};





		Promise.all([
			d3.json("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/exports/fundingCategories.json"),
			d3.csv("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/sids_db.csv")
		]).then(function (files) {

			filteredData = files[1].filter(function (d) { return parseInt(d.year) == 2020 });//.filter(function (d) { return d.sdg.includes('No poverty') });
			console.log(filteredData)
			updatePieChart1(dataMap1(filteredData, files[0]));
			updatePieChart1(dataMap1(filteredData, files[0]));

			updatePieChart2(dataMap2(filteredData));
			updatePieChart2(dataMap2(filteredData));
			console.log(files[0])


			$("#regionSelect").on('change', function () {
		
			});

			$("#yearSelect").on('change', function () {
            });

		})



		function nFormatter(num, digits) {
			var si = [
				{ value: 1, symbol: "" },
				{ value: 1E3, symbol: "k" },
				{ value: 1E6, symbol: "M" },
				{ value: 1E9, symbol: "B" }
			];
			var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
			var i;
			for (i = si.length - 1; i > 0; i--) {
				if (num >= si[i].value) {
					break;
				}
			}
			return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
		}