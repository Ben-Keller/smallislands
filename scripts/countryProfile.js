

    

countryDict={
    "grenada": { "Name":"Grenada" 
 ,"population":56431}, "aruba": { "Name":"Aruba" 
 ,"population":77777}, 
   "fiji": { "Name":"Fiji" ,
    "population":47777}, 
    "tuvalu":{ "Name":"Tuvalu" ,
    "population":2350}, 
    "papua":{ "Name":"Papua New Guinea" ,
    "population":2350},
    "jamaica":{ "Name":"Jamaica" ,
    "population":2350}, 
    "tuvalu":{ "Name":"Tuvalu" ,
    "population":2350}, 
    "dominica":{ "Name":"Dominica" ,
    "population":2350}, 
    "dominicanRepublic":{ "Name":"Dominican Republic" ,
    "population":2350}, 
    "bahamas":{ "Name":"Bahamas" ,
    "population":2350}, 

    "barbados":{ "Name":"Barbados" ,
    "population":2350},
    "timorLeste":{ "Name":"Timor Leste" ,
    "population":2350}, 
    "comoros":{ "Name":"Comoros" ,
    "population":2350}, 
    "mauritius":{ "Name":"Mauritius" ,
    "population":2350}, 
    "kiribati":{ "Name":"Kiribati" ,
    "population":2350}, 
    "tonga":{ "Name":"Tonga" ,
    "population":2350} 
                
                }




document.getElementById("countrySelect").addEventListener("change", myFunction);

function myFunction() {
  var x = document.getElementById("countrySelect");
  countryCode=x.value;
  console.log(countryCode);


  // update country info 
   document.getElementById('countryProfileInfo').innerHTML= "<b>Population:</b>".concat(countryDict[countryCode]["population"].toString(),"<br>\
                  <b>Region: </b>","Caribbean (RBLAC)" ,"<br>\
                  <b> HDI:</b>", "0.779 (24th, medium)","<br>\
                  <b>Languages:</b>", "Grenadian Creole English, Grenadian Creole French","<br>\
                  <b> Surface Area:</b>", "348.5 sq. km" ,"<br>\
                  <b>Economic Zone Area:</b>"," 500 sq. km.");
                  document.getElementById("reliefMap").src="maps/relief/".concat(countryCode,"Relief.png")                  
// update stories 

// update relief map 

// update country photo 

// update all 3 spider charts
}