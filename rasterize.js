var page = new WebPage(),
    address, output, size, width, height, paperwidth, paperheight;

address = phantom.args[0];
output = phantom.args[1];
width = phantom.args[2];
height = phantom.args[3];
paperwidth = phantom.args[4];
paperheight = phantom.args[5];

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

