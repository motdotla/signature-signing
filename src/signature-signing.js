(function(exports){

  var SignatureSigning = function() {
    this.multiplier                 = null;
    this.fabrics                    = [];

    this.json                       = {signings: []};
    this.script                     = this.CurrentlyExecutedScript();
    this.signature_signing_url      = this.script.getAttribute("data-signature-signing-url");
    this.signature_element_width    = 232.0;
    this.signature_element_height   = 104.0;

    return this;
  };

  SignatureSigning.prototype.init = function() {
    if (this.multiplier === null) {
      console.error("Multipler must be set.");
    }
    if (fabric === null) {
      console.error("Fabric library should be loaded.");
    }
    if (this.fabrics.length < 1) {
      console.error("Fabrics must be set.");
    }
    
    this._getSigning();
  };

  SignatureSigning.prototype._getSigning = function() {
    var self    = this;

    self._drawCss();

    self.Get(self.signature_signing_url, function(resp) {
      self.json                     = resp;

      self._drawSignatureElements();

      //self.FireEvent("rendered", {elements: {pages: self.pages}, style_width: self.style_width, style_height: self.style_height});
      return true;
    });
  };

  SignatureSigning.prototype._drawSignatureElements = function() {
    for(var i = 0; i < this.json.signings[0].signature_elements.length; i++) {
      var signature_element_json = this.json.signings[0].signature_elements[i];
      this._drawSignatureElement(signature_element_json);
    }
  };

  SignatureSigning.prototype._drawSignatureElement = function(signature_element, callback) {
    // i need a way to get the fab out of the signature_element.
    // payload: {x: 1, y: 1, page_number: 1, id: 1234, url: "somepng"}
    var self = this;
    var imgObj = new Image();
    imgObj.src = signature_element.url;
    imgObj.onload = function() {
      var img = new fabric.Image(imgObj, {
        honest_left:    parseFloat(signature_element.x),
        honest_top:     parseFloat(signature_element.y),
        honest_height:  self.signature_element_height,
        honest_width:   self.signature_element_width,
        hasControls:    false,
        originX:        'left',
        originY:        'top',
        signature_element_id: signature_element.id
      });

      self._resizeAndPositionFabricObject(self, img);

      var fab_index = signature_element.page_number-1;
      var fab       = self.fabrics[fab_index];
      fab.add(img).renderAll();

      if (typeof callback === 'function') {
        return callback(img);
      }
    };
  };

  SignatureSigning.prototype._resizeAndPositionFabricObject = function(self, object) {
    var new_left      = object.honest_left * self.multiplier;
    var new_top       = object.honest_top * self.multiplier;
    var new_height    = object.honest_height * self.multiplier;
    var new_width     = object.honest_width * self.multiplier;

    object.set({ left: new_left, top: new_top, height: new_height, width: new_width });
    object.setCoords(); // fixes the select object coordinates to match
  };

  SignatureSigning.prototype.Get = function(url, callback){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState==4 && xmlhttp.status==200){
        callback(JSON.parse(xmlhttp.responseText));
      }
    };

    xmlhttp.send();
  };

  SignatureSigning.prototype.CurrentlyExecutedScript = function() {
    var script;

    if (document) {
      var scripts = document.getElementsByTagName('script');
      script      = scripts[scripts.length - 1];  
    }
    return script;
  };

  exports.SignatureSigning = SignatureSigning;

}(this));

MicroEvent.mixin(SignatureSigning);
var signature_signing = new SignatureSigning();
