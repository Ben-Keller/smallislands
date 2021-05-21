///initializations
const mw = '800';
const mh = '580';
var main_chart_svg = d3.select("#choro_map_container").append("svg")
  .attr('width', mw)
  .attr('height', mh)//'800'//'auto'
var choro_legend_svg = d3.select("#choro_legend_container").append("svg")
  .attr("width", mw)
  .attr("height", 60)
var hues = ["b", "b", "b",]
//var hue = "g";	/* b=blue, g=green, r=red colours - from ColorBrewer */
var rateById = d3.map();
var lastActiveCountry = "";
var sidsMaps;
var data;
var defaultScale = 1;	/* default scale of map - fits nicely on standard screen */
var scale = 3;		/* maximum size to zoom county */
var quantize = d3.scale.quantize()
var countryJson = [];
var sidsXML;
var wdiFull;
var wdiMeta;
var mapLocations;
var choroInit = 0;




function drawRegionLegend() {
  ///draw region legend
  //console.log("region legend drawn")
  $("#indicatorExport").hide()
}

function updateChoropleth(indicator) {
  console.log("updating")

  hueNum = getRandomInt(0, 3)

  //selectedYear=$("yearSelect").val()

  //temp until time series are added
  selectedYear = "2016"

  console.log(indicator, wdiFull)

  try{
  indicator2=$(".indiActive2")[0].id}
  catch(error){indicator2="HumanDevelopmentIndex"}


    if(indicator=="Region"){
      indicatorData=wdiFull["HumanDevelopmentIndex"]["data"]
    }
    else{ 
  indicatorData = wdiFull[indicator]["data"]//[selectedYear]
    }
  indicatorData2 = wdiFull[indicator2]["data"]//[selectedYear]
  console.log(indicatorData)

  //enter indicator data directly to each svg, based on function looking for same name

  selectedViz = $('.selectedViz')[0].innerHTML

    if(selectedViz=="Choropleth"){
    main_chart_svg.selectAll("line").transition().duration(1000).style("opacity",1);
    }else{
     main_chart_svg.selectAll("line").transition().duration(1000).style("opacity",0);
    }

  d3.select(sidsMaps).selectAll(".countrySvg")
    .transition()
    .duration(1200) //make transition time relative to to/from viz
    .attr("transform", function (d) {
   //   console.log(this.id)
      try{
      var bBox = getBoundingBox(d3.select(this));
      var country = countryJson[this.id].Country;

      VT= vizTransform(country, bBox, selectedViz, indicatorData,indicatorData2);
       // console.log(country, VT)
      return "scale("+scale+","+scale+")translate("+VT["x"]+","+VT["y"]+")"}
      catch(error){
        //var bBox = this.getBBox();
        console.log(error)
        //cx = bBox.x + bBox.width / 2;
        //cy = bBox.y + bBox.height / 2;
        return ""//"translate("+(-cx)+","+(-cy)+")";
      }
    })



  d3.select(sidsMaps).selectAll(".choroText")
    .transition()
    .duration(1200) //make transition time relative to to/from viz
    .attr("transform", function (d) {
      //    console.log(this.innerHTML)

      var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
      textBBox = this.getBBox()
      //console.log(textBBox)
      var country = this.innerHTML;

      TT= textTransform(country, bBox, textBBox, selectedViz, indicatorData,indicatorData2);
     // console.log(bBox,textBBox,TT,country)
      return TT;
    })


  d3.selectAll(".choroMap")
    .transition()
    .duration(1200) //make transition time relative to to/from viz
    .attr("opacity", function (d) {
      if (selectedViz == "Global View") {
        return 0.7;
      }
      else {
        return 0;
      }

    })


  // d3.select(sidsMaps).selectAll(".choroLine")
  //   .transition()
  //   .duration(1200) //make transition time relative to to/from viz
  //   .attr("x1", function (d) {
  //     var textBBox =d3.select(this.parentNode).select("text").node().getBBox();
  //     var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
  //     var country = countryJson[this.parentNode.id].Country
  //     return lineTransform(country, bBox, textBBox, selectedViz, indicatorData)["x1"]
  //   })
  //   .attr("x2", function (d) {
  //     var textBBox =d3.select(this.parentNode).select("text").node().getBBox();
  //     var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
  //     var country = countryJson[this.parentNode.id].Country
  //     return lineTransform(country, bBox, textBBox, selectedViz, indicatorData)["x2"]
  //   })
  //   .attr("y1", function (d) {
  //     var textBBox =d3.select(this.parentNode).select("text").node().getBBox();
  //     var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
  //     var country = countryJson[this.parentNode.id].Country
  //     return lineTransform(country, bBox, textBBox, selectedViz, indicatorData)["y1"]
  //   })
  //   .attr("y2", function (d) {
  //     var textBBox =d3.select(this.parentNode).select("text").node().getBBox();
  //     var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
  //     var country = countryJson[this.parentNode.id].Country
  //     return lineTransform(country, bBox, textBBox, selectedViz, indicatorData)["y2"]
  //   })


if(selectedViz=="Choropleth"){
//main_chart_svg.selectAll("text").transition().duration(1000).attr("fill-opacity",1);

d3.select("#pacificRegionTitle").transition().duration(1000).attr("x", 775).attr("y", 460).attr("fill-opacity",1);
d3.select("#caribbeanRegionTitle").transition().duration(1000).attr("x", 760).attr("y", 130).attr("fill-opacity",1);
d3.select("#aisRegionTitle").transition().duration(1000).attr("x", 785).attr("y", 335).attr("fill-opacity",1);

}else if(selectedViz=="Bar Chart" || selectedViz=="Multi-indicator"){
  // d3.select("#pacificRegionTitle").transition().duration(1000).attr("fill-opacity",0)
  // d3.select("#caribbeanRegionTitle").transition().duration(1000).attr("fill-opacity",0)
  // d3.select("#aisRegionTitle").transition().duration(1000).attr("fill-opacity",0)


// ranks=rankfunction()

// function rankfunction(){
//   return rankObject
// }

// function regionAverageTooltips

  d3.select("#pacificRegionTitle").transition().duration(1000).attr("x", 775).attr("y", function(){
    //val=ranks["Pacific Average"]
return 400
  }).attr("fill-opacity",1);
  d3.select("#caribbeanRegionTitle").transition().duration(1000).attr("x", 760).attr("y", 270).attr("fill-opacity",1);
  d3.select("#aisRegionTitle").transition().duration(1000).attr("x", 785).attr("y", 335).attr("fill-opacity",1);
}
else if(selectedViz=="Global View"){


  d3.select("#pacificRegionTitle").transition().duration(1000).attr("x", 675).attr("y", 180).attr("fill-opacity",1);
d3.select("#caribbeanRegionTitle").transition().duration(1000).attr("x", 30).attr("y", 220).attr("fill-opacity",1);
d3.select("#aisRegionTitle").transition().duration(1000).attr("x", 370).attr("y", 195).attr("fill-opacity",1);
}


d3.select(sidsMaps).selectAll(".choroRect")
    .transition()
    .duration(1200)
    .attr("y",function(){
      var country = countryJson[this.parentNode.id].Country
      return rectTransform(country, selectedViz, indicatorData)["y"]})
      .attr("width",function(){
        var country = countryJson[this.parentNode.id].Country
        return rectTransform(country, selectedViz, indicatorData)["width"]})
        .attr("height",function(){
          var country = countryJson[this.parentNode.id].Country
          return rectTransform(country, selectedViz, indicatorData)["height"]})

  d3.select(sidsMaps).selectAll(".countryLabel")
    .transition()
    .duration(1200)
    .attr("y",function(){
      var country = countryJson[this.parentNode.id].Country
      LTy=labelTransform(country, selectedViz, indicatorData)["y"]
      return LTy;})
      .attr("x",function(){
        var country = countryJson[this.parentNode.id].Country
        LTx=labelTransform(country, selectedViz, indicatorData)["x"]+170
        return LTx;})
        .text(function(){
          var country = countryJson[this.parentNode.id].Country
          return nFormatter(indicatorData[country],3)})



        


          d3.select(sidsMaps).selectAll("circle")
          .transition()
          .duration(1200)
          .attr("cx",function(){
            var country = countryJson[this.parentNode.id].Country
            var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
            return circleTransform(country, bBox, selectedViz, indicatorData,indicatorData2)["x"]})
            .attr("cy",function(){
              var country = countryJson[this.parentNode.id].Country
              var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
              return circleTransform(country, bBox, selectedViz, indicatorData,indicatorData2)["y"]})
              .attr("r",function(){
                var country = countryJson[this.parentNode.id].Country
                var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
                return circleTransform(country, bBox, selectedViz, indicatorData,indicatorData2)["r"]})
      
          /////opacity fade by value
          // .attr("opacity",function(){
          //   var country = countryJson[this.parentNode.id].Country;
          //   if(indicatorData[country]=="No Data"){return 0}
          //   else{
          //   max = Math.max(...Object.values(indicatorData).filter(function (el) {
          //     return !isNaN(parseFloat(el)) && isFinite(el);
          //   }))
          //   min =max*(-1/5)//  Math.min(...Object.values(indicatorData).filter(function (el) { return !isNaN(parseFloat(el)) && isFinite(el);}))
          //   return((indicatorData[country]-min)/(max-min))}
          // })
    

///draw choropleth scale
    if(indicator!="Region"){

  /* break the data values into 9 ranges of €100 each   */

  max = Math.max(...Object.values(indicatorData).filter(function (el) {
    return !isNaN(parseFloat(el)) && isFinite(el);
  }))
  min = 0// Math.min(...Object.values(indicatorData).filter(function (el) { return !isNaN(parseFloat(el)) && isFinite(el);  }))
  // max=

  quantize = d3.scale.quantize()
    .domain([min, max])
    .range(d3.range(9).map(function (i) { return hues[hueNum] + i + "-9"; }));

  d3.select(sidsMaps).selectAll("path").on("mouseout", function (d) {
    if (d3.select(this).classed("countryActive")) return;
    d3.select(this).attr("class", function (da) { 			/* reset county color to quantize range */
      stat = indicatorData[countryJson[this.id].Country]
      if (typeof stat == "undefined" || stat == "No Data") {
        //hide country name


        return "nodata countrySvg"
      }
      else {
        //show country name
        return (quantize(stat) + " shadow countrySvg");
      }


    });
  })


  noData = []
  d3.select("#choro_map_container").selectAll("path")		/* Map  counties to  data */
    .attr("class", function (d) {
      
try{
      // console.log(stat)
      if (indicatorData[countryJson[this.id].Country] == "No Data") {
        //hide country name
        noData.push(countryJson[this.id].Country)
        return "nodata countrySvg"
      }
    
      else {
        //show country name
        if(selectedViz=="Multi-indicator"){
return(regionColors(countryJson[this.id].Region,"Y")+" shadow countrySvg")
        }
          else{
        
        stat = indicatorData[countryJson[this.id].Country];
        return (quantize(stat) + " shadow countrySvg");}
      }
    }catch(error){   
console.log(this.id)
//noData.push(countryJson[this.id].Country)
      return "nodata"}

    });



//    main_chart_svg.selectAll("circle")		/* Map  counties to  data */
//     .attr("class", function (d) {
      
// try{
//       // console.log(stat)
//       if (indicatorData[countryJson[this.parentNode.id].Country] == "No Data") {
//         //hide country name
//         return "nodata"
//       }
    
//       else {
//         //show country name
//         if(selectedViz=="Multi-indicator"){
// return(regionColors(countryJson[this.parentNode.id].Region,"Y"))
//         }
//           else{
//         stat = indicatorData[countryJson[this.parentNode.id].Country];
//         return (quantize(stat) );}
//       }
//     }catch(error){   
//       console.log(error)
// //noData.push(countryJson[this.id].Country)
//       return "nodata"}

//     });




  $(".choroText").each(function (d) {
    if (noData.includes(this.innerHTML)) {
      $(this).css("fill-opacity",0)
    }
    else {
      $(this).css("fill-opacity",1)
    }
  })


  $(".countryLabel").each(function (d) {
    if (noData.includes(countryJson[this.parentNode.id].Country)||selectedViz!="Bar Chart") {
      $(this).css("fill-opacity",0)
    }
    else {
      $(this).css("fill-opacity",1)
    }
  })

if(selectedViz=="Multi-indicator"){ d3.select(".yAxisTitle").transition().duration(1000).attr("fill-opacity",1)}
else{ d3.select(".yAxisTitle").transition().duration(1000).attr("fill-opacity",0)}



    }
}

