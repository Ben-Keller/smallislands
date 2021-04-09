///initializations
const mw = '800';
const mh = '580';
var main_chart_svg = d3.select("#choro_map_container").append("svg")
  .attr('width', mw)
  .attr('height', mh)//'800'//'auto'
var choro_legend_svg = d3.select("#choro_legend_container");
choro_legend_svg.append("svg")
  .attr("width", mw)
  .attr("height", 60)
var hues = ["b", "b", "b",]
//var hue = "g";	/* b=blue, g=green, r=red colours - from ColorBrewer */
var rateById = d3.map();
var lastActiveCountry = "";
var ireland;
var data;
var defaultScale = 0.75;	/* default scale of map - fits nicely on standard screen */
var scale = 3;		/* maximum size to zoom county */
var quantize = d3.scale.quantize()
var countryJson = []
var choroInit = 0;


function drawRegionLegend() {
  ///draw region legend
  console.log("region legend drawn")
}

function initChoropleth(countryProf, xml, wdi) {

  countryJson = countryProf

  console.log(wdi)


  console.log("countryJson", countryJson)

  //console.log(rateById)


  main_chart_svg.append('line')
    .style("stroke", "gray").style("stroke-width", 1).attr("x1", 80).attr("y1", 275).attr("x2", 740).attr("y2", 275);

  main_chart_svg
  main_chart_svg.append('line')
    .style("stroke", "gray").style("stroke-width", 1).attr("x1",80).attr("y1", 376).attr("x2", 740).attr("y2", 376);

  main_chart_svg
    .append('text').attr("x",800).attr("y", 480).text("Pacific").style("fill", "#" + regionColors("Pacific", "Y").substring(1)).style("font-size", "18px").style("font-weight", 1000);
  main_chart_svg
    .append('text').attr("x", 785).attr("y", 140).text("Caribbean").style("font-size", "18px").style("font-weight", 1000).style("fill", "#" + regionColors("Caribbean", "Y").substring(1));
  main_chart_svg
    .append('text').attr("x", 810).attr("y", 340).text("AIS").style("fill", "#" + regionColors("AIS", "Y").substring(1)).style("font-size", "18px").style("font-weight", 1000);


  // var countyTable = tabulate(data, ["county", "rental"]);		/* render the data table */

  var svgMap = xml.getElementsByTagName("g")[0];			/* set svgMap to root g */
  //console.log(svgMap)
  ireland = d3.select("#choro_map_container").selectAll("*").node().appendChild(svgMap);		/* island of Ireland map */






  d3.select(ireland).selectAll("path")
    .on("mouseover", function (d) {

      scale = 2;

      var bBox = this.getBBox();
      cx = bBox.x - bBox.width / 2;
      cy = bBox.y - bBox.height / 2;

      //console.log(bBox,cx,cy)
      //d3.select(this).attr( "transform", "scale("+scale+","+scale+") translate("+(bBox.x-cx*(scale))+","+(bBox.y-cy*(scale))+") ");    
      if (d3.select(this).classed("countryActive")) return;		/* no need to change class when county is already selected */
      d3.select(this).attr("class", "countryHover");
    })
    .on("mouseout", function (d) {
      if (d3.select(this).classed("countryActive")) return;
      d3.select(this).attr("class", function (da) {

        
        console.log("da",da);
        console.log(this); 			/* reset county color to quantize range */
        console.log(this.id)
        console.log(countryJson)
        return (regionColors(countryJson[this.id].Region, countryJson[this.id]["Member State (Y/N)"]) + " shadow");
      });
    })
    .on("click", function (d) {
      zoomed(d3.select(this),this.id,countryJson[this.id].Region);
      //d3.select(this).style("fill", "blue");
    });

  /* Let's add an id to each group that wraps a path */
  d3.select(ireland).selectAll("path")
    .each(function (d) {
      d3.select(this.parentNode).attr("id", this.id);
    });

    setTimeout(function(){/* Now add a text box to the group with content equal to the id of the group */
  d3.select('#allSids').selectAll("g")
    .append("svg:text")
    .text(function (d) {
      try {
        return countryJson[this.parentNode.id].Country;
      }
      catch {
        return this.parentNode.id;
      }
    })
    .attr("x", function (d) {
      //	console.log(d3.select(this.parentNode).select("path").attr("d"));
      //return 600;
      //d3.select(ireland).select("path")                
      return getBoundingBox(d3.select(this.parentNode).select("path"))[4];
    })
    .attr("y", function (d) {
      return (getBoundingBox(d3.select(this.parentNode).select("path"))[2] - 11);
    })
    .classed("choroText", true)
  },100);

  initTooltips();

  d3.select(ireland).selectAll("path")		/* Map Republic counties to rental data */
    .attr("class", function (d) {
      //console.log(this.id)

      return (regionColors(countryJson[this.id].Region, countryJson[this.id]["Member State (Y/N)"]) + " shadow");
    });


  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  function updateChoropleth(indicator) {

    hueNum = getRandomInt(0, 3)

    //selectedYear=$("yearSelect").val()
    selectedYear = "2016"

    console.log(selectedYear)
    console.log(indicator)
    console.log(wdi[indicator])

    data = wdi[indicator]["data"]//[selectedYear]

    console.log(data)

    // d3.map(data, function (d) { "jajaja",console.log(d);
    //     rateById.set(d.CountryCode, +d[indicator]) });	/* create the data map */

    /* break the data values into 9 ranges of €100 each   */
    /* max and min values already known so 400-1300 works */

    max = Math.max(...Object.values(data).filter(function (el) {
      return !isNaN(parseFloat(el)) && isFinite(el);
    }))
    min = Math.min(...Object.values(data).filter(function (el) {
      return !isNaN(parseFloat(el)) && isFinite(el);
    }))
    // max=

    quantize = d3.scale.quantize()
      .domain([min, max])
      .range(d3.range(9).map(function (i) { return hues[hueNum] + i + "-9"; }));

      d3.select(ireland).selectAll("path").on("mouseout", function (d) {
      if (d3.select(this).classed("countryActive")) return;
      d3.select(this).attr("class", function (da) { 			/* reset county color to quantize range */
        stat = data[countryJson[this.id].Country]
        if(typeof stat=="undefined" || stat=="No Data"){
          //hide country name


          return "nodata"
        }
        else{
          //show country name
          return (quantize(stat) + " shadow");}

        
      });     
    })



    d3.select("#choro_map_container").selectAll("path")		/* Map Republic counties to rental data */
      .attr("class", function (d) {
        stat = data[countryJson[this.id].Country];
       // console.log(stat)
        if(typeof stat=="undefined" || stat=="No Data"){
          //hide country name


          return "nodata"
        }
        else{
          //show country name
          return (quantize(stat) + " shadow");}

        
      });

  }



  Promise.all([
    d3.json("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/exports/wdiMeta2.json")

  ]).then(function (files) {
    initIndicatorOptions(files[0])
    //updateIndicatorOptions("Environment");


  }).catch(function (err) {
    // handle error here
  })




  function initIndicatorOptions(wdiMeta) {

    console.log(wdiMeta)

    function updateIndicatorOptions(category) {

      ///iterate through all 1440 options and filter by those in category

      console.log(category)

      options = []

      var ul = document.getElementById("listBoox");
      ul.innerHTML = '';
      newHTML = ''

      for (indicator in wdiMeta) {
        if (wdiMeta[indicator].Topic == category) {
          newHTML = newHTML + "<li id=" + wdiMeta[indicator]["Series Code"] + ">" + wdiMeta[indicator]["Indicator Name"] + "</li>"
        }
      }
      ul.innerHTML = newHTML


      $('.listbox li').click(function (e) {
        e.preventDefault();
        $(this).parent().find('li').removeClass('indiActive');
        $(this).addClass('indiActive');
        console.log(wdiMeta[this.id])

        updateChoropleth(this.id);

        updateTooltips(this.id);

        

        $("#choroIndiText").text(wdiMeta[this.id]["Long definition"])


        if (choroInit == 0) {
          initChoroLegend(wdiMeta);
        }

        else { updateChoroLegend(wdiMeta); }

      });

    }


    $("#indicatorCategorySelect").change(function () {
      category = $(this).val()
      updateIndicatorOptions(category);

      console.log($("#listBoox"))


    });

    updateIndicatorOptions("Environment")


  }




  function updateTooltips(indicator) {

    const countryMaps = $("#allSids path")

    //console.log(countryMaps)
    countryMaps.each(function (index) {

      try {
        tooltipTitle = countryJson[countryMaps[index].id].Country
      }
      catch { tooltipTitle = countryMaps[index].id }
      // console.log(tooltipTitle)
      // console.log(wdi[indicator]["year"])
      try {
        secondLine = wdi[indicator]["data"][tooltipTitle].toFixed(2)
      }
      catch (error) { secondLine = "No Data" }
      thirdLine = wdi[indicator]["year"][tooltipTitle]

      // console.log(wdi[indicator]["def"])
      // console.log(wdi[indicator]["year"])


      //create tooltip
      // <div id="tooltip1" class="tooltips" role="tooltip"></div>
      //<div class="arrow" data-popper-arrow></div>
      $('#tooltipChoro' + (index).toString()).html('<h4 style="color:#0DB14B">' + tooltipTitle + '</h4><h6>' + secondLine + '</h6><h6>' + thirdLine + '</h6><div class="arrow" data-popper-arrow></div></div>')
      // console.log(index+": yo");
    });

    // console.log($('#tooltips'))

    // const tooltips = $(".tooltips")
    //   .each(function (index) {
    //     //console.log(index+": tt");
    //   });

  }



}




