var log = console.log.bind(console);
if (typeof window === 'undefined') {
  var diff_match_patch = require('./diff_match_patch').diff_match_patch;
}
var dmp = new diff_match_patch();

function text2patch(text1, text2) {
  var diff = dmp.diff_main(text1, text2, true);
  // if (diff.length > 2) {
  //   dmp.diff_cleanupSemantic(diff);
  // }
  var patch_list = dmp.patch_make(text1, text2, diff);
  var patch_text = dmp.patch_toText(patch_list);
  log(patch_text);
  return patch_text;
}

if (typeof window === 'undefined') {
  module.exports = text2patch;
}
