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

    //P tag with FA icon
    this.p = createP('<span class="pin" onclick=openPinInfo('+variableName+'.v)><i class="fas fa-map-marker-alt"></i></span>');
  }

  //Set where the <p> tag moves
  setP(tx, ty){
    this.p.position((this.v.x - this.xOffset) + tx, (this.v.y - this.yOffset) + ty);
  }

  scaleVector(s) {
    this.v.x *= s;
    this.v.y *= s;
  }


}
