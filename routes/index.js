var express = require('express');
var router = express.Router();
var region = require('./../models/Region');
var typeOfTourism = require('./../models/TypeOfTourism');
var groupOfResourse = require('./../models/GroupOfResourse');
var resourse = require('./../models/Resourse');

/* GET home page. */
router.get('/', function(req, res, next) {
	var selectedRegion = req.query.region;
	var regions = region.getAll(function (err, regions) {
		if (err) {
			next(err);
		};

		var typesOfTourism = typeOfTourism.getAll(function (err, typesOfTourism) {
			if (err) {
				next(err);
			};

			var groupsOfResourse = groupOfResourse.getAllWithTypesOrResourses(function (err, groupsOfResourse) {
				if (err) {
					next(err);
				};

				resourse.getAllPaged(0, 12, function (err, resourses) {
					if (err) {
						next(err);
					};
					
					res.render('index', 
						{ 
							title: 'Туристичні ресурси України',
							regions: regions,
							typesOfTourism: typesOfTourism,
							groupsOfResourse: groupsOfResourse,
							selectedRegion: selectedRegion,
							resourses: resourses
						}
					);
				});
			});
		});
	});
});

module.exports = router;
