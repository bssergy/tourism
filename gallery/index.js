var fs = require('fs');
var path = require('path');

module.exports = function(pathToGallery) {
	var SERVER_ROOT = './public';
	var CLIENT_ROOT = '/';

	var functions = {};
	functions.getFilelist = function (dir_path, done) {
		var serverPath = path.join(SERVER_ROOT, dir_path);
		var clientPath = path.join(CLIENT_ROOT, dir_path);
		var results = { path: clientPath, directories: [], files: [] };
		if (clientPath != '\\images\\content') {
			console.log(clientPath);
			results.directories.push({ path: path.dirname(clientPath) });
		};

		fs.readdir(serverPath, function (err, files) {
			if (err) return done(err);
			var pending = files.length;
			if (!pending) return done(null, results);
			files.forEach(function (file) {
				var serverFilePath = path.join(serverPath, file);
				var clientFilePath = path.join(clientPath, file);
				fs.stat(serverFilePath, function (err, stat) {
					if (stat && stat.isDirectory()) {
						var directory = { path: clientFilePath, directories: [], files: [] };
						results.directories.push(directory);
						if (!--pending) done(null, results);
					} else {
						results.files.push(clientFilePath);
						if (!--pending) done(null, results);
					}
				});
			});
		});
	}

	return functions;
}