function regionColors(region, member) {
  if (member == "N") { return "black" }
  else if (region == "Caribbean") { return "c008080"; }
  else if (region == "Pacific") { return "cF0A500"; }
  else if (region == "AIS") { return "c97002B"; }
  else { return "black" }
}

function initChoroLegend(wdiMeta) {

  $("#regionLegend").remove()

  console.log("init legend")

  var choroLegend = d3.select("#choro_legend_container").selectAll('*').selectAll('g.choroLegendEntry')
    .data(quantize.range())
    .enter()
    .append('g').attr('class', 'choroLegendEntry');

  choroLegend
    .append('rect')
    .attr("x", function (d, i) {
      return i * -70 + 620;
    })
    .attr("y", 35)
    .attr("width", 70)
    .attr("height", 12)
    .attr("class", function (d) { return d; })
    .on("click", function (d) {
      if (lastActiveCountry == "") {
        resetAll();
        d3.select(ireland).selectAll("." + d).attr("class", "countryHighlight");		/* Highlight all counties in range selected */
      }
    });

  choroLegend
    .append('text').attr("class", "textNum")
    .attr("x", function (d, i) {
      return i * -70 + 610;
    }) //leave 5 pixel space after the <rect>
    .attr("y", 30)
    .text(function (d, i) {
      var extent = quantize.invertExtent(d);
      //extent will be a two-element array, format it however you want:
      //return format(extent[0]) + " - " + format(+extent[1])
      return (nFormatter(extent[1], 2))//.toFixed(2))//extent[0].toFixed(2) + " - " + 
    })
    .style("font-size", "12px");

//  choroLegend.append('text').attr("x", 680).attr("y", 30).text("0.0").style("font-size", "12px");

  choroInit = 1;



  choroLegend
    .append('text').attr("class", "choroLegendTitle")
    .attr("x", 360)
    .attr("y", 14).attr("text-anchor", "middle")
    .text(function (d, i) {
      //extent will be a two-element array, format it however you want:
      //return format(extent[0]) + " - " + format(+extent[1])
      indi = $(".indiActive")[0].id
      return wdiMeta[indi]["Indicator Name"]//["name"];//.toFixed(2))//extent[0].toFixed(2) + " - " + 
    })
    .style("font-size", "14px")
    .style("font-weight", "500");

}

