class Pin {
  constructor(variableName, x, y, xOffset, yOffset){
    //I don't know how else to get the variable name
    this.variableName = variableName;
    this.v = createVector(x,y);
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.text = '';
    this.p = createP('<span class="pin" onclick=openPinInfo('+variableName+'.v)><i class="fas fa-map-marker-alt"></i></span>');
  }

  setP(tx, ty){
    this.p.position((this.v.x - this.xOffset) + tx, (this.v.y - this.yOffset) + ty);
  }
}
