var express = require('express');
const moment = require('moment');
const connection = require('../mysqlConnection');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
//	const query = 'SELECT *, DATE_FORMAT(created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM boards';
	const query = 'SELECT B.board_id, B.user_id, B.title, ifnull(U.user_name, \'名無し\') AS user_name, DATE_FORMAT(B.created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM boards B LEFT OUTER JOIN users U ON B.user_id = U.user_id ORDER BY B.created_at DESC';
	connection.query(query, (err, rows) => {
		res.render('index', { 
			title: 'はじめてのNode.js',
			boardList: rows
		});
	});
});

router.post('/', (req, res, next) => {
	const title = req.body.title;
	const userId = req.session.user_id ? req.session.user_id : 0;
	const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
	const query = 'INSERT INTO boards (user_id, title, created_at) VALUES (?)';
	const values = [[userId, title, createdAt]];
	connection.query(query, values, (error, results) => {
		res.redirect('/');
	});
});

module.exports = router;