function updateChoroLegend(wdiMeta) {
  console.log("updating legend")

  // hueNum=2

  //     quantize = d3.scale.quantize()
  //     .domain([min,max])
  //     .range(d3.range(9).map(function (i) { return hues[hueNum] + i + "-9"; }));

  var choroLegend = d3.select("#choro_legend_container").selectAll('g.choroLegendEntry')
    .data(quantize.range())

  choroLegend.selectAll(".choroLegendTitle")
    .text(function (d, i) {
      //extent will be a two-element array, format it however you want:
      //return format(extent[0]) + " - " + format(+extent[1])
      indi = $(".indiActive")[0].id
      return wdiMeta[indi]["Indicator Name"]//["name"];//.toFixed(2))//extent[0].toFixed(2) + " - " + 
    })

  choroLegend
    .selectAll('rect')
    .attr("class", function (d) {
      console.log(d);
      return d;
    });

  choroLegend
    .selectAll('.textNum')
    .text(function (d, i) {
      var extent = quantize.invertExtent(d);
      //extent will be a two-element array, format it however you want:
      return (nFormatter(extent[1], 2))//extent[0].toFixed(2) + " - " + 
    })

 // choroLegend.append('text').attr("x", 750).attr("y", 30).text("0.0").style("font-size", "12px");

  //update legend numbers
  // update Title Above Legend

  //update quantized scale
}

