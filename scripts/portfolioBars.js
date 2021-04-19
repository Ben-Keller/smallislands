
let sdgColors = ["#E5243B", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21",
    "#26BDE2", "#FCC30B", "#A21942", "#FD6925", "#DD1367", "#FD9D24",
    "#BF8B2E", "#3F7E44", "#0A97D9", "#56C02B", "#00689D", "#19486A"
]

let samoaColors = ["#A21942", "#3F7E44", "#FCC30B", "#19486A", "#0A97D9",
    "#DDA63A", "#26BDE2", "#FD6925", "#BF8B2E", "#FD9D24", "#4C9F38",
    "#FF3A21", "#DD1367", "#0A97D9", "#00689D", "#00A99D", "#F4F5F8"
]

let ssColors = ["#E3253C", "#0076B0", "#F26A2C", "#417F45", "#FAB715",
    "#EF412C", "#F4F5F8", "#F4F5F8", "#F4F5F8", "#F4F5F8", "#F4F5F8",
    "#F4F5F8", "#F4F5F8", "#F4F5F8", "#F4F5F8", "#F4F5F8", "#F4F5F8"
]

sdgToSamoa = { 1: [1], 2: [6], 3: [11], 4: [12, 13], 5: [13], 6: [7], 7: [3], 8: [1], 9: [1, 8], 10: [12, 13], 11: [1, 4, 8, 10], 12: [9, 10], 13: [2, 4], 14: [5, 10, 14], 15: [10, 15], 16: [1, 13], 17: [16] }
samoaPriorities = ["Sustainable, inclusive and equitable economic growth", "Climate Change", "Sustainable Energy",
    "Disaster Risk Reduction", "Oceans and Seas", "Food Security and Nutrition", "Water and Sanitation", "Sustainable Transportation",
    "Sustainable Consumption and Production", "Chemical and Waste management", "Health and NCDs",
    "Gender Equality", "Social Development", "Biodiversity", "Invasive species", "Means of Implementation"]
ss = ["Keeping people out of poverty", "Strengthen effective, inclusive and accountable governance", "Enhance national prevention and recovery capacities for resilient societies", "Promote nature-based solutions for a sustainable planet", "Close the energy gap", "Strenghten gender equality and the empowerment of women and girls"]
sdgs = ["No poverty", "Zero hunger", "Good health and well-being", "Quality education", "Gender equality", "Clean water and sanitation", "Affordable and clean energy", "Decent work and economic growth", "Industry, innovation and infrastructure", "Reduced inequalities", "Sustainable cities and communities", "Responsible consumption and production", "Climate action", "Life below water", "Life on land", "Peace, justice, and strong institutions", "Partnerships for the goals"]
samoaDescriptions = ["DD Sustainable, inclusive and equitable economic growth", "DD Climate Change", "Sustainable Energy",
    "Disaster Risk Reduction", "Oceans and Seas", "Food Security and Nutrition", "Water and Sanitation", "Sustainable Transportation",
    "Sustainable Consumption and Production", "Chemical and Waste management", "Health and NCDs",
    "Gender Equality", "Social Development", "Biodiversity", "Invasive species", "Means of Implementation"]
$("#samoaIconRow").hide();
$("#SSIconRow").hide();

var oldHeight=0
selectedRegion="global"

fundingCategories=[]
Promise.all([
    d3.json("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/exports/fundingCategories.json"),
    d3.csv("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/sids_db.csv")
]).then(function (files) {
    //console.log("promises kept")
    // files[0] will contain file1.csv
    // files[1] will contain file2.csv
    //console.log("jsonnn", files[0])
fundingCategories.push(files[0])
fundingCategories=fundingCategories[0]
    renderBars(files[0], files[1]);

console.timeLog()
    // filteredData = files[1].filter(function (d) { return parseInt(d.year) == 2020 });
    // updatePieChart1(dataMap1(filteredData, files[2]));
    // updatePieChart1(dataMap1(filteredData, files[2]));

    // updatePieChart2(dataMap2(filteredData));
    // updatePieChart2(dataMap2(filteredData));
    // console.log(files[0])

}).catch(function (err) {
    // handle error here
})