function textTransform(country, bBox,textBBox, selectedViz, indicatorData,indicatorData2) {
  textX = bBox[4]
  textY = bBox[2] - 11;
  if (selectedViz == "Choropleth") {

    return "translate(" + 0 + "," + 0 + ")";
  }
  else if (selectedViz == "Global View") {
    //console.log(country)
    try {

      return "translate(" + (-textX + mapLocations[country]["titleX"]) + "," + (-textY + mapLocations[country]["titleY"]) + ")";
    }
    catch (error) {
      //shouldn't have any of these happening
      return "translate(" + (-textX) + "," + (-textY) + ")";
    }

  }
  else if (selectedViz == "Bar Chart") {

    val=indicatorData[country]

    if(typeof val != "number"){return "translate(" + (-textX+140-textBBox.width/2) + "," + (-textY) + ")"; }


  try{
    var filtered = Object.fromEntries(Object.entries(indicatorData).filter(([k,v]) => v>-1))
    //temp, until figure out how to add these in
    delete filtered["AIS Average"];
    delete filtered["Pacific Average"]
    delete filtered["Caribbean Average"]
    delete filtered["Caribbean small states"]
    delete filtered["Pacific island small states"]
    delete filtered["Caribbean small states"]
    delete filtered["Virgin Islands"]
    delete filtered["French Polynesia"]
    delete filtered["New Caledonia"]
    delete filtered["Puerto Rico"]

    sortedData=sort_object(filtered);
   // console.log(sortedData)
    indicatorValues = Object.values(filtered)
  
    rank=sortedData[country]

  totalVals=indicatorValues.length

  
  totalHeight=500


  return "translate(" + (-textX +140-textBBox.width/2)+ "," + (-textY + totalHeight/totalVals*(rank+.5)) + ")";
}catch(error){

  return "translate(" + (-textX) + "," + (-textY) + ")";///20
}
    }

  else if (selectedViz=="Multi-indicator"){
    val = indicatorData[country]
    val2 = indicatorData2[country]
if(typeof val =="number" && typeof val2=="number"){
    max = 1
    min = 0
    scale = .37;

    //remove values with no data
    indicatorValues = Object.values(indicatorData).filter(function (el) {
      return !isNaN(parseFloat(el)) && isFinite(el);
    });
    maxx = Math.max(...indicatorValues)
    minn = Math.min(...indicatorValues)
    normValue = (val - minn) / (maxx - minn)

        //remove values with no data
        indicatorValues2 = Object.values(indicatorData2).filter(function (el) {
          return !isNaN(parseFloat(el)) && isFinite(el);
        });
        maxx2 = Math.max(...indicatorValues2)
        minn2 = Math.min(...indicatorValues2)
        normValue2 = (val2 - minn2) / (maxx2 - minn2)
    
//scale(" + scale + "," + scale + ")
x=-textX+(normValue*1970+213)*scale
y=1200*scale-textY - (normValue2 * 1240)*scale

    return "scale(1,1)translate(" + x + "," + y + ")";
  
  }else{ return "scale(0.001,0.001)"//translate(" + (-textX) + "," + (-textY) + ")";
}
}

}

