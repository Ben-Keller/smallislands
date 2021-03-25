
let colors = [
    "#E5243B",
    "#DDA63A",
    "#4C9F38",
    "#C5192D",
    "#FF3A21",
    "#26BDE2",
    "#FCC30B",
    "#A21942",
    "#FD6925",
    "#DD1367",
    "#FD9D24",
    "#BF8B2E",
    "#3F7E44",
    "#0A97D9",
    "#56C02B",
    "#00689D",
    "#19486A"
]

var budgetDataFull = {};
projectData={}
budgetData={}



var projectDataFull = {};
  d3.csv('https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/undpProjectBars.csv', function(data) {
    projectDataFull[Object.values(data)[0]]=data
    delete projectDataFull[Object.values(data)[0]]["RegionYear"]
    

    

}).then(
    
    d3.csv('https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/undpBudgetBars.csv', function(data2) {
        budgetDataFull[Object.values(data2)[0]]=data2
        delete budgetDataFull[Object.values(data2)[0]]["RegionYear"]
 
  }).then(function(){

    
    budgetData=budgetDataFull["Global2012to2021"]
    projectData=projectDataFull["Global2012to2021"]
    console.log(projectData)
    console.log(projectDataFull)
    console.log(budgetData)
    console.log(budgetDataFull)
      renderBars();

  }
  ));


