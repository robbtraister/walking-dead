var fs = require('fs')
var exec = require('child_process').exec

var src = './abridged/epubs/built'
var dest = './abridged/content'
fs.readdirSync(src).forEach(function (issue) {
  if (issue.substr(0, 1) !== '.') {
    var command = 'unzip "' + src + '/' + issue + '" -d "' + dest + '/' + issue.split('.', 1)[0] + '"'
    // console.log(command);
    exec(command)
  }
})
