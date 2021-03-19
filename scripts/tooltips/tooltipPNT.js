
//sidsTargetsData=[1: 2:]
//const? list? sidsTargets document.querySelector(all .sidsTargets



const sids1 = document.querySelector('#sidsTarget1');
const sids2 = document.querySelector('#sidsTarget2');



////const? list? tooltip+# = document.querySelector - all (#tooltip + #)


const tooltip1 = document.querySelector('#tooltip1');
const tooltip2 = document.querySelector('#tooltip2');


//for target in sidsTargets:
//  create popper instance + # from sids # and tooltip #


const popperInstance1 = Popper.createPopper(sids1, tooltip1,
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


const popperInstance2 = Popper.createPopper(sids2, tooltip2,
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



//change show to take a parameter of a tooltip and a popperinstance? or add the # to each 


function show1() {
tooltip1.setAttribute('data-show', '');



// We need to tell Popper to update the tooltip position
// after we show the tooltip, otherwise it will be incorrect
popperInstance1.update();


}

function show2(){
tooltip2.setAttribute('data-show', '');
popperInstance2.update();
}

function hide() {
tooltip1.removeAttribute('data-show');
tooltip2.removeAttribute('data-show');

}

const showEvents = ['mouseenter', 'focus'];
const hideEvents = ['mouseleave', 'blur'];

showEvents.forEach(event => {
sids1.addEventListener(event, show1);
sids2.addEventListener(event, show2);
//maybe just add eventlisteners for all? easiest
//or just embed function direclty???
});



hideEvents.forEach(event => {
sids1.addEventListener(event, hide);
sids2.addEventListener(event, hide);
});