const mysql = require('mysql');

//LOCAL用
//const dbConfig = {
//	host: '127.0.0.1',
//	user: 'root',
//	password: 'ayumi1028atmysql',
//	database: 'bulletin_board'
//};

//リリース用
const dbConfig = {
	host: 'us-cdbr-east-02.cleardb.com',
	user: 'bccf75a04cb346',
	password: 'ec69b6c5',
	database: 'heroku_f9905df8249fe44'
};

const connection = mysql.createConnection(dbConfig);

//これはHerokuのMySQLのためのハックです。
setInterval(() => {
	connection.query('SELECT 1');
}, 5000);

module.exports = connection;