
// countryDictTemp=[]

// fetch("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/profileData.json")
// .then(res => res.json())
// .then(data =>countryDictTemp.push(data))

// fetch("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/blueData.json")
// .then(res => res.json())
// .then(data =>keyData.push(data))

// fetch("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/digitalData.json")
// .then(res => res.json())
// .then(data=>keyData.push(data))
var photoLinks = []
$.getJSON('https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/exports/photoLinks.json', function (dat) {
	//console.log(dat);
	photoLinks.push(dat);
	// // photoLinks=data2;
	console.log(photoLinks);
})

var metadata=[]
$.getJSON("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/exports/keyMetadata.json",function(dat){
	metadata.push(dat);
});

fetch("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/exports/allKeyData.json")
	.then(res => res.json())
	.then(data => countryProfileInit(data))

function countryProfileInit(allKeyData) {
	console.log(photoLinks[0])

	document.getElementById("countrySelect").addEventListener("change", compileCountryData);


	$("#countryCsvButton").click(function(){

		countryExport=[]
		pillars=["Blue","Climate","Digital"]
		infos=["Finance","Profile"]

		console.log(countryCode)
		console.log(countryList)
		
		for(pillar in pillars){
			for(indicator in allKeyData[countryCode][pillars[pillar]]){
				newIndi={}
				el=allKeyData[countryCode][pillars[pillar]][indicator]
				newIndi["axis"]=el.axis
				for(country in countryList){
					country=countryList[country]
					el=allKeyData[country][pillars[pillar]][indicator]
					newIndi[country]=el.value
				}
				countryExport.push(newIndi)
			}
		}

		for(category in infos){
			for(indicator in allKeyData[countryCode][infos[category]]){
				newIndi={}
				newIndi["axis"]=indicator
				for(country in countryList){
					country=countryList[country]
					el=allKeyData[country][infos[category]][indicator]
					newIndi[country]=el
				}
				countryExport.push(newIndi)
			}
		}
		
		console.log(countryExport)
		console.log(allKeyData[countryCode])

		headers={}
		headers["axis"]="Indicator"
		for(country in countryList){
			headers[countryList[country]]=allKeyData[countryList[country]].Profile.Country
		}
console.log(allKeyData)
		exportCSVFile(headers,countryExport,"sids_profile_data","")}) //download(filteredProjects); });
	

	function compileCountryData() {
		var x = document.getElementById("countrySelect");
		countryCode = x.value;
		//   console.log(countryCode);
		countryName = allKeyData[countryCode].Profile.Country
		countryDict = allKeyData[countryCode]["Profile"]
		climateData = allKeyData[countryCode]["Climate"]
		blueData = allKeyData[countryCode]["Blue"]
		digitalData = allKeyData[countryCode]["Digital"]
		financeData = allKeyData[countryCode]["Finance"]

		//console.log(allKeyData.barbados)


		// update country info 
		$("#countryProfileInfo").html("<b>Population: </b>".concat(countryDict["Population"].toString(), "<br>\
                  <b>Region: </b>", countryDict["Region"], "<br>\
                  <b>Income Group: </b>", countryDict["Income Classification"], "<br>\
                  <b>Languages: </b>", countryDict["Languages"], "<br>\
                  <b>Surface Area: </b>", countryDict["Surface Area"], "<br>\
                  <b>HDI: </b>", countryDict["Human Development Index"]));
		$("#reliefMap").attr("src", "maps/relief/".concat(countryCode, "Relief.png"))
		$("#countryImage").attr("src", "images/countryPhotos/".concat(countryCode, ".jpg"))
		$("#countryImage").hover(
			function () {
				$(this).css("filter", "brightness(80%)");
				console.log(photoLinks[0])
				console.log(photoLinks[0][countryName])
				$("#imageLink").text(photoLinks[0][countryName]);
				$("#imageLink").css("display","block");
				
			},
			function () {
				 $(this).css("filter", "brightness(100%)");
				 $("#imageLink").css("display","none");
				 }
		)

		// console.log(financeData)
		financeText = ""
		Object.keys(financeData).forEach(function (d) {
			financeText = financeText + "<b>" + d + ": </b>" + nFormatter(financeData[d], 2) + "<br>";
		});
		// console.log("finance",financeText)
		document.getElementById('financeInfo').innerHTML = financeText



		//   "<b>Population: </b>".concat(countryDict["Population"].toString(),"<br>\
		//   <b>Region: </b>",countryDict["Region"],"<br>\
		//   <b>Income Group: </b>", countryDict["Income Classification"],"<br>\
		//   <b>Languages: </b>", countryDict["Languages"],"<br>\
		//   <b>Surface Area: </b>", countryDict["Surface Area"] ,"<br>\
		//   <b>HDI: </b>",countryDict["Human Development Index"]);


		// update stories 

		document.getElementById("countryStories").innerHTML = "<h4>Stories from ".concat(countryDict["Country"], "</h5>\
  <p>", countryDict["Country"], " pioneers US$ 12.5 million agreement to prevent deforestation and maintain trajectory\
    towards resilience\
  </p>\
  <p> ", countryDict["Country"], " placing gender equality at the center of private sector and disaster management\
  </p>\
  <p>Circular economy opportunities can\
    reduce GHG emissions with 44% in ", countryDict["Country"], "\
  </p>");


		// update all 3 spider charts
		countryList = [countryCode]

		svg_radar1 = RadarChart("#climateSpider", radarChartOptionsClimate, countryList, "Climate");

		svg_radar2 = RadarChart("#blueSpider", radarChartOptionsBlue, countryList, "Blue");

		svg_radar3 = RadarChart("#digitalSpider", radarChartOptionsDigital, countryList, "Digital");


	}

	////////////////////////////////////////////////////////////
	//////////////////////// Set-Up //////////////////////////////
	//////////////////////////////////////////////////////////////

	var margin = { top: 50, right: 45, bottom: 30, left: 45 },
		width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
		height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);


	var radarChartOptionsClimate = {
		w: 180,
		h: 200,
		margin: margin,
		maxValue: 1,
		levels: 5,
		spin: 0,
		roundStrokes: false,
		color: d3.scale.ordinal().range(["#0DB14B", "#EDC951", "#CC333F", "#00A0B0", "#FFFFFF"])//,
		//				legend: { title: 'Organization XYZ', translateX: 120, translateY: 140 },
	};
	var radarChartOptionsBlue = {
		w: 180,
		h: 200,
		margin: margin,
		maxValue: 1,
		levels: 5,
		spin: 0,//3.1415/6,
		roundStrokes: false,
		color: d3.scale.ordinal()
			.range(["#0BC6FF", "#EDC951", "#CC333F", "#00A0B0", "#FFFFFF"]),
		legend: { title: 'Legend', translateX: 0, translateY: 0 },
	};
	var radarChartOptionsDigital = {
		w: 180,
		h: 200,
		margin: margin,
		maxValue: 1,
		levels: 5,
		spin: 0,
		roundStrokes: false,
		color: d3.scale.ordinal()
			.range(["#F58220", "#EDC951", "#CC333F", "#00A0B0", "#FFFFFF"])//,
		//legend: { title: 'Legend', translateX: 140, translateY: 0 }
	};


	/////////////////////////////////////////////////////////
	/////////////// The Radar Chart Function ////////////////
	/// mthh - 2017 /////////////////////////////////////////
	// Inspired by the code of alangrafu and Nadieh Bremer //
	// (VisualCinnamon.com) and modified for d3 v4 //////////
	/////////////////////////////////////////////////////////


	sin = Math.sin;
	cos = Math.cos;
	HALF_PI = Math.PI / 2;

	function RadarChart(parent_selector, options, countryList, pillar) {

		data = []
		for (i = 0; i < countryList.length; i++) {
			console.log(countryList[i])
			console.log(allKeyData[countryList[i]])

			////need to convert countryList[i] to code

			data.push({ name: countryList[i], axes: allKeyData[countryList[i]][pillar] })
		}
		//data=[{name:"Barbados",axes:data["Barbados"]},{name:"Cuba",axes:data["Cuba"]},{name:"Guinea-Bissau",axes:data["Guinea-Bissau"]}]

		const wrap = (text, width) => {
			text.each(function () {
				var text = d3.select(this),
					words = text.text().split(/\s+/).reverse(),
					word,
					line = [],
					lineNumber = 0,
					lineHeight = 1.4, // ems
					y = text.attr("y"),
					x = text.attr("x"),
					dy = parseFloat(text.attr("dy")),
					tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

				while (word = words.pop()) {
					line.push(word);
					tspan.text(line.join(" "));
					if (tspan.node().getComputedTextLength() > width) {
						line.pop();
						tspan.text(line.join(" "));
						line = [word];
						tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
					}
				}
			});
		}//wrap

		const cfg = {
			w: 500,				//Width of the circle
			h: 500,				//Height of the circle
			margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
			levels: 3,				//How many levels or inner circles should there be drawn
			maxValue: 0, 			//What is the value that the biggest circle will represent
			labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
			wrapWidth: 80, 		//The number of pixels after which a label needs to be given a new line
			opacityArea: 0.35, 	//The opacity of the area of the blob
			dotRadius: 4, 			//The size of the colored circles of each blog
			opacityCircles: 0.1, 	//The opacity of the circles of each blob
			strokeWidth: 2, 		//The width of the stroke around each blob
			roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
			color: d3.scale.ordinal(d3.schemeCategory10),	//Color function,
			format: '.2%',
			unit: '',
			legend: false,
			spin: 0
		};

		//Put all of the options into a variable called cfg
		if ('undefined' !== typeof options) {
			for (var i in options) {
				if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
			}//for i
		}//if

		//If the supplied maxValue is smaller than the actual one, replace by the max in the data
		// var maxValue = max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		let maxValue = 0;
		for (let j = 0; j < data.length; j++) {
			for (let i = 0; i < data[j].axes.length; i++) {
				data[j].axes[i]['id'] = data[j].name;
				if (data[j].axes[i]['value'] > maxValue) {
					maxValue = data[j].axes[i]['value'];
				}
			}
		}
		maxValue = Math.max(cfg.maxValue, maxValue);

		const allAxis = data[0].axes.map((i, j) => i.axis),	//Names of each axis
			total = allAxis.length,					//The number of different axes
			radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
			Format = d3.format(cfg.format),			 	//Formatting
			angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

		//Scale for the radius
		const rScale = d3.scale.linear()
			.range([0, radius])
			.domain([0, maxValue]);

		/////////////////////////////////////////////////////////
		//////////// Create the container SVG and g /////////////
		/////////////////////////////////////////////////////////
		const parent = d3.select(parent_selector);

		//Remove whatever chart with the same id/class was present before
		parent.select("svg").remove();

		//Initiate the radar chart SVG
		let svg = parent.append("svg")
			.attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar")
			.attr("display", "inline-block")
			.attr("margin", "auto");

		//Append a g element
		let g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

		/////////////////////////////////////////////////////////
		////////// Glow filter for some extra pizzazz ///////////
		/////////////////////////////////////////////////////////

		//Filter for the outside glow
		let filter = g.append('defs').append('filter').attr('id', 'glow'),
			feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
			feMerge = filter.append('feMerge'),
			feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
			feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

		/////////////////////////////////////////////////////////
		/////////////// Draw the Circular grid //////////////////
		/////////////////////////////////////////////////////////

		//Wrapper for the grid & axes
		let axisGrid = g.append("g").attr("class", "axisWrapper");

		//Draw the background circles
		axisGrid.selectAll(".levels")
			.data(d3.range(1, (cfg.levels + 1)).reverse())
			.enter()
			.append("circle")
			.attr("class", "gridCircle")
			.attr("r", d => radius / cfg.levels * d)
			.style("fill", "#CDCDCD")
			.style("stroke", "#CDCDCD")
			.style("fill-opacity", cfg.opacityCircles)
			.style("filter", "url(#glow)");

		//Text indicating at what % each level is
		axisGrid.selectAll(".axisLabel")
			.data(d3.range(1, (cfg.levels + 1)).reverse())
			.enter().append("text")
			.attr("class", "axisLabel")
			.attr("x", 4)
			.attr("y", d => -d * radius / cfg.levels)
			.attr("dy", "0.4em")
			.style("font-size", "10px")
			.attr("fill", "#737373")
			.text(d => Format(maxValue * d / cfg.levels) + cfg.unit);

		/////////////////////////////////////////////////////////
		//////////////////// Draw the axes //////////////////////
		/////////////////////////////////////////////////////////

		//Create the straight lines radiating outward from the center
		var axis = axisGrid.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");
		//Append the lines
		axis.append("line")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", (d, i) => rScale(maxValue * 1.1) * cos(angleSlice * i - HALF_PI - cfg.spin))
			.attr("y2", (d, i) => rScale(maxValue * 1.1) * sin(angleSlice * i - HALF_PI - cfg.spin))
			.attr("class", "line")
			.style("stroke", "white")
			.style("stroke-width", "2px");

		//Append the labels at each axis
		axis.append("text")
			.attr("class", "legend")
			.style("font-size", "10px")
			.attr("text-anchor", "middle")
			.attr("dy", "0.35em")
			.attr("x", (d, i) => rScale(maxValue * cfg.labelFactor) * cos(angleSlice * i - HALF_PI - cfg.spin))
			.attr("y", (d, i) => -15 + rScale(maxValue * cfg.labelFactor) * sin(angleSlice * i - HALF_PI - cfg.spin))
			.text(d => d)
			.call(wrap, cfg.wrapWidth)
			.on('mouseover', function (d, i) {

				console.log(d)
				// tooltips[j].setAttribute('data-show', '');
				// popperInstance[j].update();
				// tooltip3
				// .attr("display","block")
				try{
				sourceLink=metadata[0][d].sourceLink}
				catch(error){sourceLink="Link"}
				try{
					sourceName=metadata[0][d].sourceName}
					catch(error){sourceName="Source"}

				document.getElementById('tooltipIndicatorContent').innerHTML = '<h4 style="color:#0DB14B">' + d + '</h4><h6>'+sourceName+'</h6><a href="'+sourceLink+'"><h6 style="color:blue">'+sourceLink+'</h6></a>'
				tooltip3.setAttribute('data-show', '');
				popperInstance[d].update();

			})
			.on('mouseout', function (d, i) {
				tooltip3.removeAttribute('data-show');
			})
			.on('click',function(d,i){
				window.open(metadata[0][d].sourceLink, '_blank');
				
			});

		const tooltip3 = $("#tooltipIndicator")[0]

		axis.selectAll("text").each(function (d, i) {
			//   console.log(d);
			//   console.log(this);

			popperInstance[d] = Popper.createPopper(this, tooltip3, {
				placement: 'top', modifiers: [
					{ name: 'offset', options: { offset: [0, 8], }, },],
			});

		});

		/////////////////////////////////////////////////////////
		///////////// Draw the radar chart blobs ////////////////
		/////////////////////////////////////////////////////////

		const radarLine = d3.radialLine()
			.curve(d3.curveLinearClosed)
			.radius(d => rScale(d.value))
			.angle((d, i) => i * angleSlice);

		//   if(cfg.roundStrokes) {
		// 	  radarLine.curve(d3.curveCardinalClosed)
		//   }

		//Create a wrapper for the blobs
		const blobWrapper = g.selectAll(".radarWrapper")
			.data(data)
			.enter().append("g")
			.attr("class", "radarWrapper");

		//Append the backgrounds
		blobWrapper
			.append("path")
			.attr("class", "radarArea")
			.attr("d", d => radarLine(d.axes))
			.style("fill", (d, i) => cfg.color(i))
			.style("fill-opacity", cfg.opacityArea)
			.on('mouseover', function (d, i) {
				//Dim all blobs
				parent.selectAll(".radarArea")
					.transition().duration(200)
					.style("fill-opacity", 0.1);
				//Bring back the hovered over blob
				d3.select(this)
					.transition().duration(200)
					.style("fill-opacity", 0.7);

				//tooltip with name of country
				tooltip2
					.attr('x', 0)
					.attr('y', 0)
					.transition()
					.style('display', 'block')
					.text(allKeyData[d.name]["Profile"].Country);
			})
			.on('mouseout', () => {
				//Bring back all blobs
				parent.selectAll(".radarArea")
					.transition().duration(200)
					.style("fill-opacity", cfg.opacityArea);
				tooltip2.transition()
					.style('display', 'none').text('');
			});


		const tooltip2 = g.append("text")
			//.attr("class", "tooltip")
			.attr('x', 0)
			.attr('y', 0)
			.attr("class", "spiderTooltip")
			.style("font-size", "12px")
			.style("font-weight", "bold")
			.style('display', 'none')
			.attr("text-anchor", "middle")
			.attr("z-index", 100)
			.attr("dy", "0.35em");






		//Create the outlines
		blobWrapper.append("path")
			.attr("class", "radarStroke")
			.attr("d", function (d, i) { return radarLine(d.axes); })
			.style("stroke-width", cfg.strokeWidth + "px")
			.style("stroke", (d, i) => cfg.color(i))
			.style("fill", "none")
			.style("filter", "url(#glow)");

		//Append the circles
		blobWrapper.selectAll(".radarCircle")
			.data(d => d.axes)
			.enter()
			.append("circle")
			.attr("class", "radarCircle")
			.attr("r", cfg.dotRadius)
			.attr("cx", (d, i) => rScale(d.value) * cos(angleSlice * i - HALF_PI - cfg.spin))
			.attr("cy", (d, i) => rScale(d.value) * sin(angleSlice * i - HALF_PI - cfg.spin))
			.style("fill", "#ffffff")//(d) => cfg.color(d.id))
			.style("fill-opacity", 0.8);

		/////////////////////////////////////////////////////////
		//////// Append invisible circles for tooltip ///////////
		/////////////////////////////////////////////////////////

		//Wrapper for the invisible circles on top
		const blobCircleWrapper = g.selectAll(".radarCircleWrapper")
			.data(data)
			.enter().append("g")
			.attr("class", "radarCircleWrapper");

		//Append a set of invisible circles on top for the mouseover pop-up
		blobCircleWrapper.selectAll(".radarInvisibleCircle")
			.data(d => d.axes)
			.enter().append("circle")
			.attr("class", "radarInvisibleCircle")
			.attr("r", cfg.dotRadius * 1.5)
			.attr("cx", (d, i) => rScale(d.value) * cos(angleSlice * i - HALF_PI - cfg.spin))
			.attr("cy", (d, i) => rScale(d.value) * sin(angleSlice * i - HALF_PI - cfg.spin))
			.style("fill", "none")
			.style("pointer-events", "all")
			.on("mouseover", function (d, i) {
				tooltip
					.attr('x', this.cx.baseVal.value)
					.attr('y', this.cy.baseVal.value - 10)
					.transition()
					.style('display', 'block')
					.text(Format(d.value) + cfg.unit);
			})
			.on("mouseout", function () {
				tooltip.transition()
					.style('display', 'none').text('');
			});

		const tooltip = g.append("text")
			.attr('x', 0)
			.attr('y', 0)
			.attr("class", "spiderTooltip")
			.style("font-size", "12px")
			.style('display', 'none')
			.attr("text-anchor", "middle")
			.attr("dy", "0.35em")

		//Remove whatever chart with the same id/class was present before
		d3.select("#spiderLegend").select("svg").remove();

		//Initiate the radar chart SVG
		let svgLegend = d3.select("#spiderLegend").append("svg")
			.attr("width", "100%")
			.attr("height", 40)

		if (cfg.legend !== false && typeof cfg.legend === "object") {
			console.log("legended")
			let legendZone = svgLegend;//.append('g');
			let names = data.map(el => el.name);
			if (cfg.legend.title) {
				let title = legendZone.append("text")
					.attr("class", "title")
					.attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY})`)
					.attr("x", 70)
					.attr("y", 10)
					.attr("font-size", "10px")
					.attr("fill", "#404040")
					.text(cfg.legend.title);
			}
			let legend = legendZone.append("g")
				//.attr("class", "legend")
				.attr("height", 40)
				.attr("width", "100%")
				.attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY})`)
				.style("background-color", "red");
			// Create rectangles markers
			legend.selectAll('rect')
				.data(names)
				.enter()
				.append("rect")
				.attr("x", 20)
				.attr("y", 5)
				.attr("width", 10)
				.attr("height", 10)
				.style("fill", (d, i) => cfg.color(i));
			// Create labels
			legend.selectAll('text')
				.data(names)
				.enter()
				.append("text")
				.attr("x", cfg.w - 52)
				.attr("y", (d, i) => i * 20 + 9)
				.attr("font-size", "9px")
				.attr("fill", "#737373")
				.text(d => allKeyData[d]["Profile"].Country);
		}
		return svg;
	}

	///options and values for all regions -> countries

	var all = "<option value='anguilla'>Anguilla</option>\
<option value='antiguaAndBarbuda'>Antigua and Barbuda</option>\
<option value='aruba'>Aruba</option>\
<option value='bahamas'>Bahamas</option>\
<option value='bahrain'>Bahrain</option>\
<option value='barbados'>Barbados</option>\
<option value='belize'>Belize</option>\
<option value='bermuda'>Bermuda</option>\
<option value='caboVerde'>Cabo Verde</option>\
<option value='caymanIslands'>Cayman Islands</option>\
<option value='comoros'>Comoros</option>\
<option value='cookIslands'>Cook Islands</option>\
<option value='cuba'>Cuba</option>\
<option value='curacao'>Curaçao</option>\
<option value='dominica'>Dominica</option>\
<option value='dominicanRepublic'>Dominican Republic</option>\
<option value='micronesia'>Micronesia</option>\
<option value='fiji'>Fiji</option>\
<option value='grenada'>Grenada</option>\
<option value='guineaBissau'>Guinea-Bissau</option>\
<option value='guyana'>Guyana</option>\
<option value='haiti'>Haiti</option>\
<option value='jamaica'>Jamaica</option>\
<option value='kiribati'>Kiribati</option>\
<option value='maldives'>Maldives</option>\
<option value='mauritius'>Mauritius</option>\
<option value='montserrat'>Montserrat</option>\
<option value='nauru'>Nauru</option>\
<option value='niue'>Niue</option>\
<option value='palau'>Palau</option>\
<option value='papuaNewGuinea'>Papua New Guinea</option>\
<option value='marshallIslands'>Marshall Islands</option>\
<option value='saintLucia'>Saint Lucia</option>\
<option value='samoa'>Samoa</option>\
<option value='saoTomeAndPrincipe'>Sao Tome and Principe</option>\
<option value='seychelles'>Seychelles</option>\
<option value='singapore'>Singapore</option>\
<option value='sintMaarten'>Sint Maarten</option>\
<option value='solomonIslands'>Solomon Islands</option>\
<option value='kittsAndNevis'>St. Kitts and Nevis</option>\
<option value='stVincent'>St. Vincent and the Grenadines</option>\
<option value='suriname'>Suriname</option>\
<option value='britishVirginIslands'>The British Virgin Islands</option>\
<option value='timorLeste'>Timor Leste</option>\
<option value='tokelau'>Tokelau</option>\
<option value='tonga'>Tonga</option>\
<option value='trinidadAndTobago'>Trinidad and Tobago</option>\
<option value='turksAndCaicos'>Turks and Caicos</option>\
<option value='tuvalu'>Tuvalu</option>\
<option value='vanuatu'>Vanuatu</option>"

	var caribbean = "<option value='anguilla'>Anguilla</option>\
<option value='antiguaBarbuda'>Antigua and Barbuda</option>\
<option value='bahamas'>Bahamas</option>\
<option value='barbados'>Barbados</option>\
<option value='belize'>Belize</option>\
<option value='bermuda'>Bermuda</option>\
<option value='caymanIslands'>Cayman Islands</option>\
<option value='cuba'>Cuba</option>\
<option value='curacao'>Curaçao</option>\
<option value='dominica'>Dominica</option>\
<option value='dominicanRepublic'>Dominican Republic</option>\
<option value='grenada'>Grenada</option>\
<option value='guyana'>Guyana</option>\
<option value='haiti'>Haiti</option>\
<option value='belize'>Jamaica</option>\
<option value='montserrat'>Montserrat</option>\
<option value='saintLucia'>Saint Lucia</option>\
<option value='sintMaarten'>Sint Maarten</option>\
<option value='kittsAndNevis'>St. Kitts and Nevis</option>\
<option value='stVincent'>St. Vincent and the Grenadines</option>\
<option value='suriname'>Suriname</option>\
<option value='britishVirgin'>The British Virgin Islands</option>\
<option value='trinidadAndTobago'>Trinidad and Tobago</option>\
<option value='turksAndCaicos'>Turks and Caicos</option>"

	var ais = "<option value='bahrain'>Bahrain</option>\
<option value='caboVerde'>Cabo Verde</option>\
<option value='comoros'>Comoros</option>\
<option value='guineaBissau'>Guinea-Bissau</option>\
<option value='maldives'>Maldives</option>\
<option value='mauritius'>Mauritius</option>\
<option value='saoTomeAndPrincipe'>Sao Tome and Principe</option>\
<option value='seychelles'>Seychelles</option>\
<option value='singapore'>Singapore</option>"

	var pacific = "<option value='aruba'>Aruba</option>\
<option value='cookIslands'>Cook Islands</option>\
<option value='micronesia'>Micronesia</option>\
<option value='fiji'>Fiji</option>\
<option value='kiribati'>Kiribati</option>\
<option value='nauru'>Nauru</option>\
<option value='nieu'>Nieu</option>\
<option value='palau'>Palau</option>\
<option value='papua'>Papua New Guinea</option>\
<option value='marshallIslands'>Marshall Islands</option>\
<option value='samoa'>Samoa</option>\
<option value='solomonIslands'>Solomon Islands</option>\
<option value='timorLeste'>Timor Leste</option>\
<option value='tokelau'>Tokelau</option>\
<option value='tonga'>Tonga</option>\
<option value='tuvalu'>Tuvalu</option>\
<option value='vanuatu'>Vanuatu</option>"

	var all2 = '<option value="">Overlay countries and regions</option>\
<option value="caribbeanAverage">Caribbean Average</option>\
<option value="aisAverage">AIS Average</option>\
<option value="pacificAverage">Pacific Average</option>'+ all
	var caribbean2 = '<option value="">Overlay countries and regions</option>\
<option value="caribbean">Caribbean Average</option>'+ caribbean
	var ais2 = '<option value="">Overlay countries and regions</option>\
 <option value="caribbean">AIS Average</option>'+ ais
	var pacific2 = '<option value="">Overlay countries and regions</option>\
 <option value="caribbean">Pacific Average</option>'+ pacific

	function setSelectedId(s, v) {

		for (var i = 0; i < s.options.length; i++) {
			//console.log(s.options[i].value,v)
			if (s.options[i].value == v) {
				//console.log("here")
				s.options[i].selected = true;

				return;

			}

		}

	}

	$("#countryCategory").change(function () {
		oldCountry = document.getElementById("countrySelect").value;
		let val = $(this).val();
		if (val == "all") {
			$("#countrySelect").html(all);
			$("#multiCountrySelect").html(all2);
		} else if (val == "caribbean") {
			$("#countrySelect").html(caribbean);
			$("#multiCountrySelect").html(caribbean2);

		} else if (val == "ais") {
			$("#countrySelect").html(ais);
			$("#multiCountrySelect").html(ais2);
		}
		else if (val == "pacific") {
			$("#countrySelect").html(pacific);
			$("#multiCountrySelect").html(pacific2);
		}

		var optionValues = [];

		$('#multiCountrySelect option').each(function () {
			optionValues.push($(this).val());
		});
		console.log(optionValues);
		console.log(oldCountry)
		console.log(optionValues.indexOf(oldCountry))
		if (optionValues.indexOf(oldCountry) >= 0) {
			//setTimeout here is a temporary fix so the initial selection waits until options are populated
			setTimeout(function () {
				setSelectedId(document.getElementById('countrySelect'), oldCountry);
			}, .01);
		}
		else {
			compileCountryData();
		}
	});


	////initilalize countryView

	$("#countrySelect").html(all);
	$("#multiCountrySelect").html(all2);

	//set option
	//automatically generate content



	///Country profile multiselect

	$('.label.countryMultiSelect.dropdown')
		.dropdown();


	$('.label.countryMultiSelect.dropdown').dropdown({
		onChange: function () {

			countryCode = document.getElementById("countrySelect").value;

			countryList = [countryCode].concat($(".label.countryMultiSelect.dropdown").dropdown("get value"));


			svg_radar1 = RadarChart("#climateSpider", radarChartOptionsClimate, countryList, "Climate");

			svg_radar2 = RadarChart("#blueSpider", radarChartOptionsBlue, countryList, "Blue");

			svg_radar3 = RadarChart("#digitalSpider", radarChartOptionsDigital, countryList, "Digital");

		}
	});

	$('.no.label.countryMultiSelect.dropdown')
		.dropdown({
			useLabels: false
		});

	$('.countryMultiSelect.button').on('click', function () {
		$('.countryMultiSelect.dropdown')
			.dropdown('restore defaults')
	})


	//if click on country view tab


	$("#countryViewTab").click(function () {
		setTimeout(() => {
			compileCountryData();
		}, 1);
	});


	setSelectedId(document.getElementById('countrySelect'), "dominicanRepublic")

}