function labelTransform(country, selectedViz, indicatorData){
RT=rectTransform(country,selectedViz,indicatorData)
txt=indicatorData[country]
return({x:RT.width,y:RT.y+RT.height/2+4})

}


function vizTransform(country, bBox, selectedViz, indicatorData,indicatorData2) {

  cx = bBox[4]
  cy = bBox[5]

  if (selectedViz == "Choropleth") {
    scale=1
    x=0
    y=0
  }

  else if (selectedViz == "Bar Chart") {
  
rect=rectTransform(country,selectedViz,indicatorData)
    scale=0.01
x=(rect.width/2+160)/scale-cx
y=(rect.y+2)/scale-cy

    //return "scale(" + 0+")"// + "," + scale + ")translate(" + (-cx) + "," + (-cy + normValue * 1200) + ")";
  }

  else if (selectedViz == "Global View") {
    try {
      valX = mapLocations[country]["countryX"] * 2;
      valY = mapLocations[country]["countryY"] * 2;
      if (mapLocations[country]["countryWidth"] == "no") {
        scale = 0.1;
      }
      else {
        scale = mapLocations[country]["countryWidth"] / bBox[1] * 2
      }
    }
    catch (error) {
     // console.log(error)
      valX = 0;
      valY = 0;
      scale = 0.3
    }

    //idk why 1.41
    
    x=-cx + valX / scale / 1.41
    y=-cy + valY / scale / 1.41
    scale=scale/ 1.41
  }

  else if (selectedViz == "Multi-indicator") {

    val = indicatorData[country]
    val2 = indicatorData2[country]

    if(typeof val =="number" && typeof val2=="number"){
    max = 1
    min = 0
    scale = .37;

    //remove values with no data
    indicatorValues = Object.values(indicatorData).filter(function (el) {
      return !isNaN(parseFloat(el)) && isFinite(el);
    });
    maxx = Math.max(...indicatorValues)
    minn = Math.min(...indicatorValues)
    normValue = (val - minn) / (maxx - minn)

        //remove values with no data
        indicatorValues2 = Object.values(indicatorData2).filter(function (el) {
          return !isNaN(parseFloat(el)) && isFinite(el);
        });
        maxx2 = Math.max(...indicatorValues2)
        minn2 = Math.min(...indicatorValues2)
        normValue2 = (val2 - minn2) / (maxx2 - minn2)
    

    x=-cx+normValue*1970+78/scale
    y=1200-cy - normValue2 * 1240+65
  }

else{
  scale=0
  x=-cx
  y=-cy
}
  
}
return{"x":x,"y":y,"scale":scale}
}



