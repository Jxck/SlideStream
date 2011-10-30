var page = new WebPage(),
    address, output, size, width, height, paperwidth, paperheight;

console.log(phantom.args);
// console.log('Usage: rasterize.js URL destination width height paperwidth paperheight]');
// console.log('default width:1024 height:768 paperwidth:48.77cm paperheight:17.43cm');
address = phantom.args[0];
output = phantom.args[1];
width = phantom.args[2];
height = phantom.args[3];
paperwidth = phantom.args[4];
paperheight = phantom.args[5];


console.log('address is:');
console.log(address);
console.log('output is:');
console.log(output);
console.log('width is:');
console.log(width);
console.log('height is:');
console.log(height);
console.log('paperwidth is:');
console.log(paperwidth);
console.log('paperheight is:');
console.log(paperheight);

page.viewportSize = { width: width, height: height };
page.paperSize = { width: paperwidth, height: paperheight, border: '0px' }

page.open(address, function (status) {
  console.log(status);
  if (status !== 'success') {
    console.log('Unable to load the address!');
  } else {
    window.setTimeout(function () {
      page.render(output);
      phantom.exit();
    }, 200);
  }
});

