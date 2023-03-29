// routes/api/quotes.js
const express = require('express');
const router = express.Router();

// Load quote model
const quotes = require('../../models/quotes');

// @route GET api/quotes
// @description Get all quotes
// @access Public
router.get('/', (req, res) => {
  quotes.find()
    .then(quotes => res.json(quotes))
    .catch(err => res.status(404).json({ noquotesfound: 'No quotes found' }));
});

// @route GET api/quotes/:id
// @description Get single quote by id
// @access Public
router.get('/:id', (req, res) => {
  quotes.findById(req.params.id)
    .then(quotes => res.json(quotes))
    .catch(err => res.status(404).json({ noquotefound: 'No quote found' }));
});

// @route POST api/quotes
// @description add/save quote
// @access Public
router.post('/', (req, res) => {
  quotes.create(req.body)
    .then(quotes => res.json({ msg: 'quote added successfully', id: quotes._id }))
    .catch(err => res.status(400).json({ error: 'Unable to add this quote' }));
});

// @route PUT api/quotes/:id
// @description Update quote
// @access Public
router.put('/:id', (req, res) => {
  quotes.findByIdAndUpdate(req.params.id, req.body)
    .then(quotes => res.json({ msg: 'Updated successfully' }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

// @route DELETE api/quotes/:id
// @description Delete quote by id
// @access Public
router.delete('/:id', (req, res) => {
  quotes.findByIdAndRemove(req.params.id, req.body)
    .then(quotes => res.json({ mgs: 'quote entry deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such quote' }));
});

// @route DELETE api/quotes/
// @description Delete all quotes TEMP FUNCTION
// @access Public
router.delete('/', (req, res) => {
  quotes.deleteMany(req.params.id, req.body)
    .then(quotes => res.json({ mgs: 'quotes deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such quotes' }));
});

module.exports = router;