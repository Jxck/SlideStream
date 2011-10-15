var log = console.log.bind(console);
if (typeof window === 'undefined') {
  var diff_match_patch = require('./diff_match_patch').diff_match_patch;
}
var dmp = new diff_match_patch();

function make_patch(text1, text2) {
  var diff = dmp.diff_main(text1, text2, true);
  // if (diff.length > 2) {
  //   dmp.diff_cleanupSemantic(diff);
  // }
  var patch_list = dmp.patch_make(text1, text2, diff);
  var patch_text = dmp.patch_toText(patch_list);
  return patch_text;
}

function apply_patch(origin, patch) {
  var patches = dmp.patch_fromText(patch);
  var result = dmp.patch_apply(patches, origin)[0];
  return result;
}

if (typeof window === 'undefined') {
  module.exports = {
    make_patch: make_patch,
    apply_patch: apply_patch
  };
}