function lineTransform(country, bBox, textBBox, selectedViz, indicatorData) {

  // cx = bBox.x + bBox.width / 2;
  // cy = bBox.y + bBox.height / 2;

  if (selectedViz == "Choropleth") {
    x1 = bBox[4];
    x2 = bBox[4];
    y1 = bBox[2] - 11;
    y2 = bBox[2] - 11;//[5]
  }

  else if (selectedViz == "Global View") {
    try {
      line = mapLocations[country]["line"]
      
      if (line == "no") {
        x1 = mapLocations[country]["countryX"] * 1.4;
        y1 = mapLocations[country]["countryY"] * 1.4;
      }
      else if (line == "left") {
        x1 = mapLocations[country]["titleX"] * 1.4 - textBBox.width / 2;
        y1 = mapLocations[country]["titleY"] * 1.4-4;
      }
      else if (line == "b-left") {
        x1 = mapLocations[country]["titleX"] * 1.4 - textBBox.width / 3;
        y1 = mapLocations[country]["titleY"] * 1.4;
      }
      else if (line == "right") {
        x1 = mapLocations[country]["titleX"] * 1.4 + textBBox.width / 2;
        y1 = mapLocations[country]["titleY"] * 1.4-4;
      }
      else if (line == "b-right") {
        x1 = mapLocations[country]["titleX"] * 1.4 + textBBox.width / 3;
        y1 = mapLocations[country]["titleY"] * 1.4;
      }
      else if (line == "t-right") {
        x1 = mapLocations[country]["titleX"] * 1.4 + textBBox.width / 3;
        y1 = mapLocations[country]["titleY"] * 1.4-8;
      }
      else if (line == "t-left") {
        x1 = mapLocations[country]["titleX"] * 1.4 - textBBox.width / 3;
        y1 = mapLocations[country]["titleY"] * 1.4-8;
      }
      else if (line == "top") {
        x1 = mapLocations[country]["titleX"] * 1.4;
        y1 = mapLocations[country]["titleY"] * 1.4-8;
      }
      else {
        x1 = mapLocations[country]["titleX"] * 1.4+400;
        y1 = mapLocations[country]["titleY"] * 1.4;
      }

      x2 = mapLocations[country]["countryX"] * 1.4;
      y2 = mapLocations[country]["countryY"] * 1.4;
      //idk why this is 1.3
    }
    catch (error) {
      x1 = 0;
      y1 = 0;
      x2 = 0;
      y2 = 0;
    }
  }

  else if (selectedViz == "Bar Chart") {
    try {
      val = indicatorData[country]

      max = 1
      min = 0
      scale = .5;

      //remove values with no data
      indicatorValues = Object.values(indicatorData).filter(function (el) {
        return !isNaN(parseFloat(el)) && isFinite(el);
      });

      maxx = Math.max(...indicatorValues)
      minn = 0//Math.min(...indicatorValues)
      normValue = (val - minn) / (maxx - minn)

      x2 = 0;
      y2 = normValue * 600;
      y1 = normValue * 600;
      x1 = 30;
    } catch (error) {
      x2 = 0;
      y2 = 0;
      x1 = 10;
      y1 = 10;
    }
  }
  else{
    x1=0;
    x2=0;
    y1=0;
    y2=0;
  }

  return { "x1": x1, "x2": x2, "y1": y1, "y2": y2 };
}


function sort_object(obj) {
  items = Object.keys(obj).map(function(key) {
      return [key, obj[key]];
  });
  items.sort(function(first, second) {
      return second[1] - first[1];
  });
  sorted_obj={}
  $.each(items, function(k, v) {
      use_key = v[0]
      use_value = k;//v[1]
      sorted_obj[use_key] = use_value
  })
  return(sorted_obj)

} 


function circleTransform(country, bBox, selectedViz, indicatorData, indicatorData2){
  val=indicatorData[country]
  val2=indicatorData2[country]

  VT= vizTransform(country, bBox, selectedViz, indicatorData,indicatorData2);
  
  
  if(selectedViz=="Choropleth"){
    return{"x":bBox[4],"y":bBox[5],"r":0}
  }
  else if(selectedViz=="Global View"){
  //  console.log(VT,bBox,country)
    if(mapLocations[country]["countryWidth"]=="no"){r=2}else{r=0}
    return{"x":(VT["x"]+bBox[4])*VT["scale"],"y":(VT["y"]+bBox[5])*VT["scale"],"r":r}
    
  } 
  else if(selectedViz=="Bar Chart"){
    return{"x":0,"y":0,"r":0}
  }  
else if(selectedViz="Multi-indicator"){
  //the 2.7 must come from the scale factor on the choropleth?
  return{"x":(VT["x"]+bBox[4])/2.7,"y":(VT["y"]+bBox[5])/2.7,"r":0}
}

  //&& typeof val == "number"){

}


function rectTransform(country, selectedViz, indicatorData){
 // console.log(indicatorData)
  val=indicatorData[country]
  //console.log(val, typeof val)
  if(selectedViz=="Bar Chart" && typeof val == "number"){
  
try{
  var filtered = Object.fromEntries(Object.entries(indicatorData).filter(([k,v]) => typeof v =="number"))
  //temp, until figure out how to add these in
  delete filtered["AIS Average"];
  delete filtered["Pacific Average"]
  delete filtered["Caribbean Average"]
  delete filtered["Caribbean small states"]
  delete filtered["Pacific island small states"]
  delete filtered["Caribbean small states"]
  delete filtered["Virgin Islands"]
  delete filtered["French Polynesia"]
  delete filtered["New Caledonia"]
  delete filtered["Puerto Rico"]
  ;
  sortedData=sort_object(filtered);
 // console.log(sortedData)
  indicatorValues = Object.values(filtered)

  rank=sortedData[country]
 // console.log(country)
//console.log(indicatorValues)
totalVals=indicatorValues.length
//console.log(totalVals)

// for(i=0;i<indicatorValues.length;i++){
//   if(indicatorValues[i]>val){
//     rank+=1;
//   }

// }

topMargin=0
totalHeight=500
totalWidth=620
margin=4


maxx = Math.max(...indicatorValues)
minn = 0//Math.min(...indicatorValues)
normValue = (val - minn) / (maxx - minn)



//console.log(country,normValue,rank,minn)
return {"y":totalHeight/totalVals*(rank)+topMargin,"width":normValue*totalWidth,"height":totalHeight/totalVals-margin}//,"color":color};
}
  catch(error){
    //console.log(error)
    //console.log(country,"no1");
    return{"y":300,"width":0,"height":0}
  }}
  else{
   // console.log(country,"no2")
    return{"y":300,"width":0,"height":0}
  }
}


function appendCountryLabels() {
  d3.select('#allSids').selectAll("g")
    .append("svg:text")
    .text("")
    .attr("x", function (d) {
      return getBoundingBox(d3.select(this.parentNode).select("path"))[4];
    })
    .attr("y", function (d) {
      return (getBoundingBox(d3.select(this.parentNode).select("path"))[5]);
    })
    .attr("font-size",10)
    .classed("countryLabel", true)
    .attr("visibility","visible")
}

