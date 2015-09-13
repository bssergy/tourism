var connection = require('./Db');

module.exports.getAll = function (cb) {
	connection.query('SELECT GroupOfResourseId, Name FROM group_of_resourse',
		function (err, rows, fields) {
			if (err) {
				cb(err);
			};

			cb(null, rows);
		}
	);
};

module.exports.getAllWithTypesOrResourses = function (cb) {
	connection.query(
	   'SELECT 																		\
			g.GroupOfResourseId,													\
		    g.Name AS GroupName,													\
		    t.Name,																	\
		    t.TypeOfResourseId 														\
		FROM group_of_resourse g 													\
		LEFT JOIN type_of_resourse t ON g.GroupOfResourseId = t.GroupOfResourseId 	\
		ORDER BY g.GroupOfResourseId, t.TypeOfResourseId;',
		function (err, rows) {
			if (err) {
				cb(err);
			};

			var group;
			var groups = [];

			for (var i = 0; i < rows.length; i++) {
				var type = rows[i];
				if (!group || group.GroupOfResourseId != type.GroupOfResourseId) {
					group = {
						GroupOfResourseId: type.GroupOfResourseId,
						Name: type.GroupName
					};
					group.types = [];
					groups.push(group);
				}

				group.types.push({ TypeOfResourseId: type.TypeOfResourseId, Name: type.Name });
			}

			cb(null, groups);
		}
	);
};