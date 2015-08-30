var express = require('express');
var router = express.Router();
var region = require('./../models/Region');
var typeOfTourism = require('./../models/TypeOfTourism');
var groupOfResourse = require('./../models/GroupOfResourse');
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
	var selectedRegion = req.query.region;
	var regions = region.getAll(function (regions) {
		var typesOfTourism = typeOfTourism.getAll(function (typesOfTourism) {
			var groupsOfResourse = groupOfResourse.getAllWithTypesOrResourses(function (groupsOfResourse) {
				res.render('./admin/admin', 
					{ 
						title: 'Туристичні ресурси України',
						regions: regions,
						typesOfTourism: typesOfTourism,
						groupsOfResourse: groupsOfResourse,
						selectedRegion: selectedRegion
					}
				);
			}, next);
		}, next);
	}, next);
});

router.get('/add', function(req, res, next) {
	var regions = region.getAll(function (regions) {
		var typesOfTourism = typeOfTourism.getAll(function (typesOfTourism) {
			var groupsOfResourse = groupOfResourse.getAllWithTypesOrResourses(function (groupsOfResourse) {
				res.render('./admin/add', 
					{ 
						title: 'Новий ресурс',
						regions: regions,
						typesOfTourism: typesOfTourism,
						groupsOfResourse: groupsOfResourse
					}
				);
			}, next);
		}, next);
	}, next);
});

router.get('/gallery', function(req, res, next) {
	var dir_path = './public/images/content';
	var readdir = function (dir_path, done) {
		var results = { path: dir_path, directories: [], files: [] };
		fs.readdir(dir_path, function (err, files) {
			if (err) return done(err);
			var pending = files.length;
			if (!pending) return done(null, results);
			files.forEach(function (file) {
				var absolutePath = path.join(dir_path, file);
				fs.stat(absolutePath, function (err, stat) {
					if (stat && stat.isDirectory()) {
						var directory = { path: absolutePath, directories: [], files: [] };
						results.directories.push(directory);
						if (!--pending) done(null, results);
					} else {
						results.files.push(absolutePath);
						if (!--pending) done(null, results);
					}
				});
			});
		});
	};
	readdir(dir_path, function (err, files) {
		if (err) { next(err) };		res.render('./admin/gallery', { files: files });
	})
	
});

module.exports = router;
