
let sdgColors = [ "#E5243B", "#DDA63A",  "#4C9F38",  "#C5192D",  "#FF3A21",
    "#26BDE2",  "#FCC30B",  "#A21942",  "#FD6925",  "#DD1367",  "#FD9D24",
    "#BF8B2E",  "#3F7E44",  "#0A97D9",  "#56C02B",  "#00689D",  "#19486A"
]

let samoaColors = [ "#A21942", "#3F7E44",  "#FCC30B",  "#19486A",  "#0A97D9",
    "#DDA63A",  "#26BDE2",  "#FD6925",  "#BF8B2E",  "#FD9D24",  "#4C9F38",
    "#FF3A21",  "#DD1367",  "#0A97D9",  "#00689D",  "#00A99D",  "#F4F5F8"
]

let ssColors = [ "#E3253C", "#0076B0",  "#F26A2C",  "#417F45",  "#FAB715",
    "#EF412C",  "#F4F5F8",  "#F4F5F8",  "#F4F5F8",  "#F4F5F8",  "#F4F5F8",
    "#F4F5F8",  "#F4F5F8",  "#F4F5F8",  "#F4F5F8",  "#F4F5F8",  "#F4F5F8"
]

sdgToSamoa = { 1: [1], 2: [6], 3: [11], 4: [12, 13], 5: [13], 6: [7], 7: [3], 8: [1], 9: [1, 8], 10: [12, 13], 11: [1, 4, 8, 10], 12: [9, 10], 13: [2, 4], 14: [5, 10, 14], 15: [10, 15], 16: [1, 13], 17: [16] }
samoaPriorities = ["Sustainable, inclusive and equitable economic growth", "Climate Change", "Sustainable Energy",
    "Disaster Risk Reduction", "Oceans and Seas", "Food Security and Nutrition", "Water and Sanitation", "Sustainable Transportation",
    "Sustainable Consumption and Production", "Chemical and Waste management", "Health and NCDs",
    "Gender Equality", "Social Development", "Biodiversity", "Invasive species", "Means of Implementation"]
    ss=["Keeping people out of poverty","Strengthen effective, inclusive and accountable governance","Enhance national prevention and recovery capacities for resilient societies","Promote nature-based solutions for a sustainable planet","Close the energy gap","Strenghten gender equality and the empowerment of women and girls"]
sdgs = ["No poverty", "Zero hunger", "Good health and well-being", "Quality education", "Gender equality", "Clean water and sanitation", "Affordable and clean energy", "Decent work and economic growth", "Industry, innovation and infrastructure", "Reduced inequalities", "Sustainable cities and communities", "Responsible consumption and production", "Climate action", "Life below water", "Life on land", "Peace, justice, and strong institutions", "Partnerships for the goals"]

$("#samoaIconRow").hide();
$("#SSIconRow").hide();

var budgetDataFull = {};
projectData = {}
budgetData = {}

var projectDataFull = {};

