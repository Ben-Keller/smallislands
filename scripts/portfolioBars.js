
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

sdgToSamoa = { 1: [1], 2: [6], 3: [11], 4: [12, 13], 5: [13], 6: [7], 7: [3], 8: [1], 9: [1, 8], 10: [12, 13], 11: [1, 4, 8, 10], 12: [9, 10], 13: [2, 4], 14: [5, 10, 14], 15: [10, 15], 16: [1, 13], 17: [16] }
samoaPriorities = ["Sustainable, inclusive and equitable economic growth", "Climate Change", "Sustainable Energy",
    "Disaster Risk Reduction", "Oceans and Seas", "Food Security and Nutrition", "Water and Sanitation", "Sustainable Transportation",
    "Sustainable Consumption and Production", "Chemical and Waste management", "Health and NCDs",
    "Gender Equality", "Social Development", "Biodiversity", "Invasive species", "Means of Implementation"]

sdgs = ["No poverty", "Zero hunger", "Good health and well-being", "Quality education", "Gender equality", "Clean water and sanitation", "Affordable and clean energy", "Decent work and economic growth", "Industry, innovation and infrastructure", "Reduced inequalities", "Sustainable cities and communities", "Responsible consumption and production", "Climate action", "Life below water", "Life on land", "Peace, justice, and strong institutions", "Partnerships for the goals"]

$("#samoaIconRow").hide();

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


    let barsMargin = { top: 60, right: 0, bottom: 0, left: 9 };
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
        .attr("height", function (d) { return 22; })
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
        .attr("fill", function (d, i) { return colors[i] })

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
        .attr("height", function (d) { return 8; })
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
        .attr("fill", function (d, i) { return colors[i] })
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

        updateBars()

        selectedGoal=$('.selectedGoal')[0].innerHTML
        if(selectedGoal=="Sustainable Development Goals"){
        $("#samoaIconRow").fadeOut(50);
        setTimeout(function(){$("#sdgIconRow").fadeIn(150)},50);
        }
        else if(selectedGoal=="SAMOA Pathway"){
            $("#sdgIconRow").fadeOut(50)
            setTimeout(function(){$("#samoaIconRow").fadeIn(150)},50);
                }

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
                'background-position-y': '-120%'
            }, 1800, function () { console.log('zoomed'); });
            $("#portfolio1").text("25");
            $("#portfolio2").text("16");

        }
        else if (region == "AIS (RBA)") {
            $('#portfolioPanel').animate({
                'background-size': '125%',
                'background-position-x': '50%',
                'background-position-y': '-120%'
            }, 1600, function () { console.log('zoomed'); });
            $("#portfolio1").text("9");
            $("#portfolio2").text("9");
        }
        else if (region == "Pacific (RBAP)") {
            $('#portfolioPanel').animate({
                'background-size': '130%',
                'background-position-x': '185%',
                'background-position-y': '-280%'
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
                if (fundingCategories[fund].category == "Government") {
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
            if (selectedFundingCategory != "All")
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


        if (selectedYear != "2012to2021") {
            filteredProjects = filteredProjects.filter(function (d) { return d.year == selectedYear });
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

        return ([filterBudgetData, filterProjectData]);

    }



    function updateBars() {

        dat = filterData()
        filterBudgetData = dat[0]
        filterProjectData = dat[1]


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


            if(selectedGoal=="SAMOA Pathway"){

                bins=16
            }else if(selectedGoal=="Sustainable Development Goals"){
                bins=17    
               }

        d3.selectAll(".bar")
            .transition()
            .duration(750)
            .attr("height", function (d) { return barsHeight - y(filterProjectData[d]); })
            .attr("y", function (d) { return y(filterProjectData[d]); })
            .attr("x", function (d) { return x(d)*17/bins + x.bandwidth() / 16; })

        d3.selectAll(".bar2")
            .transition()
            .duration(750)
            .attr("height", function (d) { return barsHeight - y2(filterBudgetData[d]); })
            .attr("y", function (d) { return y2(filterBudgetData[d]); })
            .attr("x", function (d) { return x2(d)*17/bins + x.bandwidth() /2.2;})
        
        
        d3.selectAll(".stick")
            .transition()
            .duration(750)
            .attr("x", function (d) { return x(d)*17/bins + x.bandwidth() / 6; })
            .attr("y", function (d) { return y(filterProjectData[d]) - 22; })

        d3.selectAll(".stick2")
            .transition()
            .duration(750)
            .attr("x", function (d) { return x2(d)*17/bins + x2.bandwidth() / 2.2 + x2.bandwidth() / 10; })
            .attr("y", function (d) { return y2(filterBudgetData[d]) - 8; })
        

       


        projectLabels
            .transition()
            .duration(750)
            .attr("y", function (d) {
                return y(filterProjectData[d]) - 24;
            })
            .text(function (d) {
                return filterProjectData[d].toString().concat(" Projects");
            })
            .attr("x", function (d) {
                return x(d)*17/bins + x.bandwidth() / 8;
            })

        budgetLabels
            .transition()
            .duration(750)
            .attr("y", function (d) {
                return y2(filterBudgetData[d]) - 10;
            })
            .text(function (d) {
                return nFormatter(filterBudgetData[d]).concat(" USD");
            })
            .attr("x", function (d) {
                return x2(d)*17/bins + x2.bandwidth() / 8 + x2.bandwidth() / 2.3;
            })



        year = document.getElementById("yearSelect").value
        region = $('.selectedRegion')[0].innerHTML.split(' ')[0]

        if (year == "2012to2021") {

            if (region == "Global") {
                $("#portfolio3").text("1533");
            }
            if (region == "Caribbean") {
                $("#portfolio3").text("720");
            }
            if (region == "Pacific") {
                $("#portfolio3").text("327");
            }
            if (region == "AIS") {
                $("#portfolio3").text("464");
            }

        }

        else {

            $("#portfolio3").text((sum(filterProjectData)));


            $("#portfolio4").text(nFormatter(sum(filterBudgetData)));
        }

        ///update Pie1



        year = $("#yearSelect").val()


        updatePieChart1(dataMap1(filteredProjects, fundingCategories));
        updatePieChart2(dataMap2(filteredProjects, fundingCategories));



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

    function sum(obj) {
        var sum = 0;
        for (var el in obj) {
            if (obj.hasOwnProperty(el)) {
                sum += parseFloat(obj[el]);
            }
        }
        return sum;
    }
}