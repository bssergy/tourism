var express = require('express');
var router = express.Router();
var region = require('./../models/Region');
var typeOfTourism = require('./../models/TypeOfTourism');
var groupOfResourse = require('./../models/GroupOfResourse');
var resourse = require('./../models/resourse');

/* GET home page. */
router.get('/resourse', function(req, res, next) {
	var selectedRegion = req.query.region;
	resourse.getAllPaged(0, 10, function (err, resourses) {
		if (err) {
			next(err);
		};

		res.render('./admin/admin', { resourses: resourses });
	}, next);
});

router.get('/resourse/add', function(req, res, next) {
	region.getAll(function (regions) {
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

router.post('/resourse', function(req, res, next) {
	resourse.add(req.body, function (result) {
		res.redirect('/admin/resourse');
		return;
	}, next);
});

module.exports = router;
