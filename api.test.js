const db = require('./db')('jest_db');
const util = require('util');
const request = require('supertest');
const app = require('./app')(db.connection);

let server
let query
beforeAll(() => {
  db.dropTable()
  db.createTable()
  query = util.promisify(db.connection.query).bind(db.connection)
  server = app.listen(8080);
})

afterAll(async () => {
  db.connection.end()
  await server.close()
})

describe('API', () => {
  // describe('GET /', () => {
  //   test('should return a user object', async () => {
  //     const response = await request(app).get('/');
  //     expect(response.statusCode).toBe(200);
  //     expect(response.body).toEqual({ message: 'Hello, world!' });
  //   });
  // });

  describe('POST /', () => {
    test('should returns a newly created user object', async () => {
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

    // test('returns a 400 error if the name is missing', async () => {
    //   const data = { age: 30 };
    //   const response = await request(app).post('/').send(data);
    //   expect(response.statusCode).toBe(400);
    //   expect(response.body).toEqual({ error: 'Name is required' });
    // });

    // test('returns a 400 error if the age is missing', async () => {
    //   const data = { name: 'Alice' };
    //   const response = await request(app).post('/').send(data);
    //   expect(response.statusCode).toBe(400);
    //   expect(response.body).toEqual({ error: 'Age is required' });
    // });
  });
});