////////
//Initializations
//////////////



presetDict = { "evi": ["agrInst", "expConc", "expInst", "popLECZ", "popDry", "remote", "victims", "agrGDP"] }

mviIndicatorNames = {
    "expConc": "Export Concentration", "expInst": "Export Instability", "agrInst": "Agricultural Instability", "agrGDP": "Agriculture & Fishing (% of GDP)",
    "victims": "Victims of Disasters", "popLECZ": "% Population in Coastal Zones", "popDry": "% Population in Drylands", "remote": "Remoteness",
    "tourism": "Tourism Revenue (% of Exports)", "fdi": "FDI Inflows (% of GDP)", "remit": "Remittances (% of GDP)"
}

mviIndicatorsDict = {
    "expConc": "Exportconcentration", "expInst": "ExportInstability", "agrInst": "AgriculturalInstability", "agrGDP": "AgricultureandfishingasshareofGDP",
    "victims": "Victimsofdisasters", "popLECZ": "Shareofpopulationinlowelevatedcoastalzones", "popDry": "%PopulationinDrylands", "remote": "Remoteness",
    "tourism": "Tourismrevenuesasshareofexports", "fdi": "FDIinflowsaspercentageofGDP", "remit": "RemittancesaspercentageofGDP"
}

mviDimensionColors = { "Financial": "#0DB14B", "Economic": "#f0db3a", "Geographic": "#CC333F", "Environmental": "#00A0B0" }

mviDimensions = {
    "Financial": ["tourism", "remit", "fdi"],
    "Economic": ["agrInst", "expConc", "expInst"],

    "Geographic": ["popLECZ", "popDry", "remote"],
    "Environmental": ["victims", "agrGDP"]

}

dimensionList = Object.keys(mviDimensions)

//should compute this automatically
mviCountryListSpider = ["Haiti", "Dominican Republic", "Antigua and Barbuda", "St. Kitts and Nevis", "Dominica", "Saint Lucia"
    , "Barbados", "St. Vincent and the Grenadines", "Grenada", "Trinidad and Tobago", "Guyana", "Suriname",
    "Cabo Verde", "Guinea-Bissau",
    "São Tomé and Príncipe", "Comoros", "Mauritius", "Seychelles", "Maldives",
    "Timor Leste", "Palau", "Papua New Guinea", "Solomon Islands",
    "Micronesia", "Marshall Islands", "Vanuatu", "Nauru", "Kiribati", "Fiji", "Tuvalu", "Tonga", "Samoa", "Belize", "Jamaica"]

mviCountryListLongitude = ["Belize", "Jamaica", "Haiti", "Dominican Republic", "Antigua and Barbuda", "St. Kitts and Nevis", "Dominica", "Saint Lucia"
    , "Barbados", "St. Vincent and the Grenadines", "Grenada", "Trinidad and Tobago", "Guyana", "Suriname", "", "",
    "Cabo Verde", "Guinea-Bissau",
    "São Tomé and Príncipe", "Comoros", "Mauritius", "Seychelles", "Maldives", "", "",
    "Timor Leste", "Palau", "Papua New Guinea", "Solomon Islands",
    "Micronesia", "Marshall Islands", "Vanuatu", "Nauru", "Kiribati", "Fiji", "Tuvalu", "Tonga", "Samoa"]

var chosenCountryListMVI = mviCountryListLongitude

pacificList2 = ["Timor Leste", "Palau", "Papua New Guinea", "Solomon Islands",
    "Micronesia", "Marshall Islands", "Vanuatu", "Nauru", "Kiribati", "Fiji", "Tuvalu", "Tonga", "Samoa"]
aisList2 = ["Cabo Verde", "Guinea-Bissau",
    "São Tomé and Príncipe", "Comoros", "Mauritius", "Seychelles", "Maldives"]
caribbeanList2 = ["Belize", "Jamaica", "Haiti", "Dominican Republic", "Antigua and Barbuda", "St. Kitts and Nevis", "Dominica", "Saint Lucia"
    , "Barbados", "St. Vincent and the Grenadines", "Grenada", "Trinidad and Tobago", "Guyana", "Suriname"]





///
//////////////////////
// mega functions :) :) refactor yay!
/////////////////////////



/// on page load




///// every time a state is changed

// run function with all selections available

// load both mvi and country data

