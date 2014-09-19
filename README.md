# signature-fabric

<img src="https://raw.githubusercontent.com/motdotla/signature-fabric/master/signature-fabric.gif" alt="signature-fabric" align="right" width="280" />

JavaScript library that renders the [fabric.js](http://fabricjs.com/) canvas on top of a rendered [signature-document](https://github.com/motdotla/signature-document).

It works in tandem with the [signature-document](https://github.com/motdotla/signature-document) library to turn the signature-document into a signable document. It's dependent on signature-document and hooks into it via an evented system.

```html
<script src='/path/to/signature-document.js' data-signature-document-url="http://example.com/path/to/signature/document.json"></script>
<script src='/path/to/signature-fabric.js'></script>
<script>
  signature_document.init();
  signature_document.bind('rendered', function(values) {
    console.log('rendered', values);
  });
</script>
```

## Usage

Place the script tag in the body of an html page. Bind to the signature-document rendered event, and initialize the signature-fabric library inside of that.

```html
<script src='/path/to/signature-document.js' data-signature-document-url="http://example.com/path/to/signature/document.json"></script>
<script src='/path/to/signature-fabric.js'></script>
<script>
  signature_document.init();
  signature_document.bind('rendered', function(values) {
    console.log('rendered', values);
  });
</script>
```

