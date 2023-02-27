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

  app.get('/getAll', async (req, res) => {
    try {
      const response = await userService.getAll(req.body)
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: 'Listing of all users failed - please try again later.' });
    }
  });

  app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params
    try {
      await userService.delete(id)
      res.status(200).json({ message: 'User deletion successful' });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: 'Deletion of user failed - please try again later.' });
    }
  });

  app.delete('/delete', async (req, res) => {
    const { ids } = req.body
    try {
      await userService.deleteMany(ids)
      res.status(200).json({ message: 'Multiple user deletion successful' });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: 'Deletion of users failed - please try again later.' });
    }
  });

  app.patch('/edit/:id', async (req, res) => {
    const { id } = req.params
    try {
      const user = await userService.edit(id, req.body)
      res.status(200).json({ message: 'User detail updated', user });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: 'Editing of user failed - please try again later.' });
    }
  });

  return app;
}

module.exports = setup