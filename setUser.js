const connection = require('./mysqlConnection');

module.exports = (req, res, next) => {
	const userId = req.session.user_id;
	if(userId){
		const query = `SELECT user_id, user_name FROM users WHERE user_id = ${userId}`;
		connection.query(query, (err, rows) => {
			if(!err){
				res.locals.user = rows.length ? rows[0] : false;
			}
		});
	}
	next();
};