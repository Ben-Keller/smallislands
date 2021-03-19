window.onload = function(){
  
  
  var v1="<option value='all-sources'>All sources</option><option value='emilo-muc'>Münchner Kaffe</option><option value='emilo-muc-bio'>Münchner Kaffee BIO</option><option value='emilo-coli'>Colibri</option><option value='emilo-wall'>Wallaby</option><option value='emilo-lua'>Luani</option><option value='emilo-tuc'>Tucano BIO</option><option value='emilo-cora'>Corallo Decaf</option>"
  
  var v2="<option value='all-sources'>All sources</option><option value='gug-etho'>Äthopien</option><option value='gug-ecua'>Ecuador</option><option value='gug-gua'>Guatemala</option><option value='gug-hon'>Honduras</option>"
  
  var v3="<option value='all-sources'>All sources</option><option value='mvm-foge'>Foge, Peru</option><option value='mvm-lech'>El Lechero, Peur</option><option value='mvm-chel'>Chelbesa, Ethiopia</option><option value='mvm-serr'>Serrinha, Brazil</option>"
  
  var v4="<option value='all-sources'>All sources</option><option value='vdk-1'>Nr.1 Einmal um die Welt</option><option value='vdk-2'>Nr.2 Die Wiege des Kaffees</option><option value='vdk-3'>Nr.3 Indien Summer</option><option value='vdk-4'>Nr.4 Noch Ohne Namen</option><option value='vdk-spec'>Speciality Blend</option>"
  
  
   $("#fundingMultiSelect").change(function() {
          let val = $(this).val();
          if (val == "emilo") {
              $("#fundingCategory").html(v1);
          } else if (val == "gug") {
              $("#fundingCategory").html(v2);
  
          } else if (val == "mvm") {
              $("#fundingCategory").html(v3);
  
          } else if (val == "vdk") {
              $("#fundingCategory").html(v4);
          }
          
      });



  

$('#goalSelect ul li').click(function() {
      var x = $(this);
      document.getElementById("test").innerHTML = this.innerText;
        $('.goalShader').stop().animate({
         'width': x.width()+32,
         'left' : x.position().left
      }, 400);
 });

 $('#regionSelect ul li').click(function() {
      var x = $(this);
      document.getElementById("test").innerHTML = this.innerText;
        $('.regionShader').stop().animate({
         'width': x.width()+32,
         'left' : x.position().left
      }, 400);

region=this.innerText
    //zoom to new region
    if(region=="Global"){
        $('#portfolioPanel').animate({
            'background-size':'95%',
            'background-position-x': '0%',
            'background-position-y': '-4%'
        },1800, function() { console.log('zoomed'); });
    }
    else if(region=="Caribbean (RBLAC)"){
        $('#portfolioPanel').animate({
            'background-size':'135%',
            'background-position-x': '-60%',
            'background-position-y': '-120%'
        },1800, function() { console.log('zoomed'); });
    }
    else if(region=="AIS (RBA)"){
        $('#portfolioPanel').animate({
            'background-size':'125%',
            'background-position-x': '50%',
            'background-position-y': '-120%'
        },1600, function() { console.log('zoomed'); });
    }
    else if(region=="Pacific (RBAP)"){
        $('#portfolioPanel').animate({
            'background-size':'130%',
            'background-position-x': '185%',
            'background-position-y': '-250%'
        },1600, function() { console.log('zoomed'); });
    }

 });
  

 $('#vizSelect ul li').click(function() {
      var x = $(this);
      document.getElementById("test").innerHTML = this.innerText;
        $('.vizShader').stop().animate({
         'width': x.width()+64,
         'left' : x.position().left
      }, 400);
 });

//style horizontal shaders to be behind chosen elements

 var x= $("#global");
$('.regionShader').css({ 
  'width': x.width()+32,
         'left' : x.position().left});
     
      var x= $("#samoa");
$('.goalShader').css({
         'width': x.width()+32,
         'left':x.position().left});



$('#countryDataTab').click(function(){
         var x= $("#choropleth");
$('.vizShader').css({
         'width': x.width()+64,
         'left':x.position().left
        });
    });

////setup devmode button

         $('#devMode').click(function() {
  $('body div').css( 'outline', '2px solid red');
  $('body row').css( 'outline', '2px solid blue');
  $('#devMode').css({  'color': '#fff',
 'border-bottom-color': '#fff'});
 $('#homeMode').css({  'color': 'rgba(255, 255, 255, .5)',
 'border-bottom-color': 'rgba(255, 255, 255, .5)'});
});
$('#homeMode').click(function() {
  $('body div').css( 'outline', '0px');
  $('body row').css( 'outline', '0px');
  $('#homeMode').css({  'color': '#fff',
 'border-bottom-color': '#fff'});
 $('#devMode').css({  'color': 'rgba(255, 255, 255, .5)',
 'border-bottom-color': 'rgba(255, 255, 255, .5)'});
  
});

}









///options and values for all regions -> countries

var all="<option value='anguilla'>Anguilla</option>\
<option value='antiguaBarbuda'>Antigua and Barbuda</option>\
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
<option value='nieu'>Nieu</option>\
<option value='palau'>Palau</option>\
<option value='papua'>Papua New Guinea</option>\
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
<option value='britishVirgin'>The British Virgin Islands</option>\
<option value='timorLeste'>Timor Leste</option>\
<option value='tokelau'>Tokelau</option>\
<option value='tonga'>Tonga</option>\
<option value='trinidadAndTobago'>Trinidad and Tobago</option>\
<option value='turksAndCaicos'>Turks and Caicos</option>\
<option value='tuvalu'>Tuvalu</option>\
<option value='vanuatu'>Vanuatu</option>"

var caribbean="<option value='anguilla'>Anguilla</option>\
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

var ais="<option value='bahrain'>Bahrain</option>\
<option value='caboVerde'>Cabo Verde</option>\
<option value='comoros'>Comoros</option>\
<option value='guineaBissau'>Guinea-Bissau</option>\
<option value='maldives'>Maldives</option>\
<option value='mauritius'>Mauritius</option>\
<option value='saoTomeAndPrincipe'>Sao Tome and Principe</option>\
<option value='seychelles'>Seychelles</option>\
<option value='singapore'>Singapore</option>"

var pacific="<option value='aruba'>Aruba</option>\
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


$("#countryCategory").change(function() {
        let val = $(this).val();
        if (val == "all") {
            $("#countrySelect").html(all);
        } else if (val == "members") {
            $("#countrySelect").html(members);

        } else if (val == "caribbean") {
            $("#countrySelect").html(caribbean);

        } else if (val == "ais") {
            $("#countrySelect").html(ais);
        }
        else if (val == "pacific") {
          $("#countrySelect").html(pacific);
      }



      });

      ////initilalize countryView

$("#countrySelect").html(all);

//set option
//automatically generate content

