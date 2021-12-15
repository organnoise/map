class Pin {
  constructor(variableName, x, y, xOffset, yOffset, info){
    //I don't know how else to get the variable name
    this.variableName = variableName;
    //Psuedo coordinates
    this.v = createVector(x,y);

    //Offset for pin CSS
    this.xOffset = xOffset;
    this.yOffset = yOffset;

    //Any info needed for the interface (Title, Description, Video Link, etc.)
    this.info = info;

    //P tag with FA icon and onclick event
    this.p = createDiv('<span onclick="openPinInfo('+variableName+')"><i class="fas fa-map-marker-alt"></i></span>');
    this.p.class('pin');
    this.p.parent('map-canvas');
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
