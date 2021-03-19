const iconbar = document.querySelector('.hoverMe');
const tooltip = document.querySelector('#tooltip');

const popperInstance = Popper.createPopper(iconbar, tooltip,
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

function show() {
tooltip.setAttribute('data-show', '');

// We need to tell Popper to update the tooltip position
// after we show the tooltip, otherwise it will be incorrect
popperInstance.update();
}

function hide() {
tooltip.removeAttribute('data-show');
}

const showEvents = ['mouseenter', 'focus'];
const hideEvents = ['mouseleave', 'blur'];

showEvents.forEach(event => {
iconbar.addEventListener(event, show);
});

hideEvents.forEach(event => {
iconbar.addEventListener(event, hide);
});