//process mvi and country data
// export:
    // ranked/sorted lists of countries with data for countryData and mvi
    // countryData and mvi data objects
    // totalVals

    
/// compute new states for all objects

//for each rect calculate rectTransform
//for each mviRect calculate mviBarChart or mviColumnChart, color, and opacity
//for each circle calculate circleTransform and color / opacity
//for each label calculate labelTransform and opacity
//for each viz calculate vizTransform and vizColor
//for each title 1-3 calculate textTransform
//for each regionTitle calculate regionTransform
//for each line calculate lineTransform

//transform x-axis
//transform y-axis

//update choroLegend

//update choroInfoBox

//update spider (if spider is selected)


//make sure all shaders are aligned












///////////////////////////
///old updatecustommvi
///////////////////////////////////


function updateCustomMvi() {
    console.log("jaja")
    console.log(wdiFull)

    selectedPage = $('.is-active').attr('id')
    selectedViz = $('.selectedViz')[0].innerHTML

    if (selectedPage == "mviTab") {
        d3.selectAll(".countrySvg")	/* Map  counties to  data */
            .attr("class", function (d) {
                if (mviCountryListSpider.includes(countryJson[this.id].Country)) {
                    return (regionColors(countryJson[this.id].Region, "Y") + " shadow countrySvg")
                } else { return "nodata countrySvg" }
            });







    }





    const checkboxes = document.querySelectorAll('input[name="mviIndicator"]:checked');
    selectedIndis = []
    checkboxes.forEach((el) => { selectedIndis.push(el.id) })

    console.log(selectedIndis)
    var margin = { top: 85, right: 45, bottom: 0, left: 0 },
        width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

    var radarChartOptionsCustom = {
        w: 420,
        h: 420,
        margin: margin,
        maxValue: 10,
        levels: 6,
        spin: 0,
        roundStrokes: false,
        color: d3.scale.ordinal().range(["#0DB14B", "#f0db3a", "#CC333F", "#00A0B0", "#FFFFFF"])//,
        //				legend: { title: 'Organization XYZ', translateX: 120, translateY: 140 },
    };





    mviTimeSeries = {}
    ///this is modeled after the country profile pillars, so 'pillar' is used out of context here


    mviValues = {}


    for (index in mviCountryListLongitude) {
        newCountryData = {}
        country = mviCountryListLongitude[index]

        val = 0
        for (j = 3; j >= 0; j = j - 1) {
            dimVal = 0
            indiCount = 0
            for (indi in mviDimensions[dimensionList[j]]) {
                indi = mviDimensions[dimensionList[j]][indi]
                if (selectedIndis.includes(indi)) {
                    try {
                        //countryName = allKeyData[country].Profile.Country
                        newVal = wdiFull[mviIndicatorsDict[indi]].data[country]
                        //console.log(typeof newVal)
                        if (typeof newVal == 'number') {
                            dimVal += newVal
                            indiCount += 1
                        }
                    }
                    catch (error) {//console.log(error,indi)
                    }
                }

            }
            if (indiCount > 0) {
                val += dimVal / indiCount / 4

            }

        }
        mviValues[country] = val

    }

    sortedMviData = sort_object(mviValues)
    sortedCountryList = Object.keys(sortedMviData)
    console.log(sortedMviData)

    pillarData = []


    selectedSortby = $('.selectedSortby')[0].innerHTML
    selectedViz=$('.selectedViz')[0].innerHTML

    if (selectedViz == "Spider") {
        if (selectedSortby == "Rank") {
            //this filter removes any empty elements
            chosenCountryListMVI = sortedCountryList.filter(item => item) //mviCountryList for regional, fixed value
        }
        else if (selectedSortby == "Region") {
            chosenCountryListMVI = mviCountryListSpider
        }
    }
    else if (selectedViz == "Global View") {
        chosenCountryListMVI = mviCountryListLongitude
    }
    else if (selectedViz == "Bar Chart") {
        if (selectedSortby == "Rank") {
            //this filter removes any empty elements



            chosenCountryListMVI = sortedCountryList.filter(item => item) //mviCountryList for regional, fixed value
        }
        else if (selectedSortby == "Region") {
            chosenCountryListMVI = sortedCountryList.filter(item => item) //mviCountryList for regional, fixed value


            pacificListSort = sortedCountryList.filter(item => pacificList2.includes(item));
            aisListSort = sortedCountryList.filter(item => aisList2.includes(item));
            caribbeanListSort = sortedCountryList.filter(item => caribbeanList2.includes(item));
            console.log(pacificListSort)
            chosenCountryListMVI = caribbeanListSort.concat(["", ""], aisListSort, ["", ""], pacificListSort)
            console.log(chosenCountryListMVI)
        }

        else {
            chosenCountryListMVI = mviCountryListLongitude
        }
    }



    console.log("jaja")
    for (i = 0; i < dimensionList.length; i++) {
        //	console.log(countryList[i])
        //	console.log(allKeyData[countryList[i]])
        ////need to convert countryList[i] to code

        mviAxes = []
        for (index in chosenCountryListMVI) {

            newCountryData = {}
            country = chosenCountryListMVI[index]


            val = 0
            for (j = 3; j >= i; j = j - 1) {
                dimVal = 0
                indiCount = 0
                for (indi in mviDimensions[dimensionList[j]]) {
                    indi = mviDimensions[dimensionList[j]][indi]
                    if (selectedIndis.includes(indi)) {
                        try {
                            //countryName = allKeyData[country].Profile.Country
                            newVal = wdiFull[mviIndicatorsDict[indi]].data[country]
                            //console.log(typeof newVal)
                            if (typeof newVal == 'number') {
                                dimVal += newVal
                                indiCount += 1
                            }
                        }
                        catch (error) {//console.log(error,indi)
                        }
                    }
                    //)

                    //add all checked indicaotr standardized values in this dimension to value


                }
                if (indiCount > 0) {
                    val += dimVal / indiCount / 4

                }

            }
            // console.log(country,val)
            newCountryData['axis'] = country
            newCountryData['value'] = val
            mviAxes.push(newCountryData)

        }
        console.log("jaja")
        pillarData.push({ name: dimensionList[i], axes: mviAxes })
    }

    selectedViz = $('.selectedViz')[0].innerHTML



    if (selectedViz == "Spider") {
        svg_radar_5 = RadarChart("#customSpider", radarChartOptionsCustom, dimensionList, "customIndex", { "customIndex": pillarData });
    }
    try {
        indicator = $('.indiActive')[0].id
    }
    catch (error) { indicator = "Region" }

    console.log(chosenCountryListMVI)
    updateChoropleth(indicator)

    updateMviBarAxis(pillarData);
    updateChoroLegend();
    updateMultiYAxis();
    console.log(chosenCountryListMVI)


    //update rectangles and circles
    selectedPage = $('.is-active').attr('id')
    console.log("jaja")
    if (selectedViz == "Spider" || selectedViz == "Multi-indicator" || selectedViz == "Choropleth" || selectedPage == "countryDataTab") {

        try {
            indicator = $('.indiActive')[0].id
        }
        catch (error) { indicator = "Region" }

        try {
            indicator2 = $(".indiActive2")[0].id
        }
        catch (error) { indicator2 = "HumanDevelopmentIndex" }


        if (indicator == "Region") {
            indicatorData = wdiFull["HumanDevelopmentIndex"]["data"]
        }
        else {
            indicatorData = wdiFull[indicator]["data"]//[selectedYear]
        }
        indicatorData2 = wdiFull[indicator2]["data"]//[selectedYear]

        console.log("jaja")





        rectTransformData = {}

        $(".choroRectMvi").each(function () {
            var country = countryJson[this.parentNode.id].Country
            var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
            dat = rectTransform(country, bBox, selectedViz, indicatorData, indicatorData2)
            rectTransformData[country] = dat
        });

        d3.select(sidsMaps).selectAll(".choroRectMvi")
            .transition()
            .duration(1200)
            .attr("x", function () { return rectTransformData[countryJson[this.parentNode.id].Country]["x"] })
            .attr("y", function () { return rectTransformData[countryJson[this.parentNode.id].Country]["y"] })
            .attr("width", 0)
            .attr("height", function () { return rectTransformData[countryJson[this.parentNode.id].Country]["height"] })

    }

    else if (selectedViz == "Global View") {

        for (i = 1; i < 5; i++) {
            rectTransformData = {}
            $(".choroRect" + i).each(function () {
                var country = countryJson[this.parentNode.id].Country
                var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
                dat = mviColumnChart(country, selectedViz, pillarData, mviCountryListLongitude, i)
                rectTransformData[country] = dat
            });

            d3.select(sidsMaps).selectAll(".choroRect" + i)
                .transition()
                .duration(1200)
                .attr("x", function () { return rectTransformData[countryJson[this.parentNode.id].Country]["x"] })
                .attr("y", function () { return rectTransformData[countryJson[this.parentNode.id].Country]["y"] })
                .attr("width", function () { return rectTransformData[countryJson[this.parentNode.id].Country]["width"] })
                .attr("height", function () { return rectTransformData[countryJson[this.parentNode.id].Country]["height"] })
        }
    }

    else if (selectedViz == "Bar Chart") {


        if (selectedPage == "mviTab") {


            d3.select(sidsMaps).selectAll(".choroText")
                .transition()
                .duration(1200) //make transition time relative to to/from viz
                .attr("transform", function (d) {
                    //    console.log(this.innerHTML)
                    var country = this.innerHTML;
                    if (chosenCountryListMVI.includes(country)) {
                        var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
                        textX = bBox[4]
                        textY = bBox[2] - 11;
                        textBBox = this.getBBox()
                        //console.log(textBBox)

                        MBC = mviBarChart(country, selectedViz, pillarData, chosenCountryListMVI, 1)["y"]
                        // console.log(bBox,textBBox,TT,country)
                        totalVals = 40
                        totalHeight = 500
                        rank = MBC / 12.45  //almost totalHeight/totalVals
                        return "scale(1,1) translate(" + (-textX + 140 - textBBox.width / 2) + "," + (-textY + totalHeight / totalVals * (rank + .5)) + ")"
                    } else {
                        return "scale(0.001,0.001)"
                    }

                })



            labelTransformData = {}
            $(".countryLabel").each(function () {
                var country = countryJson[this.parentNode.id].Country
                var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
                dat = mviBarChart(country, selectedViz, pillarData, chosenCountryListMVI, 1)
                labelTransformData[country] = dat

            });
            console.log(labelTransformData)
            d3.select(sidsMaps).selectAll(".countryLabel")
                .transition()
                .duration(1200)
                .attr("x", function () { return labelTransformData[countryJson[this.parentNode.id].Country]["width"] + 170 })
                .attr("y", function () { return labelTransformData[countryJson[this.parentNode.id].Country]["y"] + 10 })
                // .attr("fill-opacity", function () {
                //   if (noData.includes(countryJson[this.parentNode.id].Country) || selectedViz != "Bar Chart") { return 0 }
                //   else { return 1 }
                // })
                .text(function () {

                    val = mviValues[countryJson[this.parentNode.id].Country], 2

                    if (typeof val == "number") {
                        return nFormatter(val, 2)
                    }
                    else {
                        return ""
                    }

                })




        }


        for (i = 1; i < 5; i++) {
            rectTransformData = {}
            $(".choroRect" + i).each(function () {
                var country = countryJson[this.parentNode.id].Country
                var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
                dat = mviBarChart(country, selectedViz, pillarData, chosenCountryListMVI, i)
                rectTransformData[country] = dat
            });

            d3.select(sidsMaps).selectAll(".choroRect" + i)
                .transition()
                .duration(1200)
                .attr("x", function () { return rectTransformData[countryJson[this.parentNode.id].Country]["x"] })
                .attr("y", function () { return rectTransformData[countryJson[this.parentNode.id].Country]["y"] })
                .attr("width", function () { return rectTransformData[countryJson[this.parentNode.id].Country]["width"] })
                .attr("height", function () { return rectTransformData[countryJson[this.parentNode.id].Country]["height"] })
        }
    }

    if (selectedViz == "Spider" || selectedViz == "Bar Chart") {
        $("#sortbySelect").show()
        var x = $(".selectedSortby").parent()
        $(".sortbyShader").stop().animate({
            'width': x.width() + 32,
            'left': x.position().left
        }, 400);

    }
    else {
        $("#sortbySelect").hide()
    }

}