function appendCountryTitles() {

  d3.select('#allSids').selectAll("g")
    .append("svg:text")
    .text(function (d) {
      try {
        text= countryJson[this.parentNode.id].Country;
        return text;
      }
      catch {
        return this.parentNode.id;
      }
    })
    .attr("x", function (d) {
      //	console.log(d3.select(this.parentNode).select("path").attr("d"));
      //return 600;
      //d3.select(sidsMaps).select("path") 
      //console.log(d3.select(this.parentNode).select("path"))
      return getBoundingBox(d3.select(this.parentNode).select("path"))[4];
    })
    .attr("y", function (d) {
      return (getBoundingBox(d3.select(this.parentNode).select("path"))[2] - 11);
    })
    .attr("font-size",10)
    .classed("choroText", true)
   
}


function appendCountryLines() {


  d3.select('#allSids').selectAll("g")
    .append("line")
    .style("stroke-width", 1)
    .style("stroke", "green")
    .attr("x1", function (d) {
      return getBoundingBox(d3.select(this.parentNode).select("path"))[4];
    })
    .attr("x2", function (d) {
      return getBoundingBox(d3.select(this.parentNode).select("path"))[4];
    })
    .attr("y1", function (d) {
      return getBoundingBox(d3.select(this.parentNode).select("path"))[2] - 11;
    })
    .attr("y2", function (d) {
      return getBoundingBox(d3.select(this.parentNode).select("path"))[2] - 11;//[5]
    })
    .classed("choroLine", true);

}

function appendCountryRectangles(){

  d3.select('#allSids').selectAll("g")
  .append("rect")
  .style("fill",function(){

    return "#"+regionColors(countryJson[this.parentNode.id].Region,"Y").substring(1)})//
  .attr("x", 160)
  .attr("y", 300)
  .attr("width", 0)
  .attr("height", 0)
  .classed("choroRect", true);

}

function appendCountryCircles(){

  d3.select('#allSids').selectAll("g")//.selectAll('circle')
  .append("circle")
  .style("fill",function(){

    return "#"+regionColors(countryJson[this.parentNode.id].Region,"Y").substring(1)})//

  .attr("cx", function (d) {
    //	console.log(d3.select(this.parentNode).select("path").attr("d"));
    //return 600;
    //d3.select(sidsMaps).select("path") 
    //console.log(d3.select(this.parentNode).select("path"))
    return getBoundingBox(d3.select(this.parentNode).select("path"))[4];
  })
  .attr("cy", function (d) {
    return (getBoundingBox(d3.select(this.parentNode).select("path"))[5] );
  })

  .attr("r", 0)
  .classed("choroCircle", true);

}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function initChoropleth() {

  main_chart_svg.append("svg:image")
    .attr('x', -18)
    .attr('y', -305)
    .attr('width', 879)
    .attr('height', 1000)
    .attr("xlink:href", "graphics/SIDS_map_clean-01.png")
    .attr("opacity", 0)
    .attr("class", "choroMap");


  main_chart_svg.append('line')
    .style("stroke", "gray").style("stroke-width", 1).attr("x1", 80).attr("y1", 263).attr("x2", 740).attr("y2", 263).classed("regionLine");

  main_chart_svg.append('line')
    .style("stroke", "gray").style("stroke-width", 1).attr("x1", 80).attr("y1", 363).attr("x2", 740).attr("y2", 363).classed("regionLine");

    main_chart_svg
    .append('text').attr("x", 775).attr("y", 460).text("Pacific").style("fill", "#" + regionColors("Pacific", "Y").substring(1)).attr("fill-opacity",1).style("font-size", "18px").style("font-weight", 1000).attr("id","pacificRegionTitle").attr("class","regionTitle");
    main_chart_svg
    .append('text').attr("x", 760).attr("y", 130).text("Caribbean").style("font-size", "18px").style("font-weight", 1000).style("fill", "#" + regionColors("Caribbean", "Y").substring(1)).attr("fill-opacity",1).attr("id","caribbeanRegionTitle").attr("class","regionTitle");
    main_chart_svg
    .append('text').attr("x", 785).attr("y", 335).text("AIS").style("fill", "#" + regionColors("AIS", "Y").substring(1)).attr("fill-opacity",1).style("font-size", "18px").style("font-weight", 1000).attr("id","aisRegionTitle").attr("class","regionTitle");

    

  var svgMap = sidsXML.getElementsByTagName("g")[0];			/* set svgMap to root g */
  //console.log(svgMap)
  sidsMaps = d3.select("#choro_map_container").selectAll("*").node().appendChild(svgMap);		/* island of sidsMaps map */


  d3.select(sidsMaps).selectAll("path")
    .on("mouseover", function (d) {
      if (d3.select(this).classed("countryActive")) return;		/* no need to change class when county is already selected */
      d3.select(this).attr("class", "countryHover");
    })
    .on("mouseout", function (d) {
      if (d3.select(this).classed("countryActive")) return;
      d3.select(this).attr("class", function (da) {

        return (regionColors(countryJson[this.id].Region, countryJson[this.id]["Member State (Y/N)"]) + " shadow countrySvg");
      });
    })
    .on("click", function (d) {
      zoomed(d3.select(this), this.id, countryJson[this.id].Region);
      //d3.select(this).style("fill", "blue");
    });


  /* Let's add an id to each group that wraps a path */
  d3.select(sidsMaps).selectAll("path")
    .each(function (d) {
      d3.select(this.parentNode).attr("id", this.id);
    });
  //   resolve()
  // })}


  initChoroTooltips();

  d3.select(sidsMaps).selectAll("path")		// Map countries to regional colors
    .attr("class", function (d) {
      //console.log(this.id)

      return (regionColors(countryJson[this.id].Region, countryJson[this.id]["Member State (Y/N)"]) + " shadow countrySvg");

    });

  initIndicatorOptions();
  initIndicatorOptions2();
}