function renderBars(fundingCategories, sidsDB) {



    dat = filterData()
    filterBudgetData = dat[0]
    filterProjectData = dat[1]
    //console.log(filterProjectData)

    filteredProjects = dat[2]

    initPieChart1(dataMap1(filteredProjects, fundingCategories));
    updatePieChart1(dataMap1(filteredProjects, fundingCategories));

    initPieChart2(dataMap2(filteredProjects))
    updatePieChart2(dataMap2(filteredProjects));


    var distinct = []
    var totalBudg = 0
    for (project in filteredProjects) {
        totalBudg += parseInt(filteredProjects[project].budget)
        if (!distinct.includes(filteredProjects[project].title)) {
            distinct.push(filteredProjects[project].title)
        }
    }

    $("#portfolio3").text(distinct.length)//(sum(filterProjectData)));
    //console.log("budg", totalBudg)
    $("#portfolio4").text(nFormatter(totalBudg, 1));

    let barsMargin = { top: 60, right: 0, bottom: 0, left: 19 };
    let svgWidth = 1120, svgHeight = 160;
    let barsHeight = svgHeight - barsMargin.top - barsMargin.bottom, barsWidth = svgWidth - barsMargin.left - barsMargin.right;
    let sourceNames = [], sourceCount = [];

    let x = d3.scaleBand().rangeRound([0, barsWidth]),//.padding(0.1),
        y = d3.scaleLinear().rangeRound([barsHeight, 0]);

   // console.log(x)
    for (let key in filterProjectData) {
        if (filterProjectData.hasOwnProperty(key)) {
            sourceNames.push(key);
            sourceCount.push(parseInt(filterProjectData[key]));
        }
    }
    x.domain(sourceNames);
    y.domain([0, d3.max(sourceCount, function (d) { return d; })]);

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
        .attr("x", function (d) { return x(d) + x.bandwidth() / 6; })//+ x2.bandwidth()/2.5+ x2.bandwidth()/6;})
        .attr("y", function (d) { return y(filterProjectData[d]) - 22; })
        .attr("width", x.bandwidth() / 25)
        .attr("height", 22)
        .style("opacity", 0.4);

    // Create rectangles
    let bars = svg.selectAll('.bar')
        .data(sourceNames)
        .enter()
        .append("g");

    // Create rectangles

    bars.append('rect')
        .attr('class', 'bar')
        .attr("x", function (d) { return x(d) + x.bandwidth() / 16; })
        .attr("y", function (d) { return y(filterProjectData[d]); })
        .attr("width", x.bandwidth() / 4)
        .attr("height", function (d) { return barsHeight - y(filterProjectData[d]); })
        .attr("fill", function (d, i) { return sdgColors[i] })



   

    let x2 = d3.scaleBand().rangeRound([0, barsWidth]),//.padding(0.1),
        y2 = d3.scaleLinear().rangeRound([barsHeight, 0]);

    let sourceNames2 = [], sourceCount2 = [];
    for (let key in filterBudgetData) {
        if (filterBudgetData.hasOwnProperty(key)) {
            sourceNames2.push(key);
            sourceCount2.push(parseInt(filterBudgetData[key]));
        }
    }

    x2.domain(sourceNames2);
    y2.domain([0, d3.max(sourceCount2, function (d) { return d; })]);

    let sticks2 = svg.selectAll('.stick2')
        .data(sourceNames2)
        .enter()
        .append("g");

    sticks2.append('rect')
        .attr('class', 'stick2')
        .attr("x", function (d) { return x2(d) + x2.bandwidth() / 2.2 + x2.bandwidth() / 10; })
        .attr("y", function (d) { return y2(filterBudgetData[d]) - 8; })
        .attr("width", x2.bandwidth() / 25)
        .attr("height", 8)
        .style("opacity", 0.4);

    // Create rectangles
    let bars2 = svg.selectAll('.bar2')
        .data(sourceNames2)
        .enter()
        .append("g");

    bars2.append('rect')
        .attr('class', 'bar2')
        .attr("x", function (d) { return x2(d) + x2.bandwidth() / 2.2; })
        .attr("y", function (d) { return y2(filterBudgetData[d]); })
        .attr("width", x2.bandwidth() / 4)
        .attr("height", function (d) { return barsHeight - y2(filterBudgetData[d]); })
        .attr("fill", function (d, i) { return sdgColors[i] })
        .style("opacity", 0.5);


    projectLabels = bars.append("text")
        .text(function (d) {
            return filterProjectData[d].toString().concat(" Projects");
        })
        .attr("x", function (d) {
            return x(d) + x.bandwidth() / 8;
        })
        .attr("y", function (d) {
            return y(filterProjectData[d]) - 24;
        })
        .attr("class", "barsLabels")
        .attr("text-anchor", "middle");

    budgetLabels = bars2.append("text")
        .text(function (d) {
            return nFormatter(filterBudgetData[d]).concat(" USD");
        })
        .attr("x", function (d) {
            return x2(d) + x2.bandwidth() / 8 + x2.bandwidth() / 2.3;
        })
        .attr("y", function (d) {
            return y2(filterBudgetData[d]) - 10;
        })
        .attr("class", "barsLabels")
        .attr("text-anchor", "middle");

    let hoverbars = svg.selectAll('.hoverbar')
        .data(sourceNames)
        .enter()
        .append("g");

    hoverbars.append('rect')
        .attr('class', 'hoverbar')
        .attr("x", function (d) { return x(d) - 6; })
        .attr("y", function (d) { return y(filterProjectData[d]) - 30; })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return barsHeight - y(filterProjectData[d]) + 30; })
        .attr("opacity", 0)




    $('#goalSelect ul li').click(function () {
        var x = $(this);

        $('.goalShader').stop().animate({
            'width': x.width() + 32,
            'left': x.position().left
        }, 400);

        $('.selectedGoal').removeClass('selectedGoal');
        $(this).children('a').addClass('selectedGoal');
       // console.log(this)



        selectedGoal = $('.selectedGoal')[0].innerHTML

        //console.log(selectedGoal)

        if (selectedGoal == "Sustainable Development Goals") {
            $("#samoaIconRow").fadeOut(50);
            $("#SSIconRow").fadeOut(50)
            setTimeout(function () { $("#sdgIconRow").fadeIn(150) }, 50);
        }
        else if (selectedGoal == "SAMOA Pathway") {
            $("#sdgIconRow").fadeOut(50)
            $("#SSIconRow").fadeOut(50)
            setTimeout(function () { $("#samoaIconRow").fadeIn(150) }, 50);
        }
        else if (selectedGoal == "Signature Solutions") {
            console.log("ssss")
            $("#sdgIconRow").fadeOut(50)
            $("#samoaIconRow").fadeOut(50)
            setTimeout(function () { $("#SSIconRow").fadeIn(150) }, 50);
        }
        console.timeLog()
        updateBars()

    });