Promise.all([
    d3.json("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/exports/fundingCategories.json"),
    d3.csv("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/sids_db.csv")
]).then(function (files) {
    console.log("promises kept")
    // files[0] will contain file1.csv
    // files[1] will contain file2.csv
    console.log("jsonnn", files[0])

    renderBars(files[0], files[1]);


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
    console.log(filterProjectData)

    filteredProjects = dat[2]
   
    initPieChart1(dataMap1(filteredProjects, fundingCategories));
    updatePieChart1(dataMap1(filteredProjects,fundingCategories));
       
    initPieChart2(dataMap2(filteredProjects))
    updatePieChart2(dataMap2(filteredProjects));


    var distinct = []
    var totalBudg=0
    for (project in filteredProjects){
        totalBudg+=parseInt(filteredProjects[project].budget)
       if (!distinct.includes(filteredProjects[project].title)){
          distinct.push(filteredProjects[project].title)}}

    $("#portfolio3").text(distinct.length)//(sum(filterProjectData)));
console.log("budg",totalBudg)
    $("#portfolio4").text(nFormatter(totalBudg,1));

    let barsMargin = { top: 60, right: 0, bottom: 0, left: 19 };
    let svgWidth = 1120, svgHeight = 200;
    let barsHeight = svgHeight - barsMargin.top - barsMargin.bottom, barsWidth = svgWidth - barsMargin.left - barsMargin.right;
    let sourceNames = [], sourceCount = [];

    let x = d3.scaleBand().rangeRound([0, barsWidth]),//.padding(0.1),
        y = d3.scaleLinear().rangeRound([barsHeight, 0]);
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

    bars.append('rect')
        .attr('class', 'bar')
        .attr("x", function (d) { return x(d) + x.bandwidth() / 16; })
        .attr("y", function (d) { return y(filterProjectData[d]); })
        .attr("width", x.bandwidth() / 4)
        .attr("height", function (d) { return barsHeight - y(filterProjectData[d]); })
        .attr("fill", function (d, i) { return sdgColors[i] })

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
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "black")
        .attr("text-anchor", "middle");

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
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "black")
        .attr("text-anchor", "middle");


        



    $('#goalSelect ul li').click(function () {
        var x = $(this);

        $('.goalShader').stop().animate({
            'width': x.width() + 32,
            'left': x.position().left
        }, 400);

        $('.selectedGoal').removeClass('selectedGoal');
        $(this).children('a').addClass('selectedGoal');
        console.log(this)

        

        selectedGoal = $('.selectedGoal')[0].innerHTML

        console.log(selectedGoal)

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
        else if (selectedGoal == "UNDP Signature Solutions") {
            console.log("ssss")
            $("#sdgIconRow").fadeOut(50)
            $("#samoaIconRow").fadeOut(50)
            setTimeout(function () { $("#SSIconRow").fadeIn(150) }, 50);
        }

        updateBars()

    });

    $('#regionSelect ul li').click(function () {



        var x = $(this);

        $('.regionShader').stop().animate({
            'width': x.width() + 32,
            'left': x.position().left
        }, 400);

        $('.selectedRegion').removeClass('selectedRegion');
        $(this).children('a').addClass('selectedRegion');
        console.log(this)

        region = this.innerText
        //zoom to new region
        if (region == "Global") {
            $('#portfolioPanel').animate({
                'background-size': '95%',
                'background-position-x': '0%',
                'background-position-y': '-4%'
            }, 1800, function () { console.log('zoomed'); });
            $("#portfolio1").text("50");
            $("#portfolio2").text("38");
        }
        else if (region == "Caribbean (RBLAC)") {
            $('#portfolioPanel').animate({
                'background-size': '135%',
                'background-position-x': '-60%',
                'background-position-y': '-10%'
            }, 1800, function () { console.log('zoomed'); });
            $("#portfolio1").text("25");
            $("#portfolio2").text("16");

        }
        else if (region == "AIS (RBA)") {
            $('#portfolioPanel').animate({
                'background-size': '125%',
                'background-position-x': '50%',
                'background-position-y': '-50%'
            }, 1600, function () { console.log('zoomed'); });
            $("#portfolio1").text("9");
            $("#portfolio2").text("9");
        }
        else if (region == "Pacific (RBAP)") {
            $('#portfolioPanel').animate({
                'background-size': '130%',
                'background-position-x': '200%',
                'background-position-y': '-80%'
            }, 1600, function () { console.log('zoomed'); });
            $("#portfolio1").text("16");
            $("#portfolio2").text("13");
        }

        updateBars()
        

    });

    newOptions = "<option value='All'>All Funding Sources</option>"
    for (fund in fundingCategories) {
        newOptions = newOptions + "<option value='" + fund + "'>" + fund + "</option>"

    }
    $("#fundingSelect").html(newOptions)

