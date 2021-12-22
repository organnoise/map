
// Find Layers Items
const layers = document.querySelectorAll('div.map-layers > ul > li > a');

//remove all .active CSS then put it back on clicked element
function activeLink(){
  layers.forEach( (item) => item.classList.remove('active'));
  this.classList.add('active')

  // Hide All layers
  // Load New Layer
  // Load new icons into LEGEND

}
// make activeLink() the 'click' callback function
layers.forEach((item) => item.addEventListener('click', activeLink));