function initIndicatorOptions() {

  //console.log(wdiMeta)

  $("#indicatorCategorySelect").change(function () {
    category = $(this).val()

    updateSubcategories(category);
    updateIndicatorOptions(category, subcategory);

  });

  $("#indicatorSubcategorySelect").change(function () {
    subcategory = $(this).val()
    category = $("#indicatorCategorySelect").val()
    updateIndicatorOptions(category, subcategory);
  });

  updateSubcategories("Key Indicators");
  updateIndicatorOptions("Key Indicators", "All")



  function updateIndicatorOptions(category, subcategory) {

    ///iterate through all 1440 options and filter by those in category

    ///console.log(category)

    options = []

    var ul = document.getElementById("listBoox");
    ul.innerHTML = '';
    newHTML = ''


    for (indicator in wdiMeta) {
      if (wdiMeta[indicator].Topic == category) {

        if (wdiMeta[indicator].Subtopic.trim() == subcategory || subcategory == "All") {

          newHTML = newHTML + "<li id='" + wdiMeta[indicator]["Series Code"] + "'>" + wdiMeta[indicator]["Indicator Name"] + "</li>"
        }
      }
    }
    ul.innerHTML = newHTML

    $('#indicatorSelect li').click(function (e) {
      e.preventDefault();
      $(this).parent().find('li').removeClass('indiActive');
      $(this).addClass('indiActive');
      // console.log(wdiMeta[this.id])
      console.log(this.id)
      updateChoropleth(this.id);

      updateChoroTooltips(this.id);


      $("#choroInfoTitle").text("Indicator Description")
      $("#choroIndiText").text(wdiMeta[this.id]["Long definition"])
      $("#choroIndiSource").html("<b>Source: </b>" + wdiMeta[this.id]["Source"])


      if (choroInit == 0) {
        initChoroLegend();
        initBarAxis();
        initMultiYAxis();
      }

      else { 
      updateBarAxis();
      updateChoroLegend();
     updateMultiYAxis();
      }

    });

  }


}

function initIndicatorOptions2() {

  //console.log(wdiMeta)

  $("#indicatorCategorySelect2").change(function () {
    category = $(this).val()

    updateSubcategories2(category);
    updateIndicatorOptions2(category, subcategory);

  });

  $("#indicatorSubcategorySelect2").change(function () {
    subcategory = $(this).val()
    category = $("#indicatorCategorySelect2").val()
    updateIndicatorOptions2(category, subcategory);
  });

  updateSubcategories2("Key Indicators");
  updateIndicatorOptions2("Key Indicators", "All")


  function updateIndicatorOptions2(category, subcategory) {

    ///iterate through all 1440 options and filter by those in category

    ///console.log(category)

    options = []

    var ul = document.getElementById("listBoox2");
    ul.innerHTML = '';
    newHTML = ''


    for (indicator in wdiMeta) {
      if (wdiMeta[indicator].Topic == category) {

        if (wdiMeta[indicator].Subtopic.trim() == subcategory || subcategory == "All") {

          newHTML = newHTML + "<li id='" + wdiMeta[indicator]["Series Code"] + "'>" + wdiMeta[indicator]["Indicator Name"] + "</li>"
        }
      }
    }
    ul.innerHTML = newHTML

    $('#indicatorSelect2 li').click(function (e) {
      e.preventDefault();
      $(this).parent().find('li').removeClass('indiActive2');
      $(this).addClass('indiActive2');

      updateChoropleth($(".indiActive")[0].id);
      updateMultiYAxis();


    });

  }


}

function updateSubcategories(category) {

  subcategories = []
  for (indicator in wdiMeta) {
    if (wdiMeta[indicator].Topic == category) {

      if (!subcategories.includes(wdiMeta[indicator].Subtopic)) { subcategories.push(wdiMeta[indicator].Subtopic) }

    }
  }

  var x = document.getElementById("indicatorSubcategorySelect");
  x.innerHTML = '<option value="All">All</option>'

  for (sub in subcategories) {
    var option = document.createElement("option");
    option.text = subcategories[sub];
    x.add(option);

  }
  subcategory = $("#indicatorSubcategorySelect").val()

}


function updateSubcategories2(category) {

  subcategories = []
  for (indicator in wdiMeta) {
    if (wdiMeta[indicator].Topic == category) {

      if (!subcategories.includes(wdiMeta[indicator].Subtopic)) { subcategories.push(wdiMeta[indicator].Subtopic) }

    }
  }

  var x = document.getElementById("indicatorSubcategorySelect2");
  x.innerHTML = '<option value="All">All</option>'

  for (sub in subcategories) {
    var option = document.createElement("option");
    option.text = subcategories[sub];
    x.add(option);

  }
  subcategory = $("#indicatorSubcategorySelect2").val()

}


function convertChoroToBar() {
  console.log("done")
}

function regionColors(region, member) {
  if (member == "N") { return "black" }
  else if (region == "Caribbean") { return "c008080"; }
  else if (region == "Pacific") { return "cF0A500"; }
  else if (region == "AIS") { return "c97002B"; }
  else { return "black" }
}


function initChoroLegend() {
  $("#indicatorExport").show()
  $("#regionLegend").remove()

  console.log("init legend")

  var choroLegend = d3.select("#choro_legend_container").selectAll('*').selectAll('g.choroLegendEntry')
    .data(quantize.range())
    .enter()
    .append('g').attr('class', 'choroLegendEntry');

  choroLegend
    .append('rect')
    .attr("x", function (d, i) {
      return i * 70 + 70;
    })
    .attr("y", 35)
    .attr("width", 70)
    .attr("height", 10)
    .on("click", function (d) {
      if (lastActiveCountry == "") {
        resetAll();
        d3.select(sidsMaps).selectAll("." + d).attr("class", "countryHighlight");		/* Highlight all counties in range selected */
      }
    });

  choroLegend
    .append('text').attr("class", "textNum")
    .attr("x", function (d, i) {
      return i * 70 + 90;
    }) //leave 5 pixel space after the <rect>
    .attr("y", 30)

  // choroLegend
  //   .append('text').attr("class", "textNumEnd")
  //   .attr("x", 690)
  //   .attr("y", 30)

  choroLegend
    .append('text').attr("class", "choroLegendTitle")
    .attr("x", 360)
    .attr("y", 14).attr("text-anchor", "middle")

  choroInit = 1;

  updateChoroLegend();

}


function initBarAxis(){
 choro_legend_svg.append("g").attr("class","barAxis").attr("visibility", "hidden");

updateBarAxis();
}

function initMultiYAxis(){
  main_chart_svg.append("g").attr("class","multiYAxis").attr("visibility", "hidden");
  updateMultiYAxis();

  main_chart_svg.append("text").attr("class","yAxisTitle")
  .attr("transform", "rotate(-90)")
      .text(function () {
        return ""//wdiMeta[indicator2]["Indicator Name"]//["name"];//.toFixed(2))//extent[0].toFixed(2) + " - " + 
      })
      .attr("text-anchor","middle")
      .attr("x",-240)
      .attr("font-weight","bold")
      .attr("fill-opacity",0)

}


