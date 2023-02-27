const setup = (db) => {
  const express = require('express');
  const bodyParser = require('body-parser');
  const userService = require('./user-service')(db);

  const app = express();

  app.use(bodyParser.json());

  app.post('/create', async (req, res) => {
    try {
      const userDetails = await userService.create(req.body)
      res.status(201).json({
        message: 'User creation successful.',
        user: userDetails
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: 'Creating the user failed - please try again later.' });
    }
  });

  return app;
}

module.exports = setup