/**
 * This module defines the routes for the Personal Learning Path feature.
 * @module learnerController
 */

const express = require('express');
const router = express.Router();
const learnerService = require('../repos/learnerRepo');

/**
 * Saves the fields of study that the learner knows to the database.
 *
 * @function
 * @async
 * @param {string} learnerID - The ID of the learner.
 * @param {string[]} fields - An array of fields of study that the learner knows.
 * @returns {Promise<void>} A promise that resolves when the fields of study are saved.
 * @throws {Error} If there's an error saving the fields of study.
 */
router.post('/learner/:learnerID/fields', async (req, res) => {
  try {
    const learnerID = req.params.learnerID;
    const fields = req.body.fields;
    await learnerService.saveLearnerFieldsOfStudy(learnerID, fields);
    res.status(201).json({
      message: "Fields of study saved successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "Learner not found"
    });
  }
});

/**
 * Retrieves the articles in the to-read list of the learner.
 *
 * @function
 * @async
 * @param {string} learnerID - The ID of the learner.
 * @returns {Promise<Object[]>} A promise that resolves with an array of articles in the to-read list.
 * @throws {Error} If there's an error retrieving the articles.
 */
router.get('/learner/:learnerID/toRead', async (req, res) => {
  try {
    const learnerID = req.params.learnerID;
    const toReadArticles = await learnerService.getLearnerToReadArticles(learnerID);
    res.status(200).json(toReadArticles);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "Learner not found"
    });
  }
});

/**
 * Retrieves the articles that the learner has read.
 *
 * @function
 * @async
 * @param {string} learnerID - The ID of the learner.
 * @returns {Promise<Object[]>} A promise that resolves with an array of articles that the learner has read.
 * @throws {Error} If there's an error retrieving the articles.
 */
router.get('/learner/:learnerID/readArticles', async (req, res) => {
  try {
    const learnerID = req.params.learnerID;
    const readArticles = await learnerService.getLearnerReadArticles(learnerID);
    res.status(200).json(readArticles);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "Learner not found"
    });
  }
});

module.exports = router;