function updateMultiYAxis(){


  try{
    indicator2=$(".indiActive2")[0].id}
    catch(error){indicator2="HumanDevelopmentIndex"}
    indicatorData2 = wdiFull[indicator2]["data"]//[selectedYear]

  multiYAxis=d3.select(".multiYAxis")
const y = d3.scaleLinear();
var margin = { left: 45, right: 5 ,top:10};
  var yAxis = d3.axisLeft(y)  

  var height=460
  max = Math.max(...Object.values(indicatorData2).filter(function (el) {
    return !isNaN(parseFloat(el)) && isFinite(el);
  }))
  min = Math.min(...Object.values(indicatorData2).filter(function (el) { return !isNaN(parseFloat(el)) && isFinite(el);  }))
  
yAxis.tickFormat(d3.format(".2s"));

  y
        .domain([min,max])
        .range([height,0]);
      
      if(selectedViz=="Choropleth"||selectedViz=="Global View"||selectedViz=="Bar Chart"){
        y.range([0,0]);
      //setTimeout(function(){
        multiYAxis.attr("visibility", "hidden")
      //},900)
      }
      else if(selectedViz=="Multi-indicator"){multiYAxis.attr("visibility", "visible")}

      multiYAxis
      .transition().duration(1200)
      .call(yAxis)
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
        

      main_chart_svg.selectAll(".yAxisTitle")
      .text(function (d, i) {
        return wdiMeta[indicator2]["Indicator Name"]//["name"];//.toFixed(2))//extent[0].toFixed(2) + " - " + 
      })

}

function updateBarAxis(){
  try{
    indicator = $('.indiActive')[0].id
    indicatorData = wdiFull[indicator]["data"]}
    catch(error){
    indicatorData=wdiFull["HumanDevelopmentIndex"]["data"]
  }
barAxis=d3.select(".barAxis")
const x = d3.scaleLinear();
var margin = { left: 175, right: 5 };
 var xAxis = d3.axisTop(x);
  var width=620
  var height=90

  max = Math.max(...Object.values(indicatorData).filter(function (el) {
    return !isNaN(parseFloat(el)) && isFinite(el);
  }))
  min=0

  selectedViz = $('.selectedViz')[0].innerHTML
  if(selectedViz=="Multi-indicator"){
    margin.left=90;
  width=700
  min = Math.min(...Object.values(indicatorData).filter(function (el) { return !isNaN(parseFloat(el)) && isFinite(el);  }))}
  

  xAxis.tickFormat(d3.format(".2s"));
  x
        .domain([min,max])
        .range([0, width]);
      
      if(selectedViz=="Choropleth"||selectedViz=="Global View"){
        x.range([0,0]);
      setTimeout(function(){barAxis.attr("visibility", "hidden")},1100)
      }
      else if(selectedViz=="Bar Chart") {barAxis.attr("visibility", "visible")}
      else if(selectedViz="Multi-indicator"){barAxis.attr("visibility", "visible")}

    barAxis
      .transition().duration(1200)
      .attr("transform", `translate(${margin.left}, ${height / 2})`)
        .call(xAxis);
}

function updateChoroLegend() {
  //console.log("updating legend")

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
      //  console.log(d);
      return d;
    });
    selectedViz = $('.selectedViz')[0].innerHTML
    console.log(selectedViz)
  if(selectedViz=="Choropleth"||selectedViz=="Global View"){
    choroLegend
    .selectAll('rect')
    .transition().duration(1200)
    .attr("opacity",1)
  }
  else if(selectedViz=="Bar Chart"||selectedViz=="Multi-indicator"){
    choroLegend
    .selectAll('rect')
    .transition().duration(1200)
    .attr("opacity",0)
  }



    if(selectedViz=="Choropleth"||selectedViz=="Global View"){
      choroLegend
      .selectAll('.textNum')
      .text(function (d, i) {
        var extent = quantize.invertExtent(d);
        //extent will be a two-element array, format it however you want:
        return (nFormatter(extent[1], 2))//extent[0].toFixed(2) + " - " + 
      })
      .transition().duration(1200)
      .attr("fill-opacity",1)
    }
    else if(selectedViz=="Bar Chart"||selectedViz=="Multi-indicator"){
      choroLegend
      .selectAll('.textNum')
      .transition().duration(1200)
      .attr("fill-opacity",0)
    }



  // choroLegend
  //   .selectAll('.textNumEnd')
  //   .text(nFormatter(2 * quantize.invertExtent("b8-9")[1] - quantize.invertExtent("b7-9")[1], 2))

}

