var connection = require('./Db');
var mysql = require('mysql');
var async = require('async');

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

var getById = function (id, cb) {
	connection.query(
	   'SELECT 													\
	    	ResourseId,											\
	    	RegionId,											\
	    	Name,												\
	    	Description,										\
	    	CreatedOn,											\
	    	PhotoUrl											\
	    FROM resourse 											\
	    WHERE ResourseId = ?',
	    [ id ],
		function (err, rows) {
			if (err) {
				cb(err);
			};

			var resourse = rows[0];
			connection.query(
			   'SELECT TypeOfResourseId 						\
				FROM resourse_type_of_resourse 					\
				WHERE ResourseId = ?',
				[ id ],
				function (err, rows) {
					if (err) {
						cb(err);
					};

					var ids = [];
					rows.forEach(function (item) {
						ids.push(item.TypeOfResourseId);
					});

					resourse.TypeOfResourseIds = ids;

					connection.query(
					   'SELECT TypeOfTourismId 					\
						FROM resourse_type_of_tourism 			\
						WHERE ResourseId = ?',
						[ id ],
						function (err, rows) {
							if (err) {
								cb(err);
							};

							var ids = [];
							rows.forEach(function (item) {
								ids.push(item.TypeOfTourismId);
							});

							resourse.TypeOfTourismIds = ids;

							cb(null, resourse);
						}
					);
				}
			);
		}
	);
};

module.exports.getById = getById;

module.exports.addOrUpdate = function (resourse, cb) {
	if (!Array.isArray(resourse.TypeOfTourismIds))
	{
		resourse.TypeOfTourismIds = resourse.TypeOfTourismIds ? [ resourse.TypeOfTourismIds ] : [];
	};

	if (!Array.isArray(resourse.TypeOfResourseIds))
	{
		resourse.TypeOfResourseIds = resourse.TypeOfResourseIds ? [ resourse.TypeOfResourseIds ] : [];
	};

	resourse.TypeOfTourismIds = resourse.TypeOfTourismIds.map(function(item) {
	    return parseInt(item, 10);
	});
	resourse.TypeOfResourseIds = resourse.TypeOfResourseIds.map(function(item) {
	    return parseInt(item, 10);
	});

	if (resourse.ResourseId) {
		update(resourse, cb);
		return;
	};

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

			attachForTypesOfTourism(resourse.TypeOfTourismIds, function (err) {
				attachForTypesOfResourse(resourse.TypeOfResourseIds, cb);
			});
		}
	);
};

var attachTypeOfTourism = function (resourseId, typeOfTourismId, cb) {
	connection.query('INSERT INTO resourse_type_of_tourism SET ?',
	{
		ResourseId: resourseId,
		TypeOfTourismId: typeOfTourismId
	}, cb);
};

var attachTypesOfTourism = function (resourseId, typeOfTourismIds, cb) {
	if (!typeOfTourismIds.length) { 
		cb();
		return;
	};

	var typeOfTourismId = typeOfTourismIds.pop();

	attachTypeOfTourism(resourseId, typeOfTourismId, function (err, results) {
		if (err) {
			cb(err);
		};

		attachTypesOfTourism(resourseId, typeOfTourismIds, cb);
	})
};

var detachTypesOfTourism = function (resourseId, typesOfTourismId, cb) {
	if (typesOfTourismId && !typesOfTourismId.length) {
		cb();
		return;
	};

	var query =
			   'DELETE FROM resourse_type_of_tourism 			\
				WHERE ResourseId = ' + resourseId;

	if (typesOfTourismId) {
		query += ' AND TypeOfTourismId IN (' + typesOfTourismId.join(',') + ')';
	};

	connection.query(query, function (err) {
		cb(err);
	});
};

var attachTypeOfResourse = function (resourseId, typeOfResourseId, cb) {
	connection.query('INSERT INTO resourse_type_of_resourse SET ?',
	{
		ResourseId: resourseId,
		TypeOfResourseId: typeOfResourseId
	}, cb);
};

