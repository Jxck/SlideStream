if (typeof window === 'undefined') {
  // for jasmine-node
  var diff_launch = require('../lib/diff_launch');
}

describe('jasmine-node', function() {
  it('should pass', function() {
    expect(diff_launch()).toEqual('ok');
  });
});
