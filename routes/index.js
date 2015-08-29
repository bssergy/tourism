var express = require('express');
var router = express.Router();
var region = require('./../models/Region');
var typeOfTourism = require('./../models/TypeOfTourism');
var groupOfResourse = require('./../models/GroupOfResourse');

/* GET home page. */
router.get('/', function(req, res, next) {
	var selectedRegion = req.query.region;
	var regions = region.getAll(function (regions) {
		var typesOfTourism = typeOfTourism.getAll(function (typesOfTourism) {
			var groupsOfResourse = groupOfResourse.getAllWithTypesOrResourses(function (groupsOfResourse) {
				res.render('index', 
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

module.exports = router;