regionClickMap={"global":{1:"caribbean",2:"global",3:"caribbean",4:"ais",5:"pacific"},
"caribbean":{1:"global",2:"global",3:"global",4:"caribbean",5:"ais"},
"ais":{1:"caribbean",2:"global",3:"caribbean",4:"ais",5:"pacific"},
"pacific":{1:"global",2:"global",3:"ais",4:"pacific",5:"global"}}



    $("#regionClick1").click(function() {      
        regionClick(1);
    })
    $("#regionClick2").click(function() {      
        regionClick(2);
    })
    $("#regionClick3").click(function() {      
        regionClick(3);
    })
    $("#regionClick4").click(function() {      
        regionClick(4);
    })
    $("#regionClick5").click(function() {      
        regionClick(5);
    })
    $("#regionClick6").click(function() {      
        regionClick(5);
    })

    $("#portfolioBars").click(function(event) { 

        if (event.target.nodeName=="svg"){

        regionClick(2);}
    })

   // $('#regionSelect ul li').click(
        


    newOptions = "<option value='All'>All Funding Sources</option>"
    for (fund in fundingCategories) {
        newOptions = newOptions + "<option value='" + fund + "'>" + fund + "</option>"

    }
    $("#fundingSelect").html(newOptions)

    sidsList = ["Antigua and Barbuda", "Aruba",
        "Bahrain", "Barbados", "Belize", "Cape Verde", "Comoros", "Cook Islands", "Cuba", "Dominica", "Dominican Republic",
        "Grenada", "Guinea-Bissau", "Guyana", "Haiti", "Jamaica", "Kiribati", "Maldives", "Marshall Islands",
        "Mauritius", "Micronesia", "Nauru", "Republic of Palau", "Papua New Guinea", "Samoa", "Sao Tome and Principe", "Seychelles",
        "Solomon Islands", "St. Kitts and Nevis", "St. Vincent and the Grenadines", "Saint Lucia", "Suriname", "Timor-Leste",
        "Trinidad and Tobago", "Tokelau", "Niue", "Tonga", "Puerto Rico", "Palau", "Tuvalu", "Vanuatu", "Cuba", "Bahamas", "Fiji", "Bermuda"]

    $('#fundingCategorySelect').change(function () {
        var fundingCategory = $(this).val();

        newOptions = "<option value='All'>All " + fundingCategory + "</option>"

        

        if (fundingCategory == "All") {
            newOptions = "<option value='All'>All Funding Sources</option>"
            for (fund in fundingCategories) {
                newOptions = newOptions + "<option value='" + fund + "'>" + fund + "</option>"
            }
        }
        else if (fundingCategory == "Programme Countries") {
            for (fund in fundingCategories) {
                if (fundingCategories[fund].category == "Government" && sidsList.includes(fundingCategories[fund].subCategory)) {
                    newOptions = newOptions + "<option value='" + fund + "'>" + fund + "</option>"
                }
            }
        }
        else if (fundingCategory == "Donor Countries") {
            for (fund in fundingCategories) {
                if (fundingCategories[fund].category == "Government") {
                    newOptions = newOptions + "<option value='" + fund + "'>" + fund + "</option>"
                }
            }
        }
        else {
            for (fund in fundingCategories) {
                if (fundingCategories[fund].category == fundingCategory) {
                    newOptions = newOptions + "<option value='" + fund + "'>" + fund + "</option>"
                }
            }

        }
        $("#fundingSelect").html(newOptions)
        updateBars();
    });




    $('#fundingSelect').change(function () {
        updateBars();
    });



    $('#yearSelect').change(function () {

        updateBars();




    });





    function filterData() {

        selectedYear = $("#yearSelect").val()
        selectedDonor = $("#fundingSelect").val()

        ///temp fix
        if (selectedDonor == null) {
            selectedDonor = "All"
        }

       // console.log(selectedRegion, selectedYear, selectedDonor)
        filteredProjects = sidsDB
        if (selectedDonor != "All") {
            filteredProjects = filteredProjects.filter(function (d) { return d.donors.split(";").includes(selectedDonor) });
        }
        else {
            selectedFundingCategory = $("#fundingCategorySelect").val();
            if (selectedFundingCategory != "All") {

                if (selectedFundingCategory == "Programme Countries" || selectedFundingCategory == "Donor Countries") {
                    filteredProjects = filteredProjects.filter(function (d) {

                        fundingCat = d.donors.split(";").map(donor => {
                            try {
                                if (d.country == fundingCategories[donor].subCategory) {
                                    return "Programme Countries"
                                }
                                else {
                                    return "Donor Countries"
                                }

                            }
                            catch (error) {
                                return;
                            }
                        });


                        ///this returns all government projects, not just programme governments. need to also check if project is in country of gov
                        if (selectedFundingCategory == "Donor Countries") {
                            return fundingCat.includes("Donor Countries")
                        }
                        if (selectedFundingCategory == "Programme Countries") {
                            return fundingCat.includes("Programme Countries")
                        }


                    });
                }
                else {



                    filteredProjects = filteredProjects.filter(function (d) {
                        fundingCat = d.donors.split(";").map(donor => {
                            try {
                                return fundingCategories[donor].category
                            }
                            catch (error) {
                                return;
                            }
                        });

                        return fundingCat.includes(selectedFundingCategory)
                    });
                }
            }
        }

        if (selectedYear != "2012to2021") {
            filteredProjects = filteredProjects.filter(function (d) { return d.year == selectedYear });
        }
        else {
            filteredProjects = filteredProjects.filter(function (d) { return Number.isInteger(parseInt(d.year)) });
        }
        if (selectedRegion != "global") {
            filteredProjects = filteredProjects.filter(function (d) {
                return d.region.toLowerCase() == selectedRegion
            });
        }

        //console.log(filteredProjects)
        filterBudgetData = {}
        filterProjectData = {}


        selectedGoal = $('.selectedGoal')[0].innerHTML



        if (selectedGoal == "Sustainable Development Goals") {
           // console.log("sdgsss")

            for (i = 0; i < 17; i++) {

                sdgFilteredProjects = filteredProjects.filter(function (d) {
                    return d.sdg.includes(sdgs[i])
                });

                totalBudget = 0


                for (project in sdgFilteredProjects) {
                    totalBudget = totalBudget + parseInt(sdgFilteredProjects[project].budget)
                }
                filterBudgetData["bar" + (i + 1).toString()] = totalBudget
                filterProjectData["bar" + (i + 1).toString()] = sdgFilteredProjects.length
            }

        }


        else if (selectedGoal == "Signature Solutions") {
           // console.log("solutions")

            for (i = 0; i < 6; i++) {

                ssFilteredProjects = filteredProjects.filter(function (d) {
                    return d.solution.includes(ss[i])
                });

                totalBudget = 0


                for (project in ssFilteredProjects) {
                    totalBudget = totalBudget + parseInt(ssFilteredProjects[project].budget)
                }
                filterBudgetData["bar" + (i + 1).toString()] = totalBudget
                filterProjectData["bar" + (i + 1).toString()] = ssFilteredProjects.length
            }

        }

        else if (selectedGoal == "SAMOA Pathway") {

           // console.log("samoaaaaa")

            filterBudgetData = {
                "bar1": 0, "bar2": 0, "bar3": 0, "bar4": 0, "bar5": 0, "bar6": 0, "bar7": 0, "bar8": 0, "bar9": 0, "bar10": 0, "bar11": 0,
                "bar12": 0, "bar13": 0, "bar14": 0, "bar15": 0, "bar16": 0, "bar17": 0
            }
            filterProjectData = {
                "bar1": 0, "bar2": 0, "bar3": 0, "bar4": 0, "bar5": 0, "bar6": 0, "bar7": 0, "bar8": 0, "bar9": 0, "bar10": 0, "bar11": 0,
                "bar12": 0, "bar13": 0, "bar14": 0, "bar15": 0, "bar16": 0, "bar17": 0
            }


            for (project in filteredProjects) {

                projectSdgs = filteredProjects[project].sdg.split(";")

                for (sdg in projectSdgs) {

                    sdgNum = sdgs.indexOf(projectSdgs[sdg]) + 1

                    priorities = sdgToSamoa[sdgNum]


                    for (priority in priorities) {

                        budget = filteredProjects[project].budget / priorities.length / projectSdgs.length;

                        filterBudgetData["bar" + priorities[priority].toString()] = filterBudgetData["bar" + priorities[priority].toString()] + budget
                        filterProjectData["bar" + priorities[priority].toString()] = filterProjectData["bar" + priorities[priority].toString()] + 1
                    }
                }
            }


        }

        // console.log(filterProjectData)
        // console.log(filterBudgetData)
        console.timeLog()
        return ([filterBudgetData, filterProjectData, filteredProjects]);
        
    }

