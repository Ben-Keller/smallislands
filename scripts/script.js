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

      var v5="<option value='all-sources'>All sources</option><option value='emilo-muc'>Münchner Kaffe</option><option value='emilo-muc-bio'>Münchner Kaffee BIO</option><option value='emilo-coli'>Colibri</option><option value='emilo-wall'>Wallaby</option><option value='emilo-lua'>Luani</option><option value='emilo-tuc'>Tucano BIO</option><option value='emilo-cora'>Corallo Decaf</option>"
  
  var v6="<option value='all-sources'>All sources</option><option value='gug-etho'>Äthopien</option><option value='gug-ecua'>Ecuador</option><option value='gug-gua'>Guatemala</option><option value='gug-hon'>Honduras</option>"
  
  var v7="<option value='all-sources'>All sources</option><option value='mvm-foge'>Foge, Peru</option><option value='mvm-lech'>El Lechero, Peur</option><option value='mvm-chel'>Chelbesa, Ethiopia</option><option value='mvm-serr'>Serrinha, Brazil</option>"
  
  var v8="<option value='all-sources'>All sources</option><option value='vdk-1'>Nr.1 Einmal um die Welt</option><option value='vdk-2'>Nr.2 Die Wiege des Kaffees</option><option value='vdk-3'>Nr.3 Indien Summer</option><option value='vdk-4'>Nr.4 Noch Ohne Namen</option><option value='vdk-spec'>Speciality Blend</option>"
  
  
  $("#countryCategory").change(function() {
          let val = $(this).val();
          if (val == "emilo") {
              $("#countrySelect").html(v5);
          } else if (val == "gug") {
              $("#countrySelect").html(v6);
  
          } else if (val == "mvm") {
              $("#countrySelect").html(v7);
  
          } else if (val == "vdk") {
              $("#countrySelect").html(v8);
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