///////
// Mvi rectangles
///

function appendMviRectangles() {

    d3.select('#allSids').selectAll("g")
        .append("rect")
        .style("fill", mviDimensionColors["Environmental"])
        .attr("x", 160)
        .attr("y", 300)
        .attr("width", 0)
        .attr("height", 0)
        .classed("choroRect1 choroRectMvi", true);

    d3.select('#allSids').selectAll("g")
        .append("rect")
        .style("fill", mviDimensionColors["Geographic"])
        .attr("x", 160)
        .attr("y", 300)
        .attr("width", 0)
        .attr("height", 0)
        .classed("choroRect2 choroRectMvi", true);

    d3.select('#allSids').selectAll("g")
        .append("rect")
        .style("fill", mviDimensionColors["Economic"])
        .attr("x", 160)
        .attr("y", 300)
        .attr("width", 0)
        .attr("height", 0)
        .classed("choroRect3 choroRectMvi", true);

    d3.select('#allSids').selectAll("g")
        .append("rect")
        .style("fill", mviDimensionColors["Financial"])
        .attr("x", 160)
        .attr("y", 300)
        .attr("width", 0)
        .attr("height", 0)
        .classed("choroRect4 choroRectMvi", true);

    console.log("rect12")

}

function mviBarChart(country, selectedViz, pillarData, chosenCountryListMvi, dim) {

    dat = pillarData[dim - 1]
    dimensionName = dat.name
    try {
        val = dat["axes"].filter(function (el) { return el.axis == country })[0].value
        maxVal = pillarData[0]["axes"].filter(function (el) { return el.axis == country })[0].value

    }
    catch (error) {
        val = 0
        maxVal = 0
    }


    rank = chosenCountryListMvi.indexOf(country)

    totalVals = chosenCountryListMvi.length
    totalHeight = 500
    totalWidth = 440
    selectedPage = $('.is-active').attr('id')

    if (rank == -1) {
        return { x: 160, "y": 300, "width": 0, "height": 0 }
    }

    else {

        try {

            topMargin = 0

            margin = 4
            values = []
            for (key in pillarData[0]["axes"]) {
                values.push(pillarData[0]["axes"][key].value)
            }
            maxx = Math.max(...values)
            minn = 0//
            normValue = (val - minn) / (maxx - minn)
            normMaxValue = (maxVal - minn) / (maxx - minn)
            //console.log(country,normValue,rank,minn)
            if (selectedPage == "countryDataTab") {
                //console.log(val, typeof val)

                return { "x": 160, "y": totalHeight / totalVals * (rank) + topMargin, "width": 0, "height": totalHeight / totalVals - margin }//,"color":color};
            }
            else if (selectedPage == "mviTab") {
                return { "x": (normMaxValue - normValue) * totalWidth + 160, "y": totalHeight / totalVals * (rank) + topMargin, "width": normValue * totalWidth, "height": totalHeight / totalVals - margin }//,"color":color};
            }
        }
        catch (error) {
            //console.log(error)
            //console.log(country,"no1");
            return { "x": 160, "y": 300, "width": 0, "height": 10 }
        }
    }

}

