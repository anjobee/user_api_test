const db = require('../db')('user_api_db')

const up = db.createTable;

const down = db.dropTable;

if (process.argv[2] === 'down') {
  down((error, results, fields) => {
    if (error) {
      console.log('Error on table creation:' + error)
      process.exit(1);
    }
    console.log('Users table dropped successfully.')
    process.exit()
  })
} else {
  up((error, results, fields) => {
    if (error) {
      console.log('Error on table creation:' + error)
      process.exit(1);
    }
    console.log('Users table created successfully.')
    process.exit()
  })
}