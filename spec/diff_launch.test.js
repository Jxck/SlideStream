if (typeof window === 'undefined') {
  // for jasmine-node
  var text2patch = require('../lib/diff_launch');
}

describe('jasmine-node', function() {
  it('should pass', function() {
    expect(text2patch).toBeTruthy();
  });
  it('should return patch_text', function() {
    var patch = text2patch('asdf', 'adf');
    expect(patch).toBeTruthy();
  });
});
