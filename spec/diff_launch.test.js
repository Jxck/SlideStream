/**
 * diff_launch.test.js
 */
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

describe('usecase', function() {
  var old_text, new_text;
  beforeEach(function() {
    old_text = 'google diff match patch';
    new_text = 'google daff match patch';
  });
  it('should success', function() {
    var patch = make_patch(old_text, new_text);
    var result = apply_patch(old_text, patch);
    expect(result).toEqual(new_text);
  });
  it('empty case', function() {
    old_text = '';
    var patch = make_patch(old_text, new_text);
    var result = apply_patch(old_text, patch);
    expect(result).toEqual(new_text);
  });
});
