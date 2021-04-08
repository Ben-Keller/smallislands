///initializations
const mw = '800';
const mh = '540';
var main_chart_svg = d3.select("#map_container").append("svg")
  .attr('width', mw)
  .attr('height', mh)//'800'//'auto'
var legend_svg = d3.select("#legend_container");
legend_svg.append("svg")
  .attr("width", mw)
  .attr("height", 60)
var hues = ["b","b","b",]
//var hue = "g";	/* b=blue, g=green, r=red colours - from ColorBrewer */
var rateById = d3.map();
var lastActive = "";
var ireland;
var data;
var defaultScale = 0.78;	/* default scale of map - fits nicely on standard screen */
var scale = 3;		/* maximum size to zoom county */
var quantize = d3.scale.quantize()
var countryDict=[]
var choroInit=0;


function drawRegionLegend(){
    ///draw region legend
    console.log("region legend drawn")
}

function initChoropleth(countryProf,xml,wdi) {
  
    countryDict=countryProf

    console.log(wdi)


    console.log("CountryDict", countryDict)
  
    //console.log(rateById)


    main_chart_svg.append('line')
    .style("stroke", "gray") .style("stroke-width", 1).attr("x1", 60).attr("y1", 250).attr("x2", 680).attr("y2", 250);

    main_chart_svg
  main_chart_svg.append('line')
    .style("stroke", "gray").style("stroke-width", 1).attr("x1", 60).attr("y1", 345).attr("x2", 680).attr("y2", 345);

    main_chart_svg
    .append('text').attr("x", 730).attr("y",430).text("Pacific").style("fill","#"+regionColors("Pacific","Y").substring(1)).style("font-size", "18px").style("font-weight",1000);
  main_chart_svg
    .append('text').attr("x", 715).attr("y",120).text("Caribbean").style("font-size", "18px").style("font-weight",1000).style("fill","#"+regionColors("Caribbean","Y").substring(1));
  main_chart_svg
    .append('text').attr("x", 740).attr("y",300).text("AIS").style("fill","#"+regionColors("AIS","Y").substring(1)).style("font-size", "18px").style("font-weight",1000);
  
 
      // var countyTable = tabulate(data, ["county", "rental"]);		/* render the data table */
  
      var svgMap = xml.getElementsByTagName("g")[0];			/* set svgMap to root g */
      //console.log(svgMap)
      ireland = d3.select("#map_container").selectAll("*").node().appendChild(svgMap);		/* island of Ireland map */
  

      d3.select(ireland).selectAll("path")
        .on("mouseover", function (d) {
  
          scale = 2;
  
          var bBox = this.getBBox();
          cx = bBox.x - bBox.width / 2;
          cy = bBox.y - bBox.height / 2;
  
          //console.log(bBox,cx,cy)
          //d3.select(this).attr( "transform", "scale("+scale+","+scale+") translate("+(bBox.x-cx*(scale))+","+(bBox.y-cy*(scale))+") ");    
          if (d3.select(this).classed("active")) return;		/* no need to change class when county is already selected */
          d3.select(this).attr("class", "hover");
        })
        .on("mouseout", function (d) {
          if (d3.select(this).classed("active")) return;
          d3.select(this).attr("class", function (d) { 			/* reset county color to quantize range */
            
            ////need to change this to update to current quantize 
            
            return (quantize(rateById.get(this.id)) + " shadow")
          });
        })
        .on("click", function (d) {
          zoomed(d3.select(this));
          d3.select(this).style("fill", "blue");
        });
  
      /* Let's add an id to each group that wraps a path */
      d3.select(ireland).selectAll("path")
        .each(function (d) {
          d3.select(this.parentNode).attr("id", this.id);
        });
  
      /* Now add a text box to the group with content equal to the id of the group */
      d3.select('#allSids').selectAll("g")
        .append("svg:text")
        .text(function (d) {
          try {
            return countryDict[this.parentNode.id].Country;
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
        .classed("text", true)
  
        initTooltips();
    
    d3.select(ireland).selectAll("path")		/* Map Republic counties to rental data */
      .attr("class", function (d) {
        //console.log(this.id)

        return (regionColors(countryDict[this.id].Region,countryDict[this.id]["Member State (Y/N)"]) + " shadow");
      });

   
      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
      }
function updateChoropleth(indicator){

  hueNum=getRandomInt(0,3)

  //selectedYear=$("yearSelect").val()
selectedYear="2016"

  console.log(selectedYear)
  console.log(indicator)
    console.log(wdi[indicator])

    data=wdi[indicator]["data"]//[selectedYear]

    console.log(data)

// d3.map(data, function (d) { "jajaja",console.log(d);
//     rateById.set(d.CountryCode, +d[indicator]) });	/* create the data map */
  
/* break the data values into 9 ranges of €100 each   */
/* max and min values already known so 400-1300 works */

max=Math.max(...Object.values(data).filter(function(el) {
return !isNaN(parseFloat(el)) && isFinite(el);}))
min=Math.min(...Object.values(data).filter(function(el) {
  return !isNaN(parseFloat(el)) && isFinite(el);}))
// max=

quantize = d3.scale.quantize()
  .domain([min,max])
  .range(d3.range(9).map(function (i) { return hues[hueNum] + i + "-9"; }));

d3.select("#map_container").selectAll("path")		/* Map Republic counties to rental data */
.attr("class", function (d) {
      stat=data[countryDict[this.id].Country]
    return (quantize(stat) + " shadow");
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




function initIndicatorOptions(wdiMeta){

  console.log(wdiMeta)

function updateIndicatorOptions(category){
  ///iterate through all 1440 options and filter by those in category
console.log(category)

options=[]

var ul = document.getElementById("listBoox");
  ul.innerHTML = '';
  newHTML=''

for(indicator in wdiMeta){
    if(wdiMeta[indicator].Topic==category){
      newHTML=newHTML+"<li id="+wdiMeta[indicator]["Series Code"]+">"+wdiMeta[indicator]["Indicator Name"]+"</li>"
  }
}
  ul.innerHTML=newHTML


  $('.listbox li').click(function(e) {
		e.preventDefault();
		$(this).parent().find('li').removeClass('active');
		$(this).addClass('active');
    console.log(this.id)
    
    updateChoropleth(this.id);

    updateTooltips(this.id);


    if(choroInit==0){
      initLegend(wdiMeta);}
    
    else{updateLegend(wdiMeta);}
    
	});
  
}


$("#indicatorCategorySelect").change(function() {
  category=$(this).val()
  updateIndicatorOptions(category);

  console.log($("#listBoox"))


});

updateIndicatorOptions("Environment")


}




function updateTooltips(indicator){
    
  const countryMaps = $("#allSids path")

  //console.log(countryMaps)
  countryMaps.each(function (index) {

try{
tooltipTitle=countryDict[countryMaps[index].id].Country}
catch{tooltipTitle=countryMaps[index].id}
console.log(tooltipTitle)
console.log(wdi[indicator]["year"])
try{
secondLine=wdi[indicator]["data"][tooltipTitle].toFixed(2)}
catch(error){secondLine="No Data"}
thirdLine=wdi[indicator]["year"][tooltipTitle]

// console.log(wdi[indicator]["def"])
// console.log(wdi[indicator]["year"])


    //create tooltip
    // <div id="tooltip1" class="tooltips" role="tooltip"></div>
    //<div class="arrow" data-popper-arrow></div>
    $('#tooltip'+indicator).html('<h4 style="color:#0DB14B">'+tooltipTitle+'</h4><h6>'+secondLine+'</h6><h6>'+thirdLine+'</h6><div class="arrow" data-popper-arrow></div></div>')
    // console.log(index+": yo");
  });

  console.log($('#tooltips'))

  const tooltips = $(".tooltips")
    .each(function (index) {
      //console.log(index+": tt");
    });

}



}




function regionColors(region,member){
    if(member=="N"){return "black"}
    else if(region=="Caribbean"){ return "c008080";}
    else if(region=="Pacific"){ return "cF0A500";}
    else if(region=="AIS"){ return "c97002B";}
    else {return "black"}
}

function initLegend(wdiMeta){

$("#regionLegend").remove()

console.log("init legend")

  var legend = d3.select("#legend_container").selectAll('*').selectAll('g.legendEntry')
  .data(quantize.range())
  .enter()
  .append('g').attr('class', 'legendEntry');

legend
  .append('rect')
  .attr("x", function (d, i) {
    return i * -70 + 620;
  })
  .attr("y", 35)
  .attr("width", 70)
  .attr("height", 12)
  .attr("class", function (d) { return d; })
  .on("click", function (d) {
    if (lastActive == "") {
      resetAll();
      d3.select(ireland).selectAll("." + d).attr("class", "highlight");		/* Highlight all counties in range selected */
    }
  });

legend
  .append('text').attr("class","textNum")
  .attr("x", function (d, i) {
    return i * -70 + 610;
  }) //leave 5 pixel space after the <rect>
  .attr("y", 30)
  .text(function (d, i) {
    var extent = quantize.invertExtent(d);
    //extent will be a two-element array, format it however you want:
    //return format(extent[0]) + " - " + format(+extent[1])
    return (nFormatter(extent[1],2))//.toFixed(2))//extent[0].toFixed(2) + " - " + 
  })
  .style("font-size", "12px");

legend.append('text').attr("x",680).attr("y",30).text("0.0").style("font-size", "12px");

choroInit=1;



legend
  .append('text').attr("class","legendTitle")
  .attr("x", 360)
  .attr("y", 10).attr("text-anchor","middle")
  .text(function (d, i) {
    //extent will be a two-element array, format it however you want:
    //return format(extent[0]) + " - " + format(+extent[1])
    indi=$(".active")[0].id
    return wdiMeta[indi]["Indicator Name"]//["name"];//.toFixed(2))//extent[0].toFixed(2) + " - " + 
  })
  .style("font-size", "12px")
  .style("font-weight", "bold");

}
  
function updateLegend(wdiMeta){
    console.log("updating legend")

// hueNum=2

//     quantize = d3.scale.quantize()
//     .domain([min,max])
//     .range(d3.range(9).map(function (i) { return hues[hueNum] + i + "-9"; }));

  var legend = d3.select("#legend_container").selectAll('g.legendEntry')
.data(quantize.range())

legend.selectAll(".legendTitle")
.text(function (d, i) {
  //extent will be a two-element array, format it however you want:
  //return format(extent[0]) + " - " + format(+extent[1])
  indi=$(".active")[0].id
  return wdiMeta[indi]["Indicator Name"]//["name"];//.toFixed(2))//extent[0].toFixed(2) + " - " + 
})

legend
.selectAll('rect')
.attr("class", function (d) { 
  console.log(d);
  return d; });

legend
.selectAll('.textNum')
.text(function (d, i) {
  var extent = quantize.invertExtent(d);
  //extent will be a two-element array, format it however you want:
  return (nFormatter(extent[1],2))//extent[0].toFixed(2) + " - " + 
})

legend.append('text').attr("x",750).attr("y",30).text("0.0").style("font-size", "12px");

    //update legend numbers
     // update Title Above Legend
  
    //update quantized scale
}

function initTooltips(){
    const countryMaps = $("#allSids path")

    countryMaps.each(function (index) {

try{
  console.log(countryDict[countryMaps[index].id])
tooltipTitle=countryDict[countryMaps[index].id].Country;
secondLine=countryDict[countryMaps[index].id].Region+" region";
thirdLine="Population: "+countryDict[countryMaps[index].id].Population.toString();}
catch{tooltipTitle=countryMaps[index].id;
  secondLine="No data"
  thirdLine=""}


      //create tooltip
      // <div id="tooltip1" class="tooltips" role="tooltip"></div>
      //<div class="arrow" data-popper-arrow></div>
      $('#tooltips').append('<div class="tooltips" id="tooltip'+countryMaps[index].id+'" role="tooltip"><h4 style="color:#0DB14B">'+tooltipTitle+'</h4><h6 id="tooltipStat">'+secondLine+'</h6><h6>'+thirdLine+'</h6><div class="arrow" data-popper-arrow></div></div>')
      // console.log(index+": yo");
    });

    console.log($('#tooltips'))

    const tooltips = $(".tooltips")
      .each(function (index) {
        //console.log(index+": tt");
      });

    //console.log(tooltips)

    popperInstance = new Array();

    for (i = 0; i < countryMaps.length; i++) {
      popperInstance[i] = Popper.createPopper(countryMaps[i], tooltips[i],
        {
          placement: 'top',
          modifiers: [
            { name: 'offset',
              options: {
              offset: [0, 8],
              }, }, ], });
    }
  
    function hide() {
      //map to all
      for (j = 0; j < countryMaps.length; j++) {
        tooltips[j].removeAttribute('data-show');
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
      tooltips[j].setAttribute('data-show', '');
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



function zoomed(d) {
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
  if (d.classed("active")) {	/* if county is active reset map scale and county colour */
    d.attr("class", function (d) {
      return quantize(rateById.get(this.id))
    });
    main_chart_svg.selectAll("#viewport")
      .transition().duration(750).attr("transform", "scale(" + defaultScale + ")");
    lastActive = "";

  } else {			/* zoom into new county      */
    resetAll();			/* reset county colors	     */

    /* scale is the max number of times bounding box will fit into container, capped at 3 times */
    scale = Math.min(mw / xy[1], mh / xy[3], 3);

    /* tx and ty are the translations of the x and y co-ordinates */
    /* the translation centers the bounding box in the container  */
    var tx = -xy[0] + (mw - xy[1] * scale) / (2 * scale);
    var ty = -xy[2] + (mh - xy[3] * scale) / (2 * scale);

    main_chart_svg.selectAll("#viewport")
      .transition().duration(750).attr("transform", "scale(" + scale + ")translate(" + tx + "," + ty + ")");
    d.attr("class", "active");
    lastActive = d.attr("id");
  }
}

function reset(selection) {
  /* resets the color of a single county */
  if (selection != "")
    d3.select(ireland).select("#" + selection).attr("class", function (d) {
      return quantize(rateById.get(this.id))
    });
}

function resetAll() {
  /* resets the color of all counties */
  d3.select(ireland).selectAll("path")
    .attr("class", function (d) {
      return quantize(rateById.get(this.id))
    });
}

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
  d3.xml("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/maps/sidsSVG.svg"),
  d3.json("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/exports/recentWdiSidsFull.json")
]).then(function (files) {
console.log("done")
  //updateIndicatorOptions("Environment");

  initChoropleth(files[0],files[1],files[2])//,files[4]);

  drawRegionLegend();

}).catch(function (err) {
  // handle error here
})







categories=["Environment","Health","Poverty","Education","Gender","Social Protection & Labor",
"Economic Policy & Debt","Infrastructure","Financial Sector","Public Sector","Private Sector & Trade"]

for(category in categories){

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