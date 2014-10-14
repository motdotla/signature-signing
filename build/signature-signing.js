/*! signature-signing.js - 0.0.1 - 2014-10-14 - scottmotte */
(function(exports){

  var SignatureSigning = function() {
    this.multiplier                 = null;
    this.fabrics                    = [];

    this.json                       = {signings: []};
    this.script                     = this.CurrentlyExecutedScript();
    this.signature_signing_url      = this.script.getAttribute("data-signature-signing-url");
    this.signature_element_width    = 232.0;
    this.signature_element_height   = 104.0;
    this.font_size                  = 20;
    this.font_family                = "Helvetica";

    this.jafja = undefined;

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
      self._drawTextElements();

      return true;
    });
  };

  SignatureSigning.prototype._drawSignatureElements = function() {
    if (this.json.signings[0].signature_elements) {
      for(var i = 0; i < this.json.signings[0].signature_elements.length; i++) {
        var signature_element_json = this.json.signings[0].signature_elements[i];
        this.drawSignatureElement(signature_element_json);
      }
    }
  };

  SignatureSigning.prototype.drawSignatureElement = function(signature_element, callback) {
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

  SignatureSigning.prototype._drawTextElements = function() {
    if (this.json.signings[0].text_elements) {
      for(var i = 0; i < this.json.signings[0].text_elements.length; i++) {
        var text_element_json = this.json.signings[0].text_elements[i];
        this.drawTextElement(text_element_json);
      }
    }
  };

  SignatureSigning.prototype.drawTextElement = function(text_element, callback) {
    // payload: {x: 1, y: 1, page_number: 1, id: 1234, content: "Some Text"}
    var self = this;
    var text = new fabric.Text(text_element.content, { 
      honest_left:  parseFloat(text_element.x),
      honest_top:   parseFloat(text_element.y),
      hasControls:  false,
      originX:      "left",
      text_element_id: text_element.id,
      fontFamily:   self.font_family
    });

    self._resizeAndPositionFabricObject(self, text);
    
    var fab_index = text_element.page_number-1;
    var fab       = self.fabrics[fab_index];
    fab.add(text).renderAll();

    if (typeof callback === 'function') {
      return callback(text);
    }
  };

  SignatureSigning.prototype.removeSelectedObject = function(e) {
    if (e) { e.preventDefault(); }  
    var _this = this;

    for (var i=0; i < _this.fabrics.length; i++) {
      var active_object = _this.fabrics[i]._activeObject;
      if (active_object) {
        _this.fabrics[i].remove(active_object);
        _this.jafja.trigger("signature_signing.object.removed", {});
      }
    }
  };

  SignatureSigning.prototype._resizeAndPositionFabricObject = function(self, object) {
    var new_left      = object.honest_left * self.multiplier;
    var new_top       = object.honest_top * self.multiplier;
    var new_height    = object.honest_height * self.multiplier;
    var new_width     = object.honest_width * self.multiplier;
    var new_font_size = self.font_size * self.multiplier;

    if (object.text) {
      object.set({ left: new_left, top: new_top, fontSize: new_font_size});
    } else {
      object.set({ left: new_left, top: new_top, height: new_height, width: new_width });
    }
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

var signature_signing = new SignatureSigning();


(function(SignatureSigning){SignatureSigning.prototype._drawCss = function() {this.css = '@charset "utf-8";';var style = document.createElement('style');style.type = 'text/css';if (style.styleSheet) {style.styleSheet.cssText = this.css;} else {style.appendChild(document.createTextNode(this.css));}return document.body.appendChild(style);};}(SignatureSigning));