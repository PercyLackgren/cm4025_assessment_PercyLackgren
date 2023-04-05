// routes/api/quote.js
const express = require('express');
const router = express.Router();

// Load quote model
const quote = require('../../models/Quote');

// @route GET api/quote
// @description Get all quote
// @access Public
router.get('/', (req, res) => {
  quote.find().select("-fudge")
    .then(quote => res.json(quote))
    .catch(err => res.status(404).json({ noquotesfound: 'No quote found' }));
});

// @route GET api/quote/:id
// @description Get single quote by id
// @access Public
router.get('/:id', (req, res) => {
  quote.findById(req.params.id).populate({path: 'user_id', select: 'username'})
    .then(quote => res.json(quote))
    .catch(err => res.status(404).json({ noquotefound: 'No quote found' }));
});

// @route POST api/quote
// @description add/save quote
// @access Public
router.post('/', (req, res) => {
  if (req.user !== undefined) {
    quote.create(req.body)
      .then(quote => res.json({ msg: 'quote added successfully', id: quote._id }))
      .catch(err => res.status(400).json({ error: 'Unable to add this quote' }));
  }
});

// @route PUT api/quote/:id
// @description Update quote
// @access Public
router.put('/:id', (req, res) => {
  if (req.user !== undefined) {
    quote.findById(req.params.id)
      .then( element => {
        if (req.user._id.toString() === element.user_id.toString() || req.user.admin) {
          quote.findByIdAndUpdate(req.params.id, req.body)
            .then(quote => res.json({ msg: 'Updated successfully', id: quote._id }))
            .catch(err => res.status(400).json({ error: 'Unable to update the Database' }));
        }
      })
  }
});

// @route DELETE api/quote/:id
// @description Delete quote by id
// @access Public
router.delete('/:id', (req, res) => {
  if (req.user !== undefined) {
    quote.findById(req.params.id)
      .then( element => {
        if (req.user._id.toString() === element.user_id.toString() || req.user.admin) {
          quote.findByIdAndRemove(req.params.id, req.body)
            .then(quote => res.json({ mgs: 'quote entry deleted successfully' }))
            .catch(err => res.status(404).json({ error: 'No such quote' }));
        }
      })
  }
});

// @route DELETE api/quote/
// @description Delete all quote TEMP FUNCTION
// @access Public
// router.delete('/', (req, res) => {
//   console.log(req)
//   quote.deleteMany(req.params.id, req.body)
//     .then(quote => res.json({ mgs: 'quote deleted successfully' }))
//     .catch(err => res.status(404).json({ error: 'No such quote' }));
// });

module.exports = router;