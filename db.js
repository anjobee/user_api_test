const dbSetup = (dbName) => {
  const mysql = require('mysql');
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: dbName
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected to ${dbName}`)
  });

  const createTable = () => {
    connection.query(`CREATE TABLE IF NOT EXISTS users(
      id INT(11) NOT NULL AUTO_INCREMENT,
      email VARCHAR(50) NOT NULL,
      username VARCHAR(50) NOT NULL,
      password VARCHAR(50) NOT NULL,
      firstName VARCHAR(50) NOT NULL,
      lastName VARCHAR(50) NOT NULL,
      address VARCHAR(50) NOT NULL,
      postcode VARCHAR(10) NOT NULL,
      contactNo VARCHAR(50) NOT NULL,
      PRIMARY KEY (id)
      )`
    );
  }

  const dropTable = () => {
    connection.query('DROP TABLE IF EXISTS users');
  }

  createTable();

  return {
    connection,
    createTable,
    dropTable
  };
}

module.exports = dbSetup;