$("#regionPie").click(function(){
    regionClick(7,pieChartRegion)
})

    
    function regionClick(regionClickBox,clickedRegion="none") {
    console.log(clickedRegion)
        if(clickedRegion!="none"){
            console.log(clickedRegion)
            selectedRegion=clickedRegion
        }
            else{
            selectedRegion=regionClickMap[selectedRegion][regionClickBox]}
            console.log(selectedRegion)
        if(selectedRegion=="global"){
            updatePortfolioBackground("")
        }else{
            updatePortfolioBackground(selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1))
        }
                zoomToRegion(selectedRegion)
                updateBars()
            }
        
        
            function updatePortfolioBackground(region) {
                img = 'graphics/sidsMapNewest' + region + '-01.png'
                var img_tag = new Image();
                // when preload is complete, apply the image to the div
                img_tag.onload = function () {
                    document.querySelector('#portfolioPanel').style.backgroundImage = 'url(' + img + ')';
                }
                // setting 'src' actually starts the preload
                img_tag.src = img;
            }

    function updateBars() {
        console.timeLog()
        dat = filterData()
     //   console.log(dat)

        filterBudgetData = dat[0]
        filterProjectData = dat[1]
        filteredProjects = dat[2]

        sourceNames=[]
        sourceCount = [];
        for (let key in filterProjectData) {
            if (filterProjectData.hasOwnProperty(key)) {
                sourceCount.push(parseInt(filterProjectData[key]));
                sourceNames.push(key)
            }
        }


        sourceCount2 = [];
        for (let key2 in filterBudgetData) {
            if (filterBudgetData.hasOwnProperty(key2)) {
                sourceCount2.push(parseInt(filterBudgetData[key2]));
            }
        }

        d3.selectAll(".bar")   // change the line
            .data(filterProjectData)

        d3.selectAll(".bar2")   // change the line
            .data(filterBudgetData)

        y.domain([0, d3.max(sourceCount, function (d) { return d; })]);

        y2.domain([0, d3.max(sourceCount2, function (d) { return d; })]);


        if (selectedGoal == "SAMOA Pathway") {
            colors = samoaColors
            bins = 16
            xOffset = 0
        } else if (selectedGoal == "Sustainable Development Goals") {
            bins = 17
            xOffset = 0
            colors = sdgColors
        }
        else if (selectedGoal == "Signature Solutions") {
            xOffset = 45
            bins = 6
            colors = ssColors
        }



        d3.selectAll(".bar")
            .transition()
            .duration(750)
            .attr("height", function (d, i) {
                if (i < bins) {
                    return barsHeight - y(filterProjectData[d]);
                }
                else { return 0 }
            })
            .attr("y", function (d, i) {
                if (i < bins) {
                    return y(filterProjectData[d]);
                }
                else { return 0 }
            })
            .attr("x", function (d) { return x(d) * 17 / bins + x.bandwidth() / 16 + xOffset; })
            .attr("fill", function (d, i) { return colors[i] })

        d3.selectAll(".bar2")
            .transition()
            .duration(750)
            .attr("height", function (d, i) {
                if (i < bins) {
                    return barsHeight - y2(filterBudgetData[d]);
                }
                else { return 0 }
            })
            .attr("y", function (d, i) {
                if (i < bins) {
                    return y2(filterBudgetData[d]);
                }
                else { return 0 }
            })
            .attr("x", function (d) { return x2(d) * 17 / bins + x.bandwidth() / 2.2 + xOffset * 1.1; })
            .attr("fill", function (d, i) { return colors[i] })

        d3.selectAll(".stick")
            .transition()
            .duration(750)
            .attr("x", function (d) { return x(d) * 17 / bins + x.bandwidth() / 6 + xOffset; })
            .attr("y", function (d, i) {return barLabelsHeight(d, i,"proj")+2;
            })
            .attr("height", function (d, i) {
                    val=y(filterProjectData[d])-barLabelsHeight(d, i,"proj")-2
                    if (filterProjectData[d] > 0) { return val  }
                    else{return 0}
            })

        d3.selectAll(".stick2")
            .transition()
            .duration(750)
            .attr("x", function (d) { return x2(d) * 17 / bins + x2.bandwidth() / 2.2 + x2.bandwidth() / 10 + xOffset * 1.1; })
            .attr("y", function (d, i) { return barLabelsHeight(d, i,"budg")+2;
            })
            .attr("height", function (d, i) {
val= y2(filterBudgetData[d])-barLabelsHeight(d, i,"budg")-2
                     if (filterProjectData[d] > 0) { return val}
                    else{return 0}
            })

        selectedGoal = $('.selectedGoal')[0].innerHTML
     
        d3.selectAll('.hoverbar')
        .transition()
        .duration(750)
            .attr("height", function (d) { 
                if(y(filterProjectData[d])==100||selectedGoal=="Signature Solutions"||selectedGoal=="SAMOA Pathway"){
                    return 0;
                }
            j= barsHeight - y(filterProjectData[d]) + 30; 
        return j})
        .attr("y", function (d) { return y(filterProjectData[d]) - 30; })



        function barLabelsHeight(d, i,type) {

            if(i==0){
                oldHeight=-20
            }
                           
                            offset=0
                // console.log(oldHeight)

                //to help it choose, with project normally preferred on top unless the previous bar is in conflict
                projectPref=3
                if(Math.abs((100 - y(filterProjectData[d])+20)-oldHeight)<10){
                    projectPref=-3
                }

            if (i < bins) {
                b=100 - y2(filterBudgetData[d])
                p=100 - y(filterProjectData[d])
                
                if(p-b>=12){
                    projVal = p + 10
                    budgVal = b + 10
                }
                else if(p>=b-projectPref && p-b<12){
                    projVal = p + 20
                    budgVal = p + 8
                }
                else if(b>=p+projectPref && b-p<12){
                    projVal = b + 8
                    budgVal = b + 20
                }
                else if(b-p>=12){
                    projVal = p +10
                    budgVal = b + 10
                }


                if(oldHeight>=projVal && oldHeight-projVal<10 ){
                    offset=10+oldHeight-projVal
                }
                else if(projVal>oldHeight && projVal-oldHeight<10){
                        offset=10-projVal+oldHeight
                }

               
                oldHeight=budgVal+offset

if(selectedGoal = $('.selectedGoal')[0].innerHTML=="Signature Solutions"){oldHeight=-20}

if(type=="budg"){return  100-budgVal-offset}
else if(type=="proj"){return 100-projVal-offset}
                
            }

            else {
                oldHeight=-20
                return 0
            }
        }

        projectLabels
            .transition()
            .duration(750)
            .attr("y", function (d, i) {
                return barLabelsHeight(d, i,"proj");
            })
            .text(function (d, i) {
                if (i < bins) {
                    if (filterProjectData[d] > 0) {
                        return filterProjectData[d].toString().concat(" Projects");
                    }
                    else { return "" }
                }
                else {
                    return "";
                }
            })
            .attr("x", function (d) {
                return x(d) * 17 / bins + x.bandwidth() / 8 + xOffset;
            })

        budgetLabels
            .transition()
            .duration(750)
            .attr("y", function (d, i) {
                return barLabelsHeight(d, i,"budg");
            })
            .text(function (d, i) {
                if (i < bins) {
                    if (filterBudgetData[d] > 0) {
                        return nFormatter(filterBudgetData[d]).concat(" USD");
                    }
                    else { return "" }
                }
                else {
                    return ""
                }
            })
            .attr("x", function (d) {
                return x2(d) * 17 / bins + x2.bandwidth() / 8 + x2.bandwidth() / 2.3 + xOffset * 1.1;
            })



        year = document.getElementById("yearSelect").value
      


        var distinctProjects = []
        var distinctCountries = []
        var totalBudg = 0
        for (project in filteredProjects) {
            totalBudg += parseInt(filteredProjects[project].budget)
            if (!distinctProjects.includes(filteredProjects[project].title)) {
                distinctProjects.push(filteredProjects[project].title)
            }
            if (!distinctCountries.includes(filteredProjects[project].country)) {
                distinctCountries.push(filteredProjects[project].country)
            }
        }



        $("#portfolio1").text(distinctCountries.length)//(sum(filterProjectData)));
        $("#portfolio3").text(distinctProjects.length)//(sum(filterProjectData)));
        //console.log("budg", totalBudg)
        $("#portfolio4").text(nFormatter(totalBudg, 1));
        // }

        ///update Pie1

        year = $("#yearSelect").val()


        updatePieChart1(dataMap1(filteredProjects, fundingCategories));
        updatePieChart2(dataMap2(filteredProjects, fundingCategories));

        updateProjectTooltips(filteredProjects)

    }




    function sum(obj) {
        var sum = 0;
        for (var el in obj) {
            if (obj.hasOwnProperty(el)) {
                sum += parseFloat(obj[el]);
            }
        }
        return sum;
    }



    initProjectTooltips()
    updateProjectTooltips(filteredProjects)


    updateBars()











    


}

