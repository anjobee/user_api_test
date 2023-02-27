const { connection } = require('./db')('user_api_db')

process.on('SIGINT', () => {
  console.log('Closing MySQL connection...');

  db.end();
});

const app = require('./app')(connection);

app.listen(8080, () => console.log(`App listening to port 8080`));