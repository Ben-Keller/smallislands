


const tooltipTarget = document.querySelector('#tooltipTarget');
const tooltipPortfolio = document.querySelector('#tooltipPortfolio');
const tooltipCountry = document.querySelector('#tooltipCountry');
const tooltipIndicator = document.querySelector('#tooltipIndicator');

const sidsTarget = document.querySelector('.sidsTarget');
const portfolioCountry = document.querySelector('.hoverPortfolio');

//pillars and targets




/*


const popperInstance = Popper.createPopper(sidsTarget, tooltipTarget,
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
sidsTarget.addEventListener(event, show);
});

hideEvents.forEach(event => {
sidsTarget.addEventListener(event, hide);
});


*/




///Portfolio
/////////

const popperPortfolio = Popper.createPopper(portfolioCountry, tooltipPortfolio,
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
tooltipPortfolio.setAttribute('data-show', '');

// We need to tell Popper to update the tooltip position
// after we show the tooltip, otherwise it will be incorrect
popperPortfolio.update();
}

function hide() {
tooltipPortfolio.removeAttribute('data-show');
}

const showEvents = ['mouseenter', 'focus'];
const hideEvents = ['mouseleave', 'blur'];

showEvents.forEach(event => {
portfolioCountry.addEventListener(event, show);
});

hideEvents.forEach(event => {
portfolioCountry.addEventListener(event, hide);
});