// $(function() { 
//     $("#btnSave").click(function() { 
//         console.log($("#portfolioExport")[0])
//         html2canvas($("#portfolioPanel")[0]).then((canvas)=>{
//                 console.log("jim")
//                 theCanvas = canvas;
//                 document.body.appendChild(canvas);

//                 canvas.toBlob(function(blob) {
// 					saveAs(blob, "Dashboard.png"); 
// 				});
//         });
//     });
// }); 





function zoomToRegion(region) {

    if (region == "global") {

        $('#portfolioPanel').animate({
            'background-size': '100%',
            'background-position-x': '0%',
            'background-position-y': '-40px'
        }, 1500, function () { console.log('zoomed'); });
        //$("#portfolio1").text("50");
        $("#portfolio2").text("38");
    }

    if (region == "caribbean") {
        $('#portfolioPanel').animate({
            'background-size': '144%',
            'background-position-x': '-35%',
            'background-position-y': '-60px'
        }, 1500, function () { console.log('zoomed'); });
        //$("#portfolio1").text("25");
        $("#portfolio2").text("16");

    }
    else if (region == "ais") {
        $('#portfolioPanel').animate({
            'background-size': '125%',
            'background-position-x': '50%',
            'background-position-y': '-100px'
        }, 1600, function () { console.log('zoomed'); });
        //$("#portfolio1").text("9");
        $("#portfolio2").text("9");
    }
    else if (region == "pacific") {
        $('#portfolioPanel').animate({
            'background-size': '130%',
            'background-position-x': '210%',
            'background-position-y': '-140px'
        }, 1600, function () { console.log('zoomed'); });
        //$("#portfolio1").text("16");
        $("#portfolio2").text("13");
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


// wheelzoom(document.querySelector('img#portfolioPanel'));

//$("#portfolioPanel").backgroundDraggable();

function updateProjectTooltips(filteredProjects) {
    const projectTooltips = $(".projectTooltip")
        .each(function (index) {
            
            sdgFilteredProjects = filteredProjects.filter(function (d) {

                return d.sdg.includes(sdgs[index])
            });


            projectList = ""

            for (project in sdgFilteredProjects) {
                projectList += '<div class="projectTooltipColumn col-lg-8">'+"<b>" + (parseInt(project) + 1).toString() + ") </b>" + sdgFilteredProjects[project].title 
              +"</div>"+'<div class="projectTooltipColumn col-lg-2">'+ 
              sdgFilteredProjects[project].country
              +'</div><div class="projectTooltipColumn col-lg-2">'+ 
              nFormatter(sdgFilteredProjects[project].budget,1)
              +"</div>"
            }

           tooltipHeader='<div><h4 style="color:#0DB14B; padding-left:15px">' +  "SDG " + (index+1) + " - " + sdgs[index] + '</h4></div>'+'<div class="col-lg-8">' +'Project Title'+ '</div>'+
           '<div class="col-lg-2"><h6>Country</h6></div><div class="col-lg-2"><h6>Budget</h6></div>'
            $('#jjtooltipProject' + (index).toString()).html('<div class="row">'+ tooltipHeader+projectList +"</div>" )

        });
}


function initProjectTooltips() {
    const bars = $(".hoverbar")

    //console.log("bars", bars)

    bars.each(function (index) {
        //console.log("bars", index)
        tooltipTitle = "Projects";
        secondLine = sdgs[index]
        thirdLine = "Project 2"

        $('#projectTooltips').append('<div class="projectTooltip tooltips" id="tooltipProject' +
            (index).toString() + '" role="tooltip"><div class="jjprojectTooltip" id="jjtooltipProject' +
            (index).toString() + '"><h4 style="color:#0DB14B">'
            + tooltipTitle + '</h4><h6 id="tooltipStat">' + secondLine + '</h6><h6>'
            + thirdLine + '</h6></div><div class="arrow" data-popper-arrow></div></div>')
        // console.log(index+": yo");
    });

    const projectTooltips = $(".projectTooltip")
        .each(function (index) {
            //console.log(index+": tt");
        });

    //console.log(tooltips)

    projectPopperInstance = new Array();

    for (i = 0; i < bars.length; i++) {
        projectPopperInstance[i] = Popper.createPopper(bars[i], projectTooltips[i],
            {
                placement: 'right',
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 0],
                        },
                    },],
            });
    }

    function hide() {
        //map to all
        for (j = 0; j < bars.length; j++) {
            projectTooltips[j].removeAttribute('data-show');
        }
    }

    function hovered(j) {

        projectTooltips[j].setAttribute('data-show', '');
        projectPopperInstance[j].update();;
    }

    const showEvents = ['mouseenter', 'focus'];
    const hideEvents = ['mouseleave', 'blur'];

    showEvents.forEach(event => {
        for (j = 0; j < bars.length; j++) {

            bars[j].addEventListener(event, hovered.bind(null, j));
            projectTooltips[j].addEventListener(event, hovered.bind(null, j));
        }
    });



    hideEvents.forEach(event => {
        //map to all?
        for (j = 0; j < bars.length; j++) {
            //    console.log("i",j)
            bars[j].addEventListener(event, hide);
            projectTooltips[j].addEventListener(event, hide);
        }
    });

}