var attachTypesOfResourse = function (resourseId, typeOfResourseIds, cb) {
	if (!typeOfResourseIds.length) { 
		cb();
		return;
	};

	var typeOfResourseId = typeOfResourseIds.pop();

	attachTypeOfResourse(resourseId, typeOfResourseId, function (err, results) {
		if (err) {
			cb(err);
		};

		attachTypesOfResourse(resourseId, typeOfResourseIds, cb);
	})
};

var detachTypesOfResourse = function (resourseId, typesOfResourseId, cb) {
	if (typesOfResourseId && !typesOfResourseId.length) {
		cb();
		return;
	};

	var query =
			   'DELETE FROM resourse_type_of_resourse 			\
				WHERE ResourseId = ' + resourseId;

	if (typesOfResourseId) {
		query += ' AND TypeOfResourseId IN (' + typesOfResourseId.join(',') + ')';
	};

	connection.query(query, function (err) {
		cb(err);
	});
};

var update = function (resourse, cb) {

	connection.query(
		'UPDATE resourse SET ? WHERE ResourseId = ?',
		[{ 
			RegionId: resourse.RegionId, 
			Name: resourse.Name, 
			PhotoUrl: resourse.PhotoUrl, 
			Description: resourse.Description, 
			Content: resourse.Content 
		}, resourse.ResourseId],
		function (err, result) {
			if (err) {
				cb(err);
			};
			
			getById(resourse.ResourseId, function (err, current) {
				var typesOfResourseToDetach = [];
				current.TypeOfResourseIds.forEach(function (id) {
					if (resourse.TypeOfResourseIds.indexOf(id) < 0) {
						typesOfResourseToDetach.push(id);
					};
				});

				var typesOfResourseToAttach = [];
				resourse.TypeOfResourseIds.forEach(function (id) {
					if (current.TypeOfResourseIds.indexOf(id) < 0) {
						typesOfResourseToAttach.push(id);
					};
				});

				var typesOfTourismToDetach = [];
				current.TypeOfTourismIds.forEach(function (id) {
					if (resourse.TypeOfTourismIds.indexOf(id) < 0) {
						typesOfTourismToDetach.push(id);
					};
				});

				var typesOfTourismToAttach = [];
				resourse.TypeOfTourismIds.forEach(function (id) {
					if (current.TypeOfTourismIds.indexOf(id) < 0) {
						typesOfTourismToAttach.push(id);
					};
				});

				console.log("NEW ITEM");
				console.log(resourse);
				console.log("OLD ITEM");
				console.log(current);
				console.log("typesOfResourseToDetach");
				console.log(typesOfResourseToDetach);
				console.log("typesOfResourseToAttach");
				console.log(typesOfResourseToAttach);
				console.log("typesOfTourismToDetach");
				console.log(typesOfTourismToDetach);
				console.log("typesOfTourismToAttach");
				console.log(typesOfTourismToAttach);

				async.parallel([
						async.apply(detachTypesOfResourse, resourse.ResourseId, typesOfResourseToDetach),
						async.apply(attachTypesOfResourse, resourse.ResourseId, typesOfResourseToAttach),
						async.apply(detachTypesOfTourism, resourse.ResourseId, typesOfTourismToDetach),
						async.apply(attachTypesOfTourism, resourse.ResourseId, typesOfTourismToAttach),
					], function () {
						cb();
					});
			});
		}
	);
};

module.exports.update = update;

module.exports.delete = function  (id, cb) {
	async.parallel([
			async.apply(detachTypesOfResourse, id, null),
			async.apply(detachTypesOfTourism, id, null),
		], function () {
			var query =
			   'DELETE FROM resourse 							\
				WHERE ResourseId = ' + id

			connection.query(query,	function (err) {
				cb(err);
			});
		});

	
}