function initTooltips() {
  const countryMaps = $("#allSids path")

  countryMaps.each(function (index) {
    //console.log(countryJson[countryMaps[index].id].Country)
    try {

      tooltipTitle = countryJson[countryMaps[index].id].Country;
      secondLine = countryJson[countryMaps[index].id].Region + " region";
      thirdLine = "Population: " + countryJson[countryMaps[index].id].Population.toString();
    }
    catch {
      tooltipTitle = countryMaps[index].id;
      secondLine = "No data"
      thirdLine = ""
    }


    //create tooltip
    // <div id="tooltip1" class="tooltips" role="tooltip"></div>
    //<div class="arrow" data-popper-arrow></div>
    $('#choroTooltips').append('<div class="choroTooltip tooltips" id="tooltipChoro' + (index).toString() + '" role="tooltip"><h4 style="color:#0DB14B">' + tooltipTitle + '</h4><h6 id="tooltipStat">' + secondLine + '</h6><h6>' + thirdLine + '</h6><div class="arrow" data-popper-arrow></div></div>')
    // console.log(index+": yo");
  });

  console.log($('.choroTooltip'))

  const choroTooltips = $(".choroTooltip")
    .each(function (index) {
      //console.log(index+": tt");
    });

  //console.log(tooltips)

  popperInstance = new Array();

  for (i = 0; i < countryMaps.length; i++) {
    popperInstance[i] = Popper.createPopper(countryMaps[i], choroTooltips[i],
      {
        placement: 'top',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },],
      });
  }

  function hide() {
    //map to all
    for (j = 0; j < countryMaps.length; j++) {
      choroTooltips[j].removeAttribute('data-show');
    }
  }

  //console.log(tooltips.length, countryMaps.length, popperInstance.length);

  const showEvents = ['mouseenter', 'focus'];
  const hideEvents = ['mouseleave', 'blur'];

  showEvents.forEach(event => {
    for (j = 0; j < countryMaps.length; j++) {
      // console.log(j,countryMaps[j])
      countryMaps[j].addEventListener(event, hovered.bind(null, j));
    }
  });

  function hovered(j) {
    // console.log("i",j)
    choroTooltips[j].setAttribute('data-show', '');
    popperInstance[j].update();
  }

  hideEvents.forEach(event => {
    //map to all?
    for (j = 0; j < countryMaps.length; j++) {
      //    console.log("i",j)
      countryMaps[j].addEventListener(event, hide);
    }
  });

  /////end tooltips

}



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