var portfolioHeaders = {
    id: 'Project ID',////.replace(/,/g, ''), // remove commas to avoid errors
    country: "Country",
    region: "Region",
    year: "Year",
    title: "Project Title",
    budget: "Budget (USD)",
    expense: "Expense (USD)",
    sdg: "SDGs",
    solution: "Signature Solution",
    donors: "Funding Sources",
};


var summaryHeaders = {
    category: 'Category',////.replace(/,/g, ''), // remove commas to avoid errors
    budget: "Total Budget (USD)",
    projects: "Number of Projects",
    countries:"SIDS with UNDP Projects",
    type: "Donor or Recipient"
};



$("#portfolioExport").change(function () {

summaryexport =summaryExportRender(filteredProjects, fundingCategories)
//console.log(summaryExport)
    //console.log(filteredProjects);
    if ($("#portfolioExport").val() == "projects") {
        note="This dataset is the list of UNDP projects filtered by the "+ selectedRegion +" region, the year(s) " + selectedYear+", and the funding category "+selectedFundingCategory+". All data is used with permission from the UNDP open data portal."
        exportCSVFile(portfolioHeaders, filteredProjects, 'sids_projects_' + selectedRegion + "_" + selectedYear,note ) 
    }
    else if ($("#portfolioExport").val() == "summary") {
        note="This dataset is the compiled budget and project totals per category for all UNDP projects filtered by the "+ selectedRegion +" region, the year(s) " + selectedYear+", and the funding category "+selectedFundingCategory+". All data is used with permission from the UNDP open data portal."

        exportCSVFile(summaryHeaders, summaryExport, 'sids_summary_' + selectedRegion + "_" + selectedYear, note) 
    }
    $("#portfolioExport").val("export");
})

