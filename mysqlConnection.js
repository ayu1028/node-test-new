require('dotenv').config();
const mysql = require('mysql');

//LOCAL用
//const dbConfig = {
//	host: process.env.MYSQL_HOST,
//	user: process.env.MYSQL_USER,
//	password: process.env.MYSQL_PASS,
//	database: process.env.MYSQL_DB
//};

console.log(dbConfig);

//リリース用
const dbConfig = {
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASS,
	database: process.env.DB
};

const connection = mysql.createConnection(dbConfig);

//これはHerokuのMySQLのためのハックです。
setInterval(() => {
	connection.query('SELECT 1');
}, 5000);

module.exports = connection;