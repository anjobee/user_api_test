const db = require('./db')('jest_db');
const util = require('util');
const request = require('supertest');
const app = require('./app')(db.connection);

let server
let query
beforeAll(() => {
  query = util.promisify(db.connection.query).bind(db.connection)
  server = app.listen(8080);
})

afterAll(async () => {
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
      const data = {
        "email": "test@mail.com",
        "username": "username",
        "password": "password123",
        "firstName": "Test",
        "lastName": "User",
        "address": "Sample Address",
        "postcode": "1234",
        "contactNo": "091351363"
      }
      await query('INSERT INTO users SET ?', data)
      await query('INSERT INTO users SET ?', data)
      await query('INSERT INTO users SET ?', data)
      const response = await request(app).get('/getAll');
      const users = await query('SELECT * FROM users');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ users, count: 3 });
    });
  });

  describe('POST /create', () => {
    test('should return a newly created user object', async () => {
      const data = {
        "email": "test@mail.com",
        "username": "username",
        "password": "password123",
        "firstName": "Test",
        "lastName": "User",
        "address": "Sample Address",
        "postcode": "1234",
        "contactNo": "091351363"
    }

      const response = await request(app).post('/create').send(data);
      const [ userData ] = await query('SELECT * FROM users WHERE email = ?', ['test@mail.com'])
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        message: 'User creation successful.',
        user: userData
      });
    });
  });

  describe('DELETE /delete', () => {
    test('/delete/id should delete a user', async () => {
      const data = {
        "email": "test@mail.com",
        "username": "username",
        "password": "password123",
        "firstName": "Test",
        "lastName": "User",
        "address": "Sample Address",
        "postcode": "1234",
        "contactNo": "091351363"
      }

      await query('INSERT INTO users SET ?', data)
      await query('INSERT INTO users SET ?', data)
      await query('INSERT INTO users SET ?', data)
      const response = await request(app).delete(`/delete/1`);
      const users = await query('SELECT * FROM users');
      expect(response.statusCode).toBe(200);
      expect(users.length).toEqual(2);
      expect(response.body).toEqual({ message: 'User deletion successful' });
    });
  });
});