function mviColumnChart(country, selectedViz, pillarData, chosenCountryListMvi, dim) {

    dat = pillarData[dim - 1]
    dimensionName = dat.name
    try {
        val = dat["axes"].filter(function (el) { return el.axis == country })[0].value
    }
    catch (error) {
        val = 0
    }
    rank = chosenCountryListMvi.indexOf(country)


    totalHeight = 500
    totalWidth = 650
    selectedPage = $('.is-active').attr('id')

    if (rank == -1) {
        return { x: 160, "y": 300, "width": 0, "height": 30 }
    }

    else {

        try {

            leftMargin = 60
            totalVals = chosenCountryListMvi.length
            margin = 8

            maxx = 70
            minn = 0//Math.min(...indicatorValues)
            normValue = (val - minn) / (maxx - minn)

            //console.log(country,normValue,rank,minn)
            if (selectedPage == "countryDataTab") {
                //console.log(val, typeof val)

                return { "y": 160, "x": totalHeight / totalVals * (rank) + leftMargin, "height": 50, "width": totalHeight / totalVals - margin }//,"color":color};
            }
            else if (selectedPage == "mviTab") {
                return { "y": totalHeight * 0.85 - normValue * totalHeight / 2, "x": totalWidth / totalVals * (rank) + leftMargin, "height": normValue * totalHeight / 2, "width": totalWidth / totalVals - margin }//,"color":color};
            }
        }
        catch (error) {
            console.log(error)
            //console.log(error)
            //console.log(country,"no1");
            return { "x": 160, "y": 300, "width": 00, "height": 10 }
        }
    }

}


