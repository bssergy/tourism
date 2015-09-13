var express = require('express');
var router = express.Router();
var region = require('./../models/Region');
var typeOfTourism = require('./../models/TypeOfTourism');
var groupOfResourse = require('./../models/GroupOfResourse');
var resourse = require('./../models/resourse');

/* GET home page. */
router.get('/resourse', function(req, res, next) {
	var selectedRegion = req.query.region;

	var page = parseInt(req.query.page) || 0;
	var pageSize = parseInt(req.query.pageSize) || 10;
	
	resourse.getAllPaged(page, pageSize, function (err, results) {
		if (err) {
			next(err);
		};

		var pagesCount = Math.ceil(results.count / pageSize);

		res.render('./admin/admin', {
			resourses: results.resourses,
			page: page,
			pageSize: pageSize,
			pagesCount: pagesCount
		});
	});
});

router.get('/resourse/add', function(req, res, next) {
	region.getAll(function (err, regions) {
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

				res.render('./admin/add', 
					{ 
						title: 'Новий ресурс',
						regions: regions,
						typesOfTourism: typesOfTourism,
						groupsOfResourse: groupsOfResourse
					}
				);
			});
		});
	});
});

router.get('/resourse/edit/:id', function(req, res, next) {
	region.getAll(function (err, regions) {
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

				resourse.getById(req.params.id, function (err, resourse) {
					if (err) {
						next(err);
					};

					res.render('./admin/add', 
					{ 
						title: 'Редагування ресурсу',
						regions: regions,
						typesOfTourism: typesOfTourism,
						groupsOfResourse: groupsOfResourse,
						resourse: resourse
					});
				});
			});
		});
	});
});

router.post('/resourse/add', function(req, res, next) {
	resourse.addOrUpdate(req.body, function (result) {
		res.redirect('/admin/resourse');
		return;
	}, next);
});

module.exports = router;