initSamoaTooltips()

function initSamoaTooltips() {
    const samoas = $(".samoaIcon")

    samoas.each(function (index) {
        tooltipTitle = "Projects";
        secondLine = samoaDescriptions[index]
        thirdLine = "Project 2"

        $('#samoaTooltips').append('<div class="samoaTooltip tooltips" id="tooltipSamoa' +
            (index).toString() + '" role="tooltip"><div class="jjsamoaTooltip" id="jjtooltipSamoa' +
            (index).toString() + '"><h4 style="color:#0DB14B">'
            + tooltipTitle + '</h4><h6 id="tooltipStat">' + secondLine + '</h6><h6>'
            + thirdLine + '</h6></div><div class="arrow" data-popper-arrow></div></div>')
        // console.log(index+": yo");
    });

    const samoaTooltips = $(".samoaTooltip")
        .each(function (index) {
            //console.log(index+": tt");
        });

    //console.log(tooltips)

    samoaPopperInstance = new Array();

    for (i = 0; i < samoas.length; i++) {
        samoaPopperInstance[i] = Popper.createPopper(samoas[i], samoaTooltips[i],
            {
                placement: 'right',
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 0],
                        },
                    },],
            });
    }

    function hide() {
        //map to all
        for (j = 0; j < samoas.length; j++) {
            samoaTooltips[j].removeAttribute('data-show');
        }
    }

    function hovered(j) {

        samoaTooltips[j].setAttribute('data-show', '');
        samoaPopperInstance[j].update();;
    }

    const showEvents = ['mouseenter', 'focus'];
    const hideEvents = ['mouseleave', 'blur'];

    showEvents.forEach(event => {
        for (j = 0; j < samoas.length; j++) {
            samoas[j].addEventListener(event, hovered.bind(null, j));
            samoaTooltips[j].addEventListener(event, hovered.bind(null, j));
        }
    });



    hideEvents.forEach(event => {
        //map to all?
        for (j = 0; j < samoas.length; j++) {
            //    console.log("i",j)
            samoas[j].addEventListener(event, hide);
            samoaTooltips[j].addEventListener(event, hide);
        }
    });

}


