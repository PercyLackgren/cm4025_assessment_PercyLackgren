// routes/api/costs.js
const express = require('express');
const router = express.Router();

// Load cost model
const costs = require('../../models/Costs');

// @route GET api/costs
// @description Get all costs
// @access Public
router.get('/', (req, res) => {
  costs.find()
    .then(costs => res.json(costs))
    .catch(err => res.status(404).json({ noquotesfound: 'No costs found' }));
});

// @route GET api/costs/:id
// @description Get single cost by id
// @access Public
router.get('/:id', (req, res) => {
  costs.findById(req.params.id)
    .then(costs => res.json(costs))
    .catch(err => res.status(404).json({ noquotefound: 'No cost found' }));
});

// @route POST api/costs
// @description add/save cost
// @access Public
router.post('/', (req, res) => {
  costs.create(req.body)
    .then(costs => res.json({ msg: 'cost added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this cost' }));
});

// @route PUT api/costs/:id
// @description Update cost
// @access Public
router.put('/:id', (req, res) => {
  costs.findByIdAndUpdate(req.params.id, req.body)
    .then(costs => res.json({ msg: 'Updated successfully' }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

// @route DELETE api/costs/:id
// @description Delete cost by id
// @access Public
router.delete('/:id', (req, res) => {
  costs.findByIdAndRemove(req.params.id, req.body)
    .then(costs => res.json({ mgs: 'cost entry deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such cost' }));
});

// @route DELETE api/costs/
// @description Delete all costs TEMP FUNCTION
// @access Public
router.delete('/', (req, res) => {
  costs.deleteMany(req.params.id, req.body)
    .then(costs => res.json({ mgs: 'costs deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such costs' }));
});

module.exports = router;