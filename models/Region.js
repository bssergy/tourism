var connection = require('./Db');

module.exports.getAll = function (cb) {
	connection.query('SELECT RegionId, Name FROM region',
		function (err, rows, fields) {
			if (err) {
				cb(err);
			};

			cb(null, rows);
		}
	);
};