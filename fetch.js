var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');

var request = require('request');
var xmldom = require('xmldom');


Object.array = function(obj) {
  var arr = [];
  for (var i=0; i<obj.length; i++) {
    arr.push(obj[i]);
  }
  return arr;
}


function download(uri, fp, cb) {
	http.get(uri, function(res) {
    if (res.statusCode === 200) {
      var f = fs.createWriteStream(fp);
      if (cb) {
        res.on('end', cb);
      }
  	  res.pipe(f);
    } else if (cb) {
      cb(res.statusCode);
    }
	});
};


function getImgUri(uri, cb) {
  request(uri, function(err, response, body){
    if (err) {
      return cb(err);
    }

    var dom = new xmldom.DOMParser({errorHandler: function(){}}).parseFromString(body);

    var base = dom.getElementsByTagName('base');
    if (base && base.length) {
      base = Object.array(base[0].attributes).filter(function(att){
        return att.name === 'href';
      })[0].value;
    } else {
      base = '';
    }

    var img = Object.array(dom.getElementsByTagName('img')).filter(function(img){
      return Object.array(img.attributes).filter(function(att){
        return att.name === 'class' && att.value === 'picture';
      }).length > 0;
    });

    if (img.length > 0) {
      var href = Object.array(img[0].attributes).filter(function(att){
        return att.name === 'src';
      })[0].value;

      return cb(null, url.resolve(url.resolve(uri, base), href));
    }

    return cb(404);
  });
}


function getPage(chapter, page, cb) {
  var c = ('00' + chapter).substr(-3)
  var p = ('00' + page).substr(-3)
  fp = path.join(__dirname, 'omg-beau-peep', 'unabridged', 'content', 'c' + c + '-p' + p + '.jpg')
  if (fs.existsSync(fp)) {
    cb();
  } else {
    getImgUri(
      'http://www.omgbeaupeep.com/comics/The_Walking_Dead/' + chapter + '/' + page + '/',
      function(err, uri){
        if (err) {
          if (cb) {
            return cb(err);
          }
          return;
        }
        console.log(uri)

        download(uri, fp, cb);
      }
    );
  }
}

function getIssue(chapter, cb) {
  var page = 1;

  function next(err) {
    if (err) {
      if (cb) {
        return cb(page === 1 && err);
      }
      return;
    }

    page += 1;
    getPage(chapter, page, next);
  }

  getPage(chapter, page, next);
}



var issue = 163;
function next(err) {
  if (err) {
    return;
  }
  issue += 1;
  getIssue(issue, next);
}
getIssue(issue, next);
