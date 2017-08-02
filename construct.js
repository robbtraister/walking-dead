var fs = require('fs')
var handlebars = require('handlebars')
var imageSize = require('image-size')
var exif = require('exif')

function cp (src, dst) {
  fs.createReadStream(src).pipe(fs.createWriteStream(dst))
}

function getImageSize (imgFile, cbk) {
  try {
    cbk(null, imageSize(imgFile))
  } catch (e) {
    return new exif.ExifImage({image: imgFile}, (err, data) => {
      if (err) {
        cbk(err)
      } else {
        cbk(null, {
          width: data.exif.ExifImageWidth,
          height: data.exif.ExifImageHeight
        })
      }
    })
  }
}

var TOC_TEMPLATE = handlebars.compile(String(fs.readFileSync('./template/toc.ncx.hbs')))
var METADATA_TEMPLATE = handlebars.compile(String(fs.readFileSync('./template/metadata.opf.hbs')))
var PAGE_TEMPLATE = handlebars.compile(String(fs.readFileSync('./template/page.xhtml.hbs')))

function Builder (srcDir, title, author) {
  this.srcDir = srcDir
  this.title = title
  this.author = author
}

Builder.prototype.makePage = function (title, page) {
  getImageSize(
    this.srcDir + '/OEBPS/images/' + page + '.jpg',
    function (err, dimensions) {
      if (err) {
        throw err
      }
      fs.writeFileSync(this.srcDir + '/OEBPS/' + page + '.xhtml', PAGE_TEMPLATE({
        title: this.title,
        page: page,
        width: dimensions.width,
        height: dimensions.height
      }))
    }.bind(this)
  )
}

Builder.prototype.buildIssue = function () {
  cp('./template/mimetype', this.srcDir + '/mimetype')
  if (!fs.existsSync(this.srcDir + '/META-INF')) {
    fs.mkdirSync(this.srcDir + '/META-INF')
  }
  cp('./template/META-INF/container.xml', this.srcDir + '/META-INF/container.xml')

  var files = fs.readdirSync(this.srcDir + '/OEBPS/images')
  var pages = files.filter(function (f) {
    return f.charAt(0) !== '.'
  }).map(function (f) {
    return f.split('.', 1)[0]// f.match(/^([^.]+)\.jpg$/)[1];
  })

  pages.sort()

  fs.writeFileSync(this.srcDir + '/toc.ncx', TOC_TEMPLATE({
    title: this.title
  }))

  fs.writeFileSync(this.srcDir + '/metadata.opf', METADATA_TEMPLATE({
    title: this.title,
    author: this.author,
    pages: pages.slice(1),
    cover: pages[0]
  }))

  pages.forEach(function (page) {
    this.makePage(this.title, page)
  }.bind(this))
}

var builder = new Builder(process.argv[2], process.argv[3], process.argv[4])
builder.buildIssue()
