const db = require('./db')('jest_db');
const util = require('util');
const request = require('supertest');
const app = require('./app')(db.connection);
const userGenerator = require('./seeder/user-generator');

let server
let query
beforeAll(() => {
  query = util.promisify(db.connection.query).bind(db.connection)
  server = app.listen(8080);
})

afterAll(async () => {
  db.dropTable()
  db.connection.end()
  await server.close()
})

beforeEach(() => {
  db.dropTable()
  db.createTable()
})

describe('API', () => {
  describe('GET /getAll', () => {
    test('should return all users', async () => {
      const dummyUsers = userGenerator(3)
      await query('INSERT INTO users SET ?', dummyUsers[0])
      await query('INSERT INTO users SET ?', dummyUsers[1])
      await query('INSERT INTO users SET ?', dummyUsers[2])
      const response = await request(app).get('/getAll');
      const users = await query('SELECT * FROM users');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ users, count: 3 });
    });
  });

  describe('POST /create', () => {
    test('should return a newly created user object', async () => {
      const [ userDetails ] = userGenerator(1)
      const response = await request(app).post('/create').send(userDetails);
      const [ userData ] = await query('SELECT * FROM users WHERE email = ?', [userDetails.email])
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        message: 'User creation successful.',
        user: userData
      });
    });
  });

  describe('DELETE /delete', () => {
    test('/delete/id should delete a user', async () => {
      const dummyUsers = userGenerator(3)
      await query('INSERT INTO users SET ?', dummyUsers[0])
      await query('INSERT INTO users SET ?', dummyUsers[1])
      await query('INSERT INTO users SET ?', dummyUsers[2])
      const response = await request(app).delete(`/delete/1`);
      const users = await query('SELECT * FROM users');
      expect(response.statusCode).toBe(200);
      expect(users.length).toEqual(2);
      expect(response.body).toEqual({ message: 'User deletion successful' });
    });

    test('/delete should delete multiple users', async () => {
      const dummyUsers = userGenerator(3)
      await query('INSERT INTO users SET ?', dummyUsers[0])
      await query('INSERT INTO users SET ?', dummyUsers[1])
      await query('INSERT INTO users SET ?', dummyUsers[2])
      const response = await request(app).delete(`/delete`).send({ ids: [1, 2, 3] });
      const users = await query('SELECT * FROM users');
      expect(response.statusCode).toBe(200);
      expect(users.length).toEqual(0);
      expect(response.body).toEqual({ message: 'Multiple user deletion successful' });
    });
  });

  describe('PATCH /edit/id', () => {
    test('should update a user', async () => {
      const [ data ] = userGenerator(1)

      const [ updatedData ] = userGenerator(1)

      await query('INSERT INTO users SET ?', data)

      const response = await request(app).patch(`/edit/1`).send(updatedData);
      const [ user ] = await query('SELECT * FROM users WHERE id = ?', [1]);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'User detail updated', user });
    });
  });
});