sidsList=["Antigua and Barbuda",    "Aruba",
    "Bahrain",    "Barbados",    "Belize",    "Cape Verde",    "Comoros",    "Cook Islands",    "Cuba",    "Dominica",    "Dominican Republic",
    "Grenada",    "Guinea-Bissau",    "Guyana",    "Haiti",    "Jamaica",    "Kiribati",    "Maldives",    "Marshall Islands",
    "Mauritius",    "Micronesia",    "Nauru",    "Republic of Palau",    "Papua New Guinea",    "Samoa",    "Sao Tome and Principe",    "Seychelles",
    "Solomon Islands",    "St. Kitts and Nevis",    "St. Vincent and the Grenadines",    "Saint Lucia","Suriname",    "Timor-Leste",
    "Trinidad and Tobago",  "Tokelau", "Niue","Tonga","Puerto Rico","Palau",  "Tuvalu",    "Vanuatu","Cuba","Bahamas","Fiji","Bermuda"]
    
    $('#fundingCategorySelect').change(function () {
        var fundingCategory = $(this).val();

        newOptions = "<option value='All'>All " + fundingCategory + "</option>"
        if (fundingCategory == "All") {
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

        selectedRegion = $('.selectedRegion')[0].innerHTML.split(' ')[0]
        selectedYear = $("#yearSelect").val()
        selectedDonor = $("#fundingSelect").val()

        ///temp fix
        if (selectedDonor == null) {
            selectedDonor = "All"
        }

        console.log(selectedRegion, selectedYear, selectedDonor)
        filteredProjects = sidsDB
        if (selectedDonor != "All") {
            filteredProjects = filteredProjects.filter(function (d) { return d.donors.split(";").includes(selectedDonor) });
        }
        else {
            selectedFundingCategory = $("#fundingCategorySelect").val();
            if (selectedFundingCategory != "All"){

                if (selectedFundingCategory == "Programme Countries" || selectedFundingCategory == "Donor Countries" ){
                    filteredProjects = filteredProjects.filter(function (d) {
                        
                       fundingCat= d.donors.split(";").map(donor => {
                        try {
                           if(d.country==fundingCategories[donor].subCategory){
                                return "Programme Countries"
                            }
                            else{
                                return "Donor Countries"
                            }

                        }
                            catch (error) {
                                return;
                            }
                        });
    

                        ///this returns all government projects, not just programme governments. need to also check if project is in country of gov
                        if (selectedFundingCategory == "Donor Countries"){
                        return fundingCat.includes("Donor Countries")
                        }
                        if (selectedFundingCategory == "Programme Countries"){
                            return fundingCat.includes("Programme Countries")
                            }


                    });
                }
                else{



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
        else{
            filteredProjects = filteredProjects.filter(function (d) { return Number.isInteger(parseInt(d.year))});
        }
        if (selectedRegion != "Global") {
            filteredProjects = filteredProjects.filter(function (d) {
                return d.region == selectedRegion
            });
        }

        console.log(filteredProjects)
        filterBudgetData = {}
        filterProjectData = {}


        selectedGoal = $('.selectedGoal')[0].innerHTML

  

        if (selectedGoal == "Sustainable Development Goals") {
            console.log("sdgsss")

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

     
        else if (selectedGoal == "UNDP Signature Solutions") {
            console.log("solutions")

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

            console.log("samoaaaaa")

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

        console.log(filterProjectData)
        console.log(filterBudgetData)

        return ([filterBudgetData, filterProjectData, filteredProjects]);

    }



    function updateBars() {

        dat = filterData()
console.log(dat)

        filterBudgetData = dat[0]
        filterProjectData = dat[1]
        filteredProjects = dat[2]

        sourceCount = [];
        for (let key in filterProjectData) {
            if (filterProjectData.hasOwnProperty(key)) {
                sourceCount.push(parseInt(filterProjectData[key]));
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
            colors=samoaColors
            bins = 16
            xOffset=0
        } else if (selectedGoal == "Sustainable Development Goals") {
            bins = 17
            xOffset=0
            colors=sdgColors
        }
        else if (selectedGoal == "UNDP Signature Solutions") {
            xOffset=45
            bins = 6
            colors=ssColors
        }

        

        d3.selectAll(".bar")
            .transition()
            .duration(750)
            .attr("height", function (d,i) { 
                if(i<bins){
                return barsHeight - y(filterProjectData[d]);}
                else{return 0}
            })
            .attr("y", function (d,i) { 
                if(i<bins){
                return y(filterProjectData[d]);}
                else{return 0}
            })
            .attr("x", function (d) { return x(d) * 17 / bins + x.bandwidth() / 16 +xOffset; })
            .attr("fill", function (d, i) { return colors[i] })

        d3.selectAll(".bar2")
            .transition()
            .duration(750)
            .attr("height", function (d,i) { 
                if(i<bins){
                return barsHeight - y2(filterBudgetData[d]);}
                else{return 0}
            })
            .attr("y", function (d,i) { 
                if(i<bins){
                return y2(filterBudgetData[d]);}
                else{return 0}
            })
            .attr("x", function (d) { return x2(d) * 17 / bins + x.bandwidth() / 2.2+xOffset*1.1; })
            .attr("fill", function (d, i) { return colors[i] })

        d3.selectAll(".stick")
            .transition()
            .duration(750)
            .attr("x", function (d) { return x(d) * 17 / bins + x.bandwidth() / 6 +xOffset; })
            .attr("y", function (d,i) {
                if(i<bins){ 
                return y(filterProjectData[d]) - 22;}
                else{return 0}
            })
            .attr("height",function(d,i){
                if(i<bins){
                if(filterProjectData[d]>0){ return 22} 
                else{return 0}}
                else{return 0}
            })

        d3.selectAll(".stick2")
            .transition()
            .duration(750)
            .attr("x", function (d) { return x2(d) * 17 / bins + x2.bandwidth() / 2.2 + x2.bandwidth() / 10 +xOffset*1.1; })
            .attr("y", function (d,i) {
                if(i<bins){
                 return y2(filterBudgetData[d]) - 8;}
                else{return 0}
                })
            .attr("height",function(d,i){
                if(i<bins){
                if(filterProjectData[d]>0){ return 8} 
                else{return 0}}
                else{return 0}
            })

              

console.log(filterProjectData)



        projectLabels
            .transition()
            .duration(750)
            .attr("y", function (d,i) {
                if(i<bins){
                return y(filterProjectData[d]) - 24;}
                else{return 0}
               
            })
            .text(function (d,i) {
                if(i<bins){
                    if(filterProjectData[d]>0){
                return filterProjectData[d].toString().concat(" Projects");}
                else{return ""}
            }
                else{
                    return "";
                }
            })
            .attr("x", function (d) {
                return x(d) * 17 / bins + x.bandwidth() / 8 +xOffset;
            })

        budgetLabels
            .transition()
            .duration(750)
            .attr("y", function (d,i) {
                if(i<bins){
                return y2(filterBudgetData[d]) - 10;
            
            //
            // if(y2(filterBudgetData[d]) - 10 > y(filterProjectData[d]) - 34){
            //     return
            // }
            // else{ return y2(filterBudgetData[d]) - 10;}

        
    
            
            }
                else{return 0}
            })
            .text(function (d,i) {
                if(i<bins){
                    if(filterBudgetData[d]>0){
                return nFormatter(filterBudgetData[d]).concat(" USD");}
                else{return ""}
            }
                else{
                    return ""
                }
            })
            .attr("x", function (d) {
                return x2(d) * 17 / bins + x2.bandwidth() / 8 + x2.bandwidth() / 2.3 +xOffset*1.1;
            })



        year = document.getElementById("yearSelect").value
        region = $('.selectedRegion')[0].innerHTML.split(' ')[0]


            var distinct = []
            var totalBudg=0
            for (project in filteredProjects){
                totalBudg+=parseInt(filteredProjects[project].budget)
               if (!distinct.includes(filteredProjects[project].title)){
                  distinct.push(filteredProjects[project].title)}}

            $("#portfolio3").text(distinct.length)//(sum(filterProjectData)));
console.log("budg",totalBudg)
            $("#portfolio4").text(nFormatter(totalBudg,1));
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

function updateProjectTooltips(filteredProjects){
    const projectTooltips = $(".projectTooltip")
      .each(function (index) {
        tooltipTitle = "Projects";
        secondLine = sdgs[index]
        thirdLine = "Project 2"

        sdgFilteredProjects = filteredProjects.filter(function (d) {

            return d.sdg.includes(sdgs[index])
        });


        projectList=""

        for(project in sdgFilteredProjects){
            projectList+="<h6><b>"+(parseInt(project)+1).toString()+") </b>"+sdgFilteredProjects[project].title+"</h6>"
        }

        // sdgFilteredProjects.eac
        //     projectList=projectList+
        // )
        $('#jjtooltipProject' + (index).toString()).html('<h4 style="color:#0DB14B">' +
         "SDG "+index.toString()+" - "+sdgs[index]+ '</h4>'+projectList)
//+ '</h4><h6>' + secondLine + '</h6><h6>' + thirdLine + '</h6>
        //$('#tooltipProject' + (index).toString()).multiline(projectList)
        // <h4 style="color:#0DB14B">' + tooltipTitle + 
        // '</h4><h6 id="tooltipStat">' + secondLine + '</h6><h6>' + index + 
        // '</h6><div class="arrow" data-popper-arrow></div></div>')
    
      });
}
    

function initProjectTooltips() {
    const bars = $(".bar")
  
    console.log("bars",bars)

    bars.each(function (index) {
console.log("bars",index)
        tooltipTitle = "Projects";
        secondLine = sdgs[index]
        thirdLine = "Project 2"
 
      $('#projectTooltips').append('<div class="projectTooltip tooltips" id="tooltipProject' + 
      (index).toString() + '" role="tooltip"><div class="jjprojectTooltip" id="jjtooltipProject' + 
      (index).toString()+'"><h4 style="color:#0DB14B">'
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
    budget: "Budget",
    expense: "Expense",
    sdg: "SDGs",
    solution: "Signature Solution",
    donors: "Funding Sources",
};

$("#portfolioCsvButton").click(function(){ console.log(filteredProjects);
    exportCSVFile(portfolioHeaders,filteredProjects,'sids_projects_'+selectedRegion+"_"+selectedYear,"")}) //download(filteredProjects); });