function initChoroTooltips() {
  const countryMaps = $("#allSids path")

  countryMaps.each(function (index) {
    //console.log(countryJson[countryMaps[index].id].Country)
    // try {

    tooltipTitle = countryJson[countryMaps[index].id].Country;
    secondLine = countryJson[countryMaps[index].id].Region + " region";
    thirdLine = "Population: " + countryJson[countryMaps[index].id].Population.toString();
    regionColor = regionColors(countryJson[countryMaps[index].id].Region, "Y").substring(1)

    $('#choroTooltips').append('<div class="choroTooltip tooltips" id="tooltipChoro' + (index).toString() +
      '" role="tooltip"><h4 style="color:#' + regionColor + '">' + tooltipTitle + '</h4><h6 id="tooltipStat">' +
      secondLine + '</h6><h6>' + thirdLine + '</h6><div class="arrow" data-popper-arrow></div></div>')
    // console.log(index+": yo");
  });

  const choroTooltips = $(".choroTooltip")

  choroPopperInstance = new Array();

  for (i = 0; i < countryMaps.length; i++) {
    choroPopperInstance[i] = Popper.createPopper(countryMaps[i], choroTooltips[i],
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
  const showEvents = ['mouseenter', 'focus'];
  const hideEvents = ['mouseleave', 'blur'];

  showEvents.forEach(event => {
    for (j = 0; j < countryMaps.length; j++) {
      // console.log(j,countryMaps[j])
      countryMaps[j].parentNode.addEventListener(event, hovered.bind(null, j));
    }
  });

  function hovered(j) {
    // console.log("i",j)
    choroTooltips[j].setAttribute('data-show', '');
    choroPopperInstance[j].update();
  }

  hideEvents.forEach(event => {
    //map to all?
    for (j = 0; j < countryMaps.length; j++) {
      //    console.log("i",j)
      countryMaps[j].parentNode.addEventListener(event, hide);
    }
  });

}

function updateChoroTooltips(indicator) {

  const countryMaps = $("#allSids path")

  countryMaps.each(function (index) {

    try {
      tooltipTitle = countryJson[countryMaps[index].id].Country
    }
    catch { tooltipTitle = countryMaps[index].id }
    // console.log(tooltipTitle)
    // console.log(wdiFull[indicator]["year"])
    try {
      secondLine = "Value: " + wdiFull[indicator]["data"][tooltipTitle].toFixed(2)
    }
    catch (error) { secondLine = "No Data" }
    thirdLine = "Year: " + wdiFull[indicator]["year"][tooltipTitle]
    regionColor = regionColors(countryJson[countryMaps[index].id].Region, "Y").substring(1)

    $('#tooltipChoro' + (index).toString()).html('<h4 style="color:#' + regionColor + '">' + tooltipTitle + '</h4><h6>' + secondLine + '</h6><h6>' + thirdLine + '</h6><div class="arrow" data-popper-arrow></div></div>')
    // console.log(index+": yo");
  });

}

function zoomed(d, country) {
  //console.log("zooming")

  /* Thanks to http://complextosimple.blogspot.ie/2012/10/zoom-and-center-with-d3.html 	*/
  /* for a simple explanation of transform scale and translation  			*/
  /* This function centers the county's bounding box in the map container		*/
  /* The scale is set to the minimum value that enables the county to fit in the	*/
  /* container, horizontally or vertically, up to a maximum value of 3.			*/
  /* If the full width of container is not required, the county is horizontally centred */
  /* Likewise, if the full height of the container is not required, the county is	*/
  /* vertically centred.								*/

  var xy = getBoundingBox(d);	/* get top left co-ordinates and width and height 	*/




  // if (d.classed("countryActive")) {	/* if county is active reset map scale and county colour */

  ///open country profile page to that country

  main_chart_svg.selectAll("#viewport")
    .transition().duration(750).attr("transform", "scale(" + defaultScale + ")");
  lastActive = "";

  // console.log(country)

  d.attr("class", function (d) {
    return quantize(rateById.get(this.id))
  });

  setSelectedId(document.getElementById('countryCategory'), "all")
  setSelectedId(document.getElementById('countrySelect'), country)


  $(".mdl-tabs__tab").removeClass("is-active")
  $("#countryViewTab").addClass("is-active")

  $("#countryViewTab h5").click()






  // } else {			/* zoom into new county      */
  //   // console.log("huh")
  //   // resetAll();			/* reset county colors	     */

  //   /* scale is the max number of times bounding box will fit into container, capped at 3 times */
  //   scale = Math.min(mw / xy[1], mh / xy[3], 3);

  //   /* tx and ty are the translations of the x and y co-ordinates */
  //   /* the translation centers the bounding box in the container  */
  //   var tx = -xy[0] + (mw - xy[1] * scale) / (2 * scale);
  //   var ty = -xy[2] + (mh - xy[3] * scale) / (2 * scale);

  //   main_chart_svg.selectAll("#viewport")
  //     .transition().duration(750).attr("transform", "scale(" + scale + ")translate(" + tx + "," + ty + ")");
  //     d.node().classList.add("countryActive");
  //   console.log(d)
  //   lastActiveCountry = d.attr("id");
  // }
}

function reset(selection) {
  /* resets the color of a single county */
  if (selection != "")
    d3.select(sidsMaps).select("#" + selection).attr("class", function (d) {
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
  d3.xml("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/maps/sidsSVG3.svg"),
  d3.json("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/exports/recentWdiSidsFull.json"),
  d3.json("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/exports/wdiMeta2.json"),
  d3.json("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/exports/mapLocations.json")
]).then(function (files) {
  //console.log("done")
  //updateIndicatorOptions("Environment");

  countryJson = files[0]
  sidsXML = files[1]
  wdiFull = files[2]
  wdiMeta = files[3]
  mapLocations = files[4]
  initChoropleth(files[1], files[2])//,files[4]);

  drawRegionLegend();

console.log(mapLocations["Curacao"])

}).catch(function (err) {
  // handle error here
})

categories = ["Key Indicators", "Environment", "Health", "Poverty", "Education", "Gender", "Social Protection & Labor",
  "Economic Policy & Debt", "Infrastructure", "Financial Sector", "Public Sector", "Private Sector & Trade"]

var indiCategories = document.getElementById("indicatorCategorySelect");
var indiCategories2 = document.getElementById("indicatorCategorySelect2");

for (category in categories) {


  var option = document.createElement("option");
  var option2 = document.createElement("option");
  option.text = categories[category];
  option2.text = categories[category];
  indiCategories.add(option);
  indiCategories2.add(option2);

}


//certainly a better way to do this right?
d3.select(self.frameElement).style("height", "650px");


$('#vizSelect ul li').click(function () {
  var x = $(this);

  $('.vizShader').stop().animate({
    'width': x.width() + 32,
    'left': x.position().left
  }, 400);

  $('.selectedViz').removeClass('selectedViz');
  $(this).children('a').addClass('selectedViz');
  // console.log(this)



  selectedViz = $('.selectedViz')[0].innerHTML
  try{
  indicator = $('.indiActive')[0].id}
  catch(error){indicator="Region"}


//  if (choroInit == 0) {
//         initChoroLegend();
//         initBarAxis();
//         initMultiYAxis();


  updateChoropleth(indicator)
  updateChoroLegend();
  updateBarAxis();
  updateMultiYAxis();

if(selectedViz=="Multi-indicator"){
  $("#indicatorSelectBox2").css("display","block");
  $("#choroInfoBox").css("display","none");
}
else{
  if(selectedViz=="Multi-indicator"){
    $("#indicatorSelectBox2").css("display","none");
    $("#choroInfoBox").css("display","block");
  }
}

});



$('#choroInfoBox').click(function () { convertChoroToBar() })


$("#countryDataTab").one("click",function () {

  setTimeout(() => {
    appendCountryLines();
    appendCountryTitles();
    appendCountryRectangles();
    appendCountryCircles();
    appendCountryLabels();
    var y= $("#choroLi");

$('.vizShader').stop().animate({
         'width': y.width()+32,
         'left':y.position().left});
         
  }, 1);

});

$("#indicatorExport").change(function () {
  // console.log("exporting indicator data")
  newIndicators = []
  for (const [key, value] of Object.entries(indicatorData)) {
    newIndicators.push({ "Country": key, "Value": value })
  }
  // console.log(wdiMeta[indicator].Source)//indicator)

  note = "Indicator: " + wdiMeta[indicator]["Indicator Name"] + "," + wdiMeta[indicator].Source + ", for the most recent year with data."

  exportCSVFile({ Country: "Country", Value: "Value" }, newIndicators, "indicator_data", note)

  $("#indicatorExport").val("export")

}) //download(filteredProjects); });









