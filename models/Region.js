var connection = require('./Db');

module.exports.getAll = function (cb, next) {
	connection.query('SELECT RegionId, Name FROM region',
		function (err, rows, fields) {
			if (err) {
				next();
			};

			cb(rows);
		}
	);
};