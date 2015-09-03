var express = require('express');
var router = express.Router();
var region = require('./../models/Region');
var typeOfTourism = require('./../models/TypeOfTourism');
var groupOfResourse = require('./../models/GroupOfResourse');
var gallery = require('./../gallery')('/images/content');

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

router.get('/gallery:path?*', function(req, res, next) {
	req.query.path = req.query.path || '//images//content';
	gallery.getFilelist(req.query.path, function (err, files) {
		if (err) {
			next(err)
		};

		res.render('./admin/gallery', { files: files });
	});	
});

module.exports = router;
