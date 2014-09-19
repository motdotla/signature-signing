(function(exports){

  var SignatureFabric = function() {
    this.pages        = [];
    this.style_width  = null;
    this.style_height = null;
    this.canvases     = [];
    this.fabrics      = [];

    return this;
  };

  SignatureFabric.prototype.init = function() {
    if (this.pages.length > 0) {
      this._drawPagesCanvases();
    } else {
      console.error("Could not find any pages to initialize on.");
    }
  };

  SignatureFabric.prototype._drawPagesCanvases = function() {
    for (var i = 0; i < this.pages.length; i++) {
      this._drawPageCanvas(i+1);
    }
  };

  SignatureFabric.prototype._drawPageCanvas = function(page_number) {
    var canvas        = document.createElement('canvas');
    canvas.className  = "signature-document-canvas";
    canvas.id         = "signature-document-canvas-"+page_number;
    canvas.width      = 1000;
    canvas.height     = 1294;

    this.pages[page_number-1].appendChild(canvas);
    this.canvases.push(canvas);

    var fab                         = new fabric.Canvas("signature-document-canvas-"+page_number);
    fab.selection = false; // disable global canvas selection
    //fab.signature_page_id           = this.json.documents[0].pages[page_number-1];
    //this.fabricEvents(fab);

    fab.setWidth(this.style_width);
    fab.setHeight(this.style_height);
    fab.calcOffset();

    return this.fabrics.push(fab);
  };

  exports.SignatureFabric = SignatureFabric;

}(this));

MicroEvent.mixin(SignatureFabric);
var signature_fabric = new SignatureFabric();
