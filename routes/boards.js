const express = require('express');
const router = express.Router();
const moment = require('moment');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const connection = require('../mysqlConnection');
const upload = multer({ dest: './public/images/uploads/'});

cloudinary.config({
	cloud_name: 'dtmue1o4b',
	api_key: '792592538232137',
	api_secret: 'Kxe-4fPV0fR6S9ZqHIPccb5Lkug'
});

router.get('/:board_id', (req, res, next) => {
	const boardId = req.params.board_id;
	const boardQuery = `SELECT * FROM boards WHERE board_id = ${boardId}`;
//	const messageQuery = `SELECT *, DATE_FORMAT(created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM messages WHERE board_id = ${boardId}`;
	const messageQuery = `SELECT M.message, M.image_path, ifnull(U.user_name, '名無し') AS user_name, DATE_FORMAT(M.created_at, '%Y年%m月%d日 %k時%i分%s秒') AS created_at FROM messages M LEFT OUTER JOIN users U ON M.user_id = U.user_id WHERE M.board_id = '${boardId}' ORDER BY M.created_at ASC`;
	connection.query(boardQuery, (err, board) => {
		connection.query(messageQuery, (err, messages) => {
			res.render('board', {
				title: board[0].title,
				board: board[0],
				messageList: messages
			});
		});
	});
});

router.post('/:board_id', upload.single('image_file'), (req, res, next) => {
	const path = req.file ? req.file.path : 0;
	const message = req.body.message;
	const userId = req.session.user_id ? req.session.user_id : 0;
	const boardId = req.params.board_id;
	const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

	if(path){
		cloudinary.uploader.upload(path, (error, result) => {
			const imagePath = result.url;
			const query = 'INSERT INTO messages (message, board_id, user_id, created_at, image_path) VALUES (?)';
			const values = [[message, boardId, userId, createdAt, imagePath]];
			connection.query(query, values, (err, rows) => {
				res.redirect(`/boards/${boardId}`);
			});
		});
	} else {
			const query = 'INSERT INTO messages (message, board_id, user_id, created_at) VALUES (?)';
			const values = [[message, boardId, userId, createdAt]];
			connection.query(query, values, (err, rows) => {
				res.redirect(`/boards/${boardId}`);
			});
	}
});

module.exports = router;