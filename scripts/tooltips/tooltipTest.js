
const sidsTargets = $(".sidsTarget").each(function(index){
    console.log(index+": yo");
});

console.log(sidsTargets)

const tooltips = $(".tooltips").each(function(index){
    console.log(index+": tt");
});

console.log(tooltips)

popperInstance= new Array();

for (i = 0; i < tooltips.length; i++){
  popperInstance[i] = Popper.createPopper(sidsTargets[i] , tooltips[i],

{ placement:'top',
modifiers: [
{
    
  name: 'offset',
  
  options: {
    offset: [0, 8],
  },
},
],

});
}

    
    function hide() {

        //map to all
        for (j = 0; j < tooltips.length; j++){
        tooltips[j].removeAttribute('data-show');
    
    }
}
    
    console.log(tooltips.length,sidsTargets.length, popperInstance.length);

    const showEvents = ['mouseenter', 'focus'];
    const hideEvents = ['mouseleave', 'blur'];
    
    showEvents.forEach(event => {
        for (j = 0; j < tooltips.length; j++){
            console.log("wo",j)
         sidsTargets[j].addEventListener(event, hovered.bind(null,j));
             
    }});
        
function hovered(j){
    console.log("i",j)
            tooltips[j].setAttribute('data-show', '');
         popperInstance[j].update();
}


    
    hideEvents.forEach(event => {
    //map to all?
     for (j = 0; j < tooltips.length; j++){
            console.log("i",j)
         sidsTargets[j].addEventListener(event, hide);
    }});
