const mysql = require('mysql');
const util = require('util');
const dotenv = require('dotenv');

dotenv.config({
  path: './config.env'
});

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'realestatec'
// });

// module.exports = db;
let DB = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  connectionLimit: 10
});

DB.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }

    console.log(err);
  }

  if (connection) {
    connection.release();
    console.log('Mysql is connected');
  }
});

DB.query = util.promisify(DB.query);

module.exports = DB;
