const util = require('util');

const service = (db) => {
  const query = util.promisify(db.query).bind(db)

  const methods = {
    create: async (userDetails) => {
      const { insertId } = await query('INSERT INTO users SET ?', userDetails)

      const [ user ] = await query('SELECT * FROM users WHERE id = ?', [insertId])

      return user
    },
    getAll: async () => {
      const userList = await query('SELECT * FROM users')

      return {
        users: userList,
        count: userList.length
      }
    },
    delete: async (id) => {
      await query('DELETE FROM users WHERE id = ?', [id])
    },
    deleteMany: async (ids) => {
      await query('DELETE FROM users WHERE id IN (?)', [ids])
    }
  }

  return methods;
}

module.exports = service