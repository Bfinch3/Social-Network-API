const express = require('express');
const router = express.Router();
const {
  getThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction,
} = require('../../controllers/thoughtController');

//routes for thoughts
router.route('/')
  .get(getThoughts)
  .post(createThought);

router.route('/:thoughtId')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);
//routes for reactions
router.route('/:thoughtId/reactions')
  .post(createReaction);

router.route('/:thoughtId/reactions/:reactionId')
  .delete(deleteReaction);

module.exports = router;
