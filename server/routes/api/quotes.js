// routes/api/quotes.js

const express = require('express');
const router = express.Router();

// Load Quote model
const Quote = require('../../models/Quote');

// @route GET api/quotes/test
// @description tests quotes route
// @access Public
router.get('/test', (req, res) => res.send('quote route testing!'));

// @route GET api/quotes
// @description Get all quotes
// @access Public
router.get('/', (req, res) => {
  Quote.find()
    .then(quotes => res.json(quotes))
    .catch(err => res.status(404).json({ noquotesfound: 'No quotes found' }));
});

// @route GET api/quotes/:id
// @description Get single quote by id
// @access Public
router.get('/:id', (req, res) => {
  Quote.findById(req.params.id)
    .then(quote => res.json(quote))
    .catch(err => res.status(404).json({ noquotefound: 'No quote found' }));
});

// @route GET api/quotes
// @description add/save quote
// @access Public
router.post('/', (req, res) => {
  Quote.create(req.body)
    .then(quote => res.json({ msg: 'Quote added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this quote' }));
});

// @route GET api/quotes/:id
// @description Update quote
// @access Public
router.put('/:id', (req, res) => {
  Quote.findByIdAndUpdate(req.params.id, req.body)
    .then(quote => res.json({ msg: 'Updated successfully' }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

// @route GET api/quotes/:id
// @description Delete quote by id
// @access Public
router.delete('/:id', (req, res) => {
  Quote.findByIdAndRemove(req.params.id, req.body)
    .then(quote => res.json({ mgs: 'Quote entry deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such quote' }));
});

module.exports = router;