function zoomed(d,country) {
  console.log("zooming")

  /* Thanks to http://complextosimple.blogspot.ie/2012/10/zoom-and-center-with-d3.html 	*/
  /* for a simple explanation of transform scale and translation  			*/
  /* This function centers the county's bounding box in the map container		*/
  /* The scale is set to the minimum value that enables the county to fit in the	*/
  /* container, horizontally or vertically, up to a maximum value of 3.			*/
  /* If the full width of container is not required, the county is horizontally centred */
  /* Likewise, if the full height of the container is not required, the county is	*/
  /* vertically centred.								*/

  var xy = getBoundingBox(d);	/* get top left co-ordinates and width and height 	*/
  if (d.classed("countryActive")) {	/* if county is active reset map scale and county colour */

    ///open country profile page to that country

    main_chart_svg.selectAll("#viewport")
    .transition().duration(750).attr("transform", "scale(" + defaultScale + ")");
    lastActive = "";

    console.log(country)

 d.attr("class", function (d) {
      return quantize(rateById.get(this.id))
    });

    setSelectedId(document.getElementById('countryCategory'),"all")
    setSelectedId(document.getElementById('countrySelect'), country)


   $(".mdl-tabs__tab").removeClass("is-active")
   $("#countryViewTab").addClass("is-active")

    $("#countryViewTab h5").click()


   
    



  } else {			/* zoom into new county      */
    // console.log("huh")
    // resetAll();			/* reset county colors	     */

    /* scale is the max number of times bounding box will fit into container, capped at 3 times */
    scale = Math.min(mw / xy[1], mh / xy[3], 3);

    /* tx and ty are the translations of the x and y co-ordinates */
    /* the translation centers the bounding box in the container  */
    var tx = -xy[0] + (mw - xy[1] * scale) / (2 * scale);
    var ty = -xy[2] + (mh - xy[3] * scale) / (2 * scale);

    main_chart_svg.selectAll("#viewport")
      .transition().duration(750).attr("transform", "scale(" + scale + ")translate(" + tx + "," + ty + ")");
      d.node().classList.add("countryActive");
    console.log(d)
    lastActiveCountry = d.attr("id");
  }
}

function reset(selection) {
  /* resets the color of a single county */
  if (selection != "")
    d3.select(ireland).select("#" + selection).attr("class", function (d) {
      return quantize(rateById.get(this.id))
    });
}

// function resetAll() {
//   /* resets the color of all counties */
//   indi = $(".indiActive")[0].id
//   updateChoropleth(wdiMeta[indi]["Indicator Name"])
// }

function getBoundingBox(selection) {
  /* get x,y co-ordinates of top-left of bounding box and width and height */
  var element = selection.node(),
    bbox = element.getBBox();
  cx = bbox.x + bbox.width / 2;
  cy = bbox.y + bbox.height / 2;
  return [bbox.x, bbox.width, bbox.y, bbox.height, cx, cy];
}




Promise.all([
  d3.json("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/profileData.json"),
  d3.xml("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/maps/sidsSVG2.svg"),
  d3.json("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/exports/recentWdiSidsFull.json")
]).then(function (files) {
  console.log("done")
  //updateIndicatorOptions("Environment");

  initChoropleth(files[0], files[1], files[2])//,files[4]);

  drawRegionLegend();

}).catch(function (err) {
  // handle error here
})







categories = ["Environment", "Health", "Poverty", "Education", "Gender", "Social Protection & Labor",
  "Economic Policy & Debt", "Infrastructure", "Financial Sector", "Public Sector", "Private Sector & Trade"]

for (category in categories) {

  var x = document.getElementById("indicatorCategorySelect");
  var option = document.createElement("option");
  option.text = categories[category];
  x.add(option);

}








d3.select(self.frameElement).style("height", "650px");




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
