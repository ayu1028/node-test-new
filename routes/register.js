const express = require('express');
const moment = require('moment');

const connection = require('../mysqlConnection');

const router = express.Router();

router.get('/', (req, res, next) => {
	res.render('register', {
		title: '新規会員登録'
	});
});

router.post('/', (req, res, next) => {
	console.log(req.body);
	const userName = req.body.user_name;
	const email = req.body.email;
	const password = req. body.password;
	const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
	const emailExistsQuery = `SELECT * FROM users WHERE email = '${email}' LIMIT 1`;
	const registerQuery = 'INSERT INTO users (user_name, email, password, created_at) VALUES (?)';
	const values = [[userName, email, password, createdAt]];

	connection.query(emailExistsQuery, (err, rows) => {
		const emailExists = rows.length;
		if(emailExists){
			res.render('register', {
				title: '新規会員登録',
				emailExists:'既に登録されているメールアドレスです'
			});
		} else {
			connection.query(registerQuery, values, (err, rows) => {
				res.redirect('/login');
			});
		}
	});
});

module.exports = router;