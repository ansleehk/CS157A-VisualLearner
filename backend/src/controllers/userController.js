const express = require('express');
const router = express.Router();
const userService = require('../services/UserService');

router.post('/:userID/follow', async (req, res) => {
  const userID = req.params.userID;
  try {
    await userService.followUser(req.user.id, userID);
    res.status(201).json({ message: 'Followed successfully' });
  } catch (error) {
    if (error.message === 'User not found') {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

router.get('/followable', async (req, res) => {
  try {
    const learners = await userService.getFollowableLearners(req.user.id);
    res.status(200).json(learners);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:userID/readArticles', async (req, res) => {
  const userID = req.params.userID;
  try {
    const articles = await userService.getReadArticles(userID);
    res.status(200).json(articles);
  } catch (error) {
    if (error.message === 'User not found') {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

module.exports = router;