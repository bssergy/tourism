var connection = require('./Db');
var mysql = require('mysql');

module.exports.getAllPaged = function (page, size, cb) {
	connection.query(
	   'SELECT 													\
	    	ResourseId,											\
	    	Name,												\
	    	Description,										\
	    	CreatedOn											\
	    FROM resourse 											\
	    ORDER BY ResourseId 					 				\
	    LIMIT ' + page * size + ',' + size,
		function (err, rows, fields) {
			if (err) {
				cb(err);
			};

			var resourses = rows;
			connection.query('SELECT COUNT(1) AS Count FROM resourse', function (err, rows) {
				if (err) {
					cb(err);
				};

				cb(null, { resourses: resourses, count: rows[0].Count });
			});
		}
	);
};

module.exports.add = function (resourse, cb) {
	connection.query(
		'INSERT INTO resourse SET ?',
		{ 
			RegionId: resourse.RegionId, 
			Name: resourse.Name, 
			PhotoUrl: resourse.PhotoUrl, 
			Description: resourse.Description, 
			Content: resourse.Content 
		},
		function (err, result) {
			if (err) {
				cb(err);
			};
			var resourseId = result.insertId;

			var attachForTypeOfTourism = function (typeOfTourismId, cb) {
				connection.query('INSERT INTO resourse_type_of_tourism SET ?',
				{
					ResourseId: resourseId,
					TypeOfTourismId: typeOfTourismId
				},
				function (err, results) {
					cb(err, results);
				});
			}

			var attachForTypesOfTourism = function (typeOfTourismIds, cb) {
				if (!typeOfTourismIds.length) { 
					cb();
					return;
				};

				var typeOfTourismId = typeOfTourismIds.pop();

				attachForTypeOfTourism(typeOfTourismId, function (err, results) {
					if (err) {
						cb(err);
					};

					attachForTypesOfTourism(typeOfTourismIds, cb);
				})
			}

			var attachForTypeOfResourse = function (typeOfResourseId, cb) {
				connection.query('INSERT INTO resourse_type_of_resourse SET ?',
				{
					ResourseId: resourseId,
					TypeOfResourseId: typeOfResourseId
				},
				function (err, results) {
					cb(err, results);
				});
			}

			var attachForTypesOfResourse = function (typeOfResourseIds, cb) {
				if (!typeOfResourseIds.length) { 
					cb();
					return;
				};

				var typeOfResourseId = typeOfResourseIds.pop();

				attachForTypeOfResourse(typeOfResourseId, function (err, results) {
					if (err) {
						cb(err);
					};

					attachForTypeOfResourse(typeOfResourseIds, cb);
				})
			}

			var fn = Array.isArray(resourse.TypeOfTourismId) ? attachForTypesOfTourism : attachForTypeOfTourism;
			fn.apply(this, [resourse.TypeOfTourismId, function () {
				var fn = Array.isArray(resourse.TypeOfResourseId) ? attachForTypesOfResourse : attachForTypeOfResourse;
				fn.apply(this, [resourse.TypeOfResourseId, cb]);
			}]);
		}
	);
}