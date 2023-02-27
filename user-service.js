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
    },
    edit: async (id, updateDetails) => {
      let updateQuery = 'UPDATE users SET ';
      const values = [];

      Object.keys(updateDetails).forEach(key => {
        if (updateDetails[key]) {
          updateQuery += `${key} = ?, `;
          values.push(updateDetails[key]);
        }
      });

      updateQuery = updateQuery.slice(0, -2);
      updateQuery += ` WHERE id = ${id}`;

      await query(updateQuery, values)
      const [ user ] = await query('SELECT * FROM users WHERE id = ?', [id])

      return user
    }
  }

  return methods;
}

module.exports = service