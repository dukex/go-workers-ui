var pickFiles = require('broccoli-static-compiler');
var esTranspiler = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');

var app = pickFiles('app', {
  srcDir: '/',
  destDir: '/'
})

var bower = pickFiles('bower_components', {
    srcDir: '/',
    destDir: '/deps'
});

app = esTranspiler(app, {});

var injectLivereload = require('broccoli-inject-livereload');

app = injectLivereload(app);

var tree = mergeTrees([bower, app]);
module.exports = tree;
