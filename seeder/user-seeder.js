const userGenerator = require('./user-generator')
const db = require('../db')('user_api_db')
const util = require('util');
const query = util.promisify(db.connection.query).bind(db.connection);

const seed = async (count) => {
  const userDetailList = userGenerator(count)

  for await (const userDetail of userDetailList) {
    await query('INSERT INTO users SET ?', userDetail)
  }

  console.log(`Successfully seeded ${count} users.`)

  process.exit()
}

seed(parseInt(process.argv[2], 10))