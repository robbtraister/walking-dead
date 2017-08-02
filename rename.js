var fs = require('fs')

/*
var p = './unabridged/content';
fs.readdirSync(p).forEach(function(d){
  var m = d.match(/^issue ([0-9]+)$/);
  if (m) {
    console.log(m);
    var i = m[1];
    i = '000'.substr(i.length) + i;
    var nd = 'issue ' + i;
    fs.renameSync(p + '/' + d, p + '/' + nd);
  }
});
*/

var root = './abridged/content'
fs.readdirSync(root).forEach(function (issue) {
  var m1 = issue.match(/^Walking Dead, The_ Issue ([0-9]+)$/)
  if (m1) {
    var i = ('00' + m1[1]).substr(-3)
    var issueDir = root + '/' + issue
    var imgDir = issueDir + '/OEBPS/images'
    fs.readdirSync(imgDir).forEach(function (imgFile) {
      var m2 = imgFile.match(/^p([0-9]+)\.jpg$/)
      if (m2) {
        var p = m2[1]
        var oldFile = imgDir + '/' + imgFile
        var newFile = './abridged/images/c' + i + '-p' + p + '.jpg'
        fs.renameSync(oldFile, newFile)
      }
    })
  }
})
