if (typeof window === 'undefined') {
  // for jasmine-node
  var make_patch = require('../lib/diff_launch').make_patch;
  var apply_patch = require('../lib/diff_launch').apply_patch;
}

describe('make_patch', function() {
  it('should pass', function() {
    expect(make_patch).toBeTruthy();
  });
  it('should return patch_text', function() {
    var patch = make_patch('asdf', 'adf');
    expect(patch).toBeTruthy();
  });
});

describe('apply_patch', function() {
  var patch;
  beforeEach(function() {
    patch = make_patch('asdf', 'adf');
  });
  it('should pass', function() {
    expect(apply_patch).toBeTruthy();
  });
  it('should return original text', function() {
    var original = apply_patch('adf', patch);
    expect(original).toBeTruthy();
  });
});