function renderBars(){

let barsMargin = {top: 60, right: 0, bottom: 0, left: 9};
let svgWidth = 1120, svgHeight = 200;
let barsHeight = svgHeight- barsMargin.top- barsMargin.bottom, barsWidth = svgWidth - barsMargin.left - barsMargin.right;
let sourceNames = [], sourceCount = [];

let x = d3.scaleBand().rangeRound([0, barsWidth]).padding(0.1),
    y = d3.scaleLinear().rangeRound([barsHeight, 0]);
for(let key in projectData){
    if(projectData.hasOwnProperty(key)){
        sourceNames.push(key);
        sourceCount.push(parseInt(projectData[key]));
    }
}
x.domain(sourceNames);
y.domain([0, d3.max(sourceCount, function(d) { return d; })]);

let svg = d3.select("#portfolioBars").append("svg");
svg.attr('height', svgHeight)
    .attr('width', svgWidth);

svg = svg.append("g")
         .attr("transform", "translate(" + barsMargin.left + "," + barsMargin.top + ")");

let sticks = svg.selectAll('.stick')
    .data(sourceNames)
    .enter()
    .append("g");

sticks.append('rect')
    .attr('class', 'stick')
    .attr("x", function(d) { return x(d)+ x.bandwidth()/10;;})//+ x2.bandwidth()/2.5+ x2.bandwidth()/6;})
    .attr("y", function(d) { return y(projectData[d])-22; })
    .attr("width", x.bandwidth()/25)
    .attr("height", function(d) { return 22; })
    .style("opacity",0.4);
        
// Create rectangles
let bars = svg.selectAll('.bar')
    .data(sourceNames)
    .enter()
    .append("g");

bars.append('rect')
    .attr('class', 'bar')
    .attr("x", function(d) { return x(d); })
    .attr("y", function(d) { return y(projectData[d]); })
    .attr("width", x.bandwidth()/4)
    .attr("height", function(d) { return barsHeight - y(projectData[d]); })
    .attr("fill",function(d,i){return colors[i]})
    
projectLabels=bars.append("text")
    .text(function(d) { 
        return projectData[d].toString().concat(" Projects");
    })
    .attr("x", function(d){
        return x(d) + x.bandwidth()/8;
    })
    .attr("y", function(d){
        return y(projectData[d]) - 24;
    })
    .attr("font-family" , "sans-serif")
    .attr("font-size" , "10px")
    .attr("fill" , "black")
    .attr("text-anchor", "middle");






let x2 = d3.scaleBand().rangeRound([0, barsWidth]).padding(0.1),
    y2 = d3.scaleLinear().rangeRound([barsHeight, 0]);

    let sourceNames2 = [], sourceCount2 = [];
for(let key in budgetData){
    if(budgetData.hasOwnProperty(key)){
        sourceNames2.push(key);
        sourceCount2.push(parseInt(budgetData[key]));
    }
}
x2.domain(sourceNames2);
y2.domain([0, d3.max(sourceCount2, function(d) { return d; })]);

let sticks2 = svg.selectAll('.stick2')
    .data(sourceNames2)
    .enter()
    .append("g");

sticks2.append('rect')
    .attr('class', 'stick2')
    .attr("x", function(d) { return x2(d)+ x2.bandwidth()/2.2+ x2.bandwidth()/10;})
    .attr("y", function(d) { return y2(budgetData[d])-8; })
    .attr("width", x2.bandwidth()/25)
    .attr("height", function(d) { return 8; })
    .style("opacity",0.4);
       
// Create rectangles
let bars2 = svg.selectAll('.bar2')
    .data(sourceNames2)
    .enter()
    .append("g");

bars2.append('rect')
    .attr('class', 'bar2')
    .attr("x", function(d) { return x2(d)+ x2.bandwidth()/2.3;})
    .attr("y", function(d) { return y2(budgetData[d]); })
    .attr("width", x2.bandwidth()/4)
    .attr("height", function(d) { return barsHeight - y2(budgetData[d]); })
    .attr("fill",function(d,i){return colors[i]})
    .style("opacity",0.5);

   
budgetLabels=bars2.append("text")
    .text(function(d) { 
        return  nFormatter(budgetData[d]).concat(" USD");
    })
    .attr("x", function(d){
        return x2(d) + x2.bandwidth()/8+ x2.bandwidth()/2.3;
    })
    .attr("y", function(d){
        return y2(budgetData[d]) - 10;
    })
    .attr("font-family" , "sans-serif")
    .attr("font-size" , "10px")
    .attr("fill" , "black")
    .attr("text-anchor", "middle");


    $('#goalSelect ul li').click(function() {
        var x = $(this);
         

        $('.goalShader').stop().animate({
           'width': x.width()+32,
           'left' : x.position().left
        }, 400);
    });
    
    $('#regionSelect ul li').click(function() {
        var x = $(this);

          $('.regionShader').stop().animate({
           'width': x.width()+32,
           'left' : x.position().left
        }, 400);

        $('.selectedRegion').removeClass('selectedRegion');     
      $(this).children('a').addClass('selectedRegion'); 
      console.log(this)
  
region=this.innerText
//zoom to new region
if(region=="Global"){
    $('#portfolioPanel').animate({
        'background-size':'95%',
        'background-position-x': '0%',
        'background-position-y': '-4%'
    },1800, function() { console.log('zoomed'); });
    $("#portfolio1").text("50");
$("#portfolio2").text("38");
}
else if(region=="Caribbean (RBLAC)"){
    $('#portfolioPanel').animate({
        'background-size':'135%',
        'background-position-x': '-60%',
        'background-position-y': '-120%'
    },1800, function() { console.log('zoomed'); });
    $("#portfolio1").text("25");
    $("#portfolio2").text("16");

}
else if(region=="AIS (RBA)"){
    $('#portfolioPanel').animate({
        'background-size':'125%',
        'background-position-x': '50%',
        'background-position-y': '-120%'
    },1600, function() { console.log('zoomed'); });
    $("#portfolio1").text("9");
$("#portfolio2").text("9");
}
else if(region=="Pacific (RBAP)"){
    $('#portfolioPanel').animate({
        'background-size':'130%',
        'background-position-x': '185%',
        'background-position-y': '-280%'
    },1600, function() { console.log('zoomed'); });
    $("#portfolio1").text("16");
$("#portfolio2").text("13");
}


year=document.getElementById("yearSelect").value

//region=$('.regionSelect').find("ul li a.selectedRegion").text();
region=$('.selectedRegion')[0].innerHTML.split(' ')[0]

regionYear=region.concat(year)

console.log(regionYear)

filterBudgetData=budgetDataFull[regionYear]
filterProjectData=projectDataFull[regionYear]

updateBars(filterBudgetData,filterProjectData)




});

  





$('#yearSelect').change(function() {
    var x = $(this);
 console.log('yeah!')
year=x.val();

//region=$('.regionSelect').find("ul li a.selectedRegion").text();
region=$('.selectedRegion')[0].innerHTML.split(' ')[0]

regionYear=region.concat(year)

console.log(regionYear)

filterBudgetData=budgetDataFull[regionYear]
filterProjectData=projectDataFull[regionYear]

updateBars(filterBudgetData,filterProjectData)


});





function updateBars(filterBudgetData,filterProjectData){
    
sourceCount = [];
for(let key in filterProjectData){
if(filterProjectData.hasOwnProperty(key)){
sourceCount.push(parseInt(filterProjectData[key]));
}
}

sourceCount2 = [];
for(let key2 in filterBudgetData){
if(filterBudgetData.hasOwnProperty(key2)){
sourceCount2.push(parseInt(filterBudgetData[key2]));
}
}

d3.selectAll(".bar")   // change the line
.data(filterProjectData)

d3.selectAll(".bar2")   // change the line
.data(filterBudgetData)

y.domain([0, d3.max(sourceCount, function(d) { return d; })]);

y2.domain([0, d3.max(sourceCount2, function(d) { return d; })]);

d3.selectAll(".bar") 
.transition()
.duration(750)  
.attr("height", function(d) { return barsHeight - y(filterProjectData[d]); })
.attr("y", function(d) { return y(filterProjectData[d]); })

d3.selectAll(".bar2") 
.transition()
.duration(750)  
.attr("height", function(d) { return barsHeight - y2(filterBudgetData[d]); })
.attr("y", function(d) { return y2(filterBudgetData[d]); })

projectLabels
.transition()
.duration(750) 
.attr("y", function(d){
    return y(filterProjectData[d]) - 24;
})
.text(function(d) { 
    return filterProjectData[d].toString().concat(" Projects");
})

budgetLabels
.transition()
.duration(750) 
.attr("y", function(d){
 return y2(filterBudgetData[d]) - 10;
})
.text(function(d) { 
     return nFormatter(filterBudgetData[d]).concat(" USD");
 })

   
d3.selectAll(".stick")
.transition()
.duration(750) 
.attr("y", function(d) { return y(filterProjectData[d])-22; })


d3.selectAll(".stick2")
.transition()
.duration(750) 
.attr("y", function(d) { return y2(filterBudgetData[d])-8; })

console.log("sumthis",filterBudgetData);

if(year=="2012to2021"){

if(region=="Global"){
    $("#portfolio3").text("1533");
}
if(region=="Caribbean"){
    $("#portfolio3").text("720");
}
if(region=="Pacific"){
    $("#portfolio3").text("327");
}
if(region=="AIS"){
    $("#portfolio3").text("464");
}

}

else{

$("#portfolio3").text((sum(filterProjectData)));

}
$("#portfolio4").text(nFormatter(sum(filterBudgetData)));
}




}

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
  
  function sum( obj ) {
    var sum = 0;
    for( var el in obj ) {
      if( obj.hasOwnProperty( el ) ) {
        sum += parseFloat( obj[el] );
      }
    }
    return sum;
  }