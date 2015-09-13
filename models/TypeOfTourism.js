var connection = require('./Db');

module.exports.getAll = function (cb) {
	connection.query('SELECT TypeOfTourismId, Name FROM type_of_tourism',
		function (err, rows, fields) {
			if (err) {
				cb(err);
			};

			cb(null, rows);
		}
	);
};