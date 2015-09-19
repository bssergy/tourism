var express = require('express');
var router = express.Router();
var region = require('./../models/Region');
var typeOfTourism = require('./../models/TypeOfTourism');
var groupOfResourse = require('./../models/GroupOfResourse');
var resourse = require('./../models/Resourse');

/* GET home page. */
router.get('/', function(req, res, next) {
	var typesOfResourseInput = req.query.typeOfResourseInput;
	var selectedRegion = req.query.rid;
	var selectedTypesOfTourism = req.query.ttid || [];
	var selectedTypesOfResourse = req.query.trid || [];
	var page = parseInt(req.query.page) || 0;
	var pageSize = 12;
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
				
				resourse.getAllPaged(page, 12, function (err, results) {
					if (err) {
						next(err);
					};

					var pagesCount = Math.ceil(results.count / pageSize);
					if (page + 1 > pagesCount) {
						res.status(404);
						return next();
					};

					res.render('index', 
						{ 
							title: 'Туристичні ресурси України',
							regions: regions,
							typesOfTourism: typesOfTourism,
							groupsOfResourse: groupsOfResourse,
							selectedRegion: selectedRegion,
							selectedTypesOfTourism: selectedTypesOfTourism,
							selectedTypesOfResourse: selectedTypesOfResourse,
							resourses: results.resourses,
							page: page,
							last: page + 1 >= pagesCount
						}
					);
				});
			});
		});
	});
});

module.exports = router;
