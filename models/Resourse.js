var connection = require('./Db');

module.exports.getAllPaged = function (page, size, cb, next) {
	connection.query(
	   'SELECT 													\
	    	ResourseId,											\
	    	Name												\
	    FROM resourse 											\
	    ORDER BY CreatedOn DESC, ResourseId DESC 				\
	    LIMIT ' + page * size + ',' + size,
		function (err, rows, fields) {
			if (err) {
				next();
			};

			cb(rows);
		}
	);
};