function summaryExportRender(filteredData, fundingCategories) {

  

    summaryExport = []

    //add rows for total, 
    var distinctProjects = []
    var distinctCountries = []
    var totalBudg = 0
    for (project in filteredProjects) {
        totalBudg += parseInt(filteredProjects[project].budget)
        if (!distinctProjects.includes(filteredProjects[project].title)) {
            distinctProjects.push(filteredProjects[project].title)
        }
        if (!distinctCountries.includes(filteredProjects[project].country)) {
            distinctCountries.push(filteredProjects[project].country)
        }
    }
    newEl={}
    newEl["category"]="Total"
    newEl["budget"]=totalBudg
    newEl["projects"]=distinctProjects.length
    newEl["countries"]=distinctCountries.length//join(';')
    newEl["type"]="Recipient"

    summaryExport.push(newEl)

    // by recipient region,
    regions=["Caribbean","Pacific","AIS"]
    for (region in regions){
        var distinctProjects = []
        var totalBudg = 0
        for (project in filteredProjects.filter(function (d) { return d.region == regions[region]})){
            totalBudg += parseInt(filteredProjects[project].budget)
            if (!distinctProjects.includes(filteredProjects[project].title)) {
                distinctProjects.push(filteredProjects[project].title)
            }
        }
        newEl={}
        newEl["category"]=regions[region]
        newEl["budget"]=totalBudg
        newEl["projects"]=distinctProjects.length
        newEl["countries"]=1//join(';')
        newEl["type"]="Recipient"
    
        summaryExport.push(newEl)
        }


    //by recipient country, 
    for (country in distinctCountries){
    var distinctProjects = []
    var totalBudg = 0
    for (project in filteredProjects.filter(function (d) { return d.country == distinctCountries[country]})){
        totalBudg += parseInt(filteredProjects[project].budget)
        if (!distinctProjects.includes(filteredProjects[project].title)) {
            distinctProjects.push(filteredProjects[project].title)
        }
    }
    newEl={}
    newEl["category"]=distinctCountries[country]
    newEl["budget"]=totalBudg
    newEl["projects"]=distinctProjects.length
    newEl["countries"]=1//join(';')
    newEl["type"]="Recipient"

    summaryExport.push(newEl)
    }
    
    //by funding category, 
    fundingCat=["European Union", "Donor Countries", "Programme Countries", "UN Agencies", "UN Pooled Funds", "Vertical Funds", "Other"]
    for (fundCat in fundingCat){
        label=fundingCat[fundCat]
        var distinctProjects = []
        var distinctCountries = []
        var totalBudg = 0
        for (project in filteredProjects) {
			donors = filteredProjects[project]["donors"].split(';');//["budget"])
			for (donor in donors) {
				try {
					category = fundingCategories[donors[donor]].category;

					if (label == "Programme Countries") {
						if (category == "Government" && fundingCategories[donors[donor]].subCategory == filteredProjects[project].country) {
							budget = parseInt(filteredProjects[project]["budget"]) / donors.length
							totalBudg+= budget
                            if (!distinctProjects.includes(filteredProjects[project].title)) {
                                distinctProjects.push(filteredProjects[project].title)
                            }
                            if (!distinctCountries.includes(filteredProjects[project].country)) {
                                distinctCountries.push(filteredProjects[project].country)
                            }
						}
					}

					else if (label == "Donor Countries") {
						if (category == "Government" && fundingCategories[donors[donor]].subCategory != filteredProjects[project].country) {
							budget = parseInt(filteredProjects[project]["budget"]) / donors.length
							totalBudg+= budget
						}
                        if (!distinctProjects.includes(filteredProjects[project].title)) {
                            distinctProjects.push(filteredProjects[project].title)
                        }
                        if (!distinctCountries.includes(filteredProjects[project].country)) {
                            distinctCountries.push(filteredProjects[project].country)
                        }
					}

					else if (category == label) {
						budget = parseInt(filteredProjects[project]["budget"]) / donors.length
						totalBudg+= budget
                        if (!distinctProjects.includes(filteredProjects[project].title)) {
                            distinctProjects.push(filteredProjects[project].title)
                        }
                        if (!distinctCountries.includes(filteredProjects[project].country)) {
                            distinctCountries.push(filteredProjects[project].country)
                        }
					}
				}
				catch (error) {
					// console.log("no category");
				}
			}
		}
        newEl={}
        newEl["category"]=label
        newEl["budget"]=totalBudg
        newEl["projects"]=distinctProjects.length
        newEl["countries"]=distinctCountries.length
        newEl["type"]="Donor"
    
        summaryExport.push(newEl)
        }
        
        
    //by sdg, 
    
    for (sdg in sdgs){
        var distinctProjects = []
        var totalBudg = 0
        for (project in filteredProjects.filter(function (d) { return d.sdg.includes(sdgs[sdg])})){
            totalBudg += parseInt(filteredProjects[project].budget)
            if (!distinctProjects.includes(filteredProjects[project].title)) {
                distinctProjects.push(filteredProjects[project].title)
            }
        }
        newEl={}
        newEl["category"]="SDG "+(parseInt(sdg)+1)+": "+sdgs[sdg]
        newEl["budget"]=totalBudg
        newEl["projects"]=distinctProjects.length
        newEl["countries"]=1//join(';')
        newEl["type"]="Recipient"
    
        summaryExport.push(newEl)
        }

    // //by samoa pathway, 
    
    // for (samoa in samoaPriorities){
    //     var distinctProjects = []
    //     var totalBudg = 0
    //     for (project in filteredProjects.filter(function (d) { 
    //         //sdgToSamoa[
    //             console.log(d.sdg.split(';'))
    //         return 0;})){
    //     //].includes(samoaPriorities[samoa])})){
    //         totalBudg += parseInt(filteredProjects[project].budget)
    //         if (!distinctProjects.includes(filteredProjects[project].title)) {
    //             distinctProjects.push(filteredProjects[project].title)
    //         }
    //     }
    //     newEl={}
    //     newEl["category"]="SAMOA Priority "+(parseInt(samoa)+1)+": "+samoaPriorities[samoa]
    //     newEl["budget"]=totalBudg
    //     newEl["projects"]=distinctProjects.length
    //     newEl["countries"]=1//join(';')
    //     newEl["type"]="Recipient"
    
    //     summaryExport.push(newEl)
    //     }
    
    //by signature solution

    for (ssss in ss){
        var distinctProjects = []
        var totalBudg = 0
        for (project in filteredProjects.filter(function (d) { return d.solution.includes(ss[ssss])})){
            totalBudg += parseInt(filteredProjects[project].budget)
            if (!distinctProjects.includes(filteredProjects[project].title)) {
                distinctProjects.push(filteredProjects[project].title)
            }
        }
        newEl={}
        newEl["category"]="Signature Solution "+(parseInt(ssss)+1)+": "+ss[ssss]
        newEl["budget"]=totalBudg
        newEl["projects"]=distinctProjects.length
        newEl["countries"]=1//join(';')
        newEl["type"]="Recipient"
    
        summaryExport.push(newEl)
        }



   return summaryExport;
}