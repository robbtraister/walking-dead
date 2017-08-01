var fs = require('fs');
var http = require('http');
var url = require('url');


function get(uri, headers, cbk) {
	var parts = url.parse(uri);
	var options = {
		method: 'GET',
		hostname: parts.host,
		port: parts.protocol == 'https' ? 443 : 80,
		path: parts.path
	};
	if (headers) {
		options.headers = headers;
	}

	http.request(options, function(res){
		var data = '';
		res.on('data', function(chunk){
			data += chunk;
		})
		res.on('end', function() {
			if (cbk) {
				cbk(res, data);
			}
		});
	}).end();
}


function Crawler() {
	this.cookies = null;
}

Crawler.prototype.getCookies = function(cbk) {
	if (this.cookies) {
		if (cbk) {
			cbk(this.cookies);
		}
	} else {
		get('http://www.hellocomic.com/comic/view?slug=the-walking-dead', null, function(res){
			this.cookies = {};
			res.headers['set-cookie'].forEach(function(cookie){
				var kv = cookie.split(';', 1)[0].split('=', 2);
				this.cookies[kv[0]] = kv[1];
			});
			if (cbk) {
				cbk(this.cookies);
			}
		});
	}
};

Crawler.prototype.get = function(uri, cbk) {
	this.getCookies(function(cookies){
		var cookieList = [];
		Object.keys(cookies).forEach(function(cookie){
			cookieList.push(cookie + '=' + cookies[cookie]);
		});

		get(uri, {'Cookie': cookieList.join(';')}, cbk);
	});
};

function getImageUri(data) {
	var d = data.replace(/[\r\n]+/g, ' ');
	var m1 = d.match(/\<div class="coverIssue"\>(.*?)\<\/div\>/m);
	var m2 = m1[1].match(/\<img([^\>]+)/);
	var m3 = m2[1].match(/src="([^"]+)/);
	return m3[1];
};

function getNextPageUri(data) {
	var d = data.replace(/[\r\n]+/g, ' ');
	var m1 = d.match(/\<div class="coverIssue"\>(.*?)\<\/div\>/m);
	var m2 = m1[1].match(/\<a([^\>]+)/);
	var m3 = m2[1].match(/href="([^"]+)/);
	return m3[1];
};

Crawler.prototype.getImage = function(imgUri, imgFile, cbk) {
	var f = fs.createWriteStream(imgFile);
	http.get(imgUri, function(res) {
	  res.pipe(f);
		if (cbk) {
			cbk();
		}
	});
};

Crawler.prototype.getPage = function(chapter, page, cbk) {
	this.get(
		'http://www.hellocomic.com/the-walking-dead/c' + chapter + '/p' + page,
		function(res, data){
			this.getImage(
				getImageUri(data),
				'./unabridged/content/issue ' + chapter + '/OEBPS/images/p' + page + '.jpg',
				function(){
					if (cbk) {
						cbk(data);
					}
				}
			);
		}.bind(this)
	);
};

Crawler.prototype.getChapter = function(chapter, cbk) {
	var chapterUriRE = new RegExp('/c0*' + chapter + '/p[0-9]+$');
	function getNextPage(chapter, page) {
		this.getPage(chapter, page, function(data){
			var nextPageUri = getNextPageUri(data);
			if (nextPageUri.match(chapterUriRE)) {
				getNextPage.call(this, chapter, page+1);
			} else if (cbk) {
				cbk();
			}
		}.bind(this));
	}

	fs.mkdirSync('./unabridged/content/issue ' + chapter);
	fs.mkdirSync('./unabridged/content/issue ' + chapter + '/OEBPS');
	fs.mkdirSync('./unabridged/content/issue ' + chapter + '/OEBPS/images');
	getNextPage.call(this, chapter, 1);
};

Crawler.prototype.getAll = function() {
	function getChapter(chapter) {
		console.log('getting chapter: ' + chapter);
		this.getChapter(chapter, function(){
			if (chapter < 153) {
				getChapter.call(this, chapter+1);
			}
		}.bind(this));
	}

	getChapter.call(this, 1);
}


var crawler = new Crawler();
crawler.getAll();
