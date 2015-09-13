var connection = require('./Db');

module.exports.getAll = function (cb) {
	connection.query('SELECT TypeOfResourseId, GroupOfResourseId, Name FROM type_of_resourse',
		function (err, rows, fields) {
			if (err) {
				cb(err);
			};

			cb(null, rows);
		}
	);
};