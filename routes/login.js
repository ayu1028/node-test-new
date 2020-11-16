const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

router.get('/', (req, res, next) => {
	if(req.session.user_id) {
		res.redirect('/');
	} else {
		res.render('login', {
			title: 'ログイン'
		});
	}
});

router.post('/', (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const query = `SELECT user_id FROM users WHERE email = '${email}' AND password = '${password}' LIMIT 1`;
	connection.query(query, (err, rows) => {
		console.log(rows);
		const userId = rows.length ? rows[0].user_id : false;
		if(userId) {
			req.session.user_id = userId;
			res.redirect('/');
		} else {
			res.render('login', {
				title: 'ログイン',
				noUser: 'メールアドレスとパスワードが一致するユーザーはいません'
			});
		}
	});
});

module.exports = router;