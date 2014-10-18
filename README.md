# signature-signing

<img src="https://raw.githubusercontent.com/motdotla/signature-signing/master/signature-signing.gif" alt="signature-signing" align="right" width="280" />

JavaScript library that renders the signature elements on top of a rendered [signature-document](https://github.com/motdotla/signature-document). It uses a [signature-signing](https://github.com/motdotla/signature-signing#signature-signing-blueprint) blueprint to render the signature elements.

It works in tandem with the [signature-document](https://github.com/motdotla/signature-document) library to turn the signature-document into a signable document. It's dependent on signature-document and hooks into it via an evented system.

```html
<script src='/path/to/signature-document.js' data-signature-document-url="http://example.com/path/to/signature/document.json"></script>
<script src='/path/to/signature-signing.js' data-signature-signing-url="http://example.com/path/to/signature/signing.json"></script>
<script src='/path/to/jafja.js'></script>
<script>
  signature_document.jafja = jafja;
  signature_document.init();
  jafja.bind('signature_document.rendered', function(values) {
    signature_signing.jafja = jafja;
    signature_signing.fabrics = values.fabrics;
    signature_signing.multiplier = values.fabrics;
    signature_signing.init();
  });
</script>
```

## Usage

Place the script tag in the body of an html page. Bind to the signature-document rendered event, and initialize the signature-signing library inside of that.

```html
<script src='/path/to/signature-document.js' data-signature-document-url="http://example.com/path/to/signature/document.json"></script>
<script src='/path/to/signature-signing.js' data-signature-signing-url="http://example.com/path/to/signature/signing.json"></script>
<script src='/path/to/jafja.js'></script>
<script>
  signature_document.jafja = jafja;
  signature_document.init();
  jafja.bind('signature_document.rendered', function(values) {
    signature_signing.jafja = jafja;
    signature_signing.fabrics = values.fabrics;
    signature_signing.multiplier = values.fabrics;
    signature_signing.init();
  });
</script>
```

### init()

```javascript
signature_signing.init();
```

### drawTextElement(text_element_json)

```javascript
var text_element_json = { x: 20, y: 20, content: "Some Text", page_number: 1, id: "some-unique-id"}
signature_signing.drawTextElement(text_element_json);
```

### drawSignatureElement(signature_element_json)

```javascript
var signature_element_json = { x: 20, y: 20, url: "dataurl", page_number: 1, id: "some-unique-id"}
signature_signing.drawSignatureElement(signature_element_json);
```

### removeSelectedObject()

```javascript
signature_signing.removeSelectedObject();
```

### jafja

```javascript
signature_signing.jafja = jafja
```

Set jafja to a [jafja](http://github.com/motdotla/jafja) object.

This exposes a series of events you can bind to.

### Events

#### signature_signing.rendered

jafja.bind('signature_signing.rendered', function(values) {
  console.log('signature_signing.rendered', values);
});

The result is an object of values.

* `id` - The id of the signing session.
* `status` - The status of the signing session - signed or signing.

```javascript
{
  id: 'unique-id',
  status: 'signing'
}
```

#### signature_signing.object.removed

```javascript
jafja.bind('signature_signing.object.removed', function(values) {
  console.log('signature_signing.object.removed', values);
});
```

The result is an object of values.

* `id` - The id of the object (element) modified.
* `type` - Either 'signature_element' or 'text_element'.

```javascript
{
  id: 'unique-id',
  type: 'signature_element'
}
```

## Signature Signing Blueprint

A signature-signing should be built in the following format. This is a working blueprint and subject to change.

The format borrows from [json:api](http://jsonapi.org/). It should have a signings array, but with only one signing in the array. Nested inside shall be a signature_elements array or a text_elements array. Each signature_element should have a page_number as an integer, a url as an image, an x position, and a y position. Each text_element should have a page_number as an integer, a content as text, an x position, and a y position.

```json
{
  "signings": [
    {
      "signature_elements": [
        {
          "x": 20,
          "y": 20,
          "page_number": 1,
          "url": "data:image/gif;base64,R0lGODlhRAIEAaIAAOLi1v7+5enp2ubm2Pf34e7u3QAAAAAAACH5BAAHAP8ALAAAAABEAgQBAAP/GLrc/jDKSau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru987//AoHBILBqPyKRyyWw6n9CodEqtWq/YrHbL7Xq/4LB4TC6bz+i0es1uu9/wuHxOr9vv+Lx+z+/7/4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAMKHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mix/6PHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLly5gza97MubPnz6BDix5NurTp06hTq17NurXr17Bjy55Nu7bt27hz697Nu7fv38CDCx9OvLjx48iTK1/OvLnz59CjS59Ovbr169g5CADAnUCE7QAEZE9DgDuAARAKmB+vZoB57w3Ud2dP3rx4BuXn009jHgD8AP/5AVDAfmrIF94C5g1IoBr9eQfefQumYWABBkbIRn/vWbgGeBlqqEaAAnq4BogKingGiNyZiAaG+qk4xoMBoueiGPLJ2OCMYBgIn4EQ4rhFgP8FcKOPWgRYogITEqlFgg/0pyQWD6bHZAMsYuhAlVZSieV6Wm4JwJVeftnllmB6WSaZY2J5ppppVrmmm22y+KaccWbJQJhi3hnmnHYiuGedTgLKpZ5mCpqioXn6WSihaDLKpqNwQkrnC1FGEKiklyraqKaPchqpp5OC2qcCePKZKal/YnqqkKmKumqpiJo6qKuzoroorYeqWiurt9q6qa+dAvupsKESOyqvvyIbrLKKwzJbLAsERDtBtNIaKmuuuCZq7KutbrsrrLpi6624zh4LbrbXalsut72u+2237pJ77rjqzhtvvfDaq2++/LZr75MAByzwwAQXbPDBCCes8MIMN+zwwxBHLPHEFFds8cUYZ6zxxhx37PHHIIcs8sgkl2zyySinrPLKLLfs8sswxyzzzDTXbPPNbiUAADs="
        }
      ],
      "text_elements": [
        {
          "x": 22,
          "y": 22,
          "page_number": 1,
          "content": "Some Text"
        }
      ]
    }
  ]
}
```
