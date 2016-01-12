var fs = require('fs');
var UglifyJS = require('uglify-js');
var Ships = require('./Ships');
var Modules = require('./Modules');

var ast = UglifyJS.parse(['module.exports = ', JSON.stringify({ Ships: Ships, Modules: Modules }), ';'].join(''));
var code = ast.print_to_string({beautify: true, indent_level: 2});

fs.open('./index.js', 'w', function() {
    fs.writeFile('./index.js', code, function(err) {});
});
