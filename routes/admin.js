var express = require('express');
var router = express.Router();
var region = require('./../models/Region');
var typeOfTourism = require('./../models/TypeOfTourism');
var groupOfResourse = require('./../models/GroupOfResourse');
var resourse = require('./../models/resourse');

/* GET home page. */
router.get('/resourse', function(req, res, next) {
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

router.get('/resourse/add', function(req, res, next) {
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

router.post('/resourse', function(req, res, next) {
	resourse.add(req.body, function (result) {
		// res.redirect('/admin/resourse');
	}, next);
});

module.exports = router;
