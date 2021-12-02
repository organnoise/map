class Pin {
  constructor(variableName, x, y, xOffset, yOffset){
    //I don't know how else to get the variable name
    this.variableName = variableName;
    //Psuedo coordinates
    this.v = createVector(x,y);

    //Offset for pin CSS
    this.xOffset = xOffset;
    this.yOffset = yOffset;

    //This will be where text about the pin goes eventually
    this.text = '';

    //P tag with FA icon and onclick event
    this.p = createDiv('<span onclick="openPinInfo('+variableName+'.v)"><i class="fas fa-map-marker-alt"></i></span>');
    this.p.class('pin');
    //Enable zoom while scrolling on pin
    this.p.mouseWheel(changeSize);
  }

  //Set where the <p> tag moves
  setP(tx, ty){
    this.p.position((this.v.x - this.xOffset) + tx, (this.v.y - this.yOffset) + ty);
  }

  //Move the vectors when you zoom
  scaleVector(s) {
    this.v.x *= s;
    this.v.y *= s;
  }

}
