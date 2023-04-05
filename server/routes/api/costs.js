// routes/api/cost.js
const express = require('express');
const router = express.Router();

// Load cost model
const cost = require('../../models/Cost');
const quote = require('../../models/Quote')

// @route GET api/cost
// @description Get all cost
// @access Public
// router.get('/', (req, res) => {
//   cost.find()
//     .then(cost => res.json(cost))
//     .catch(err => res.status(404).json({ noquotesfound: 'No cost found' }));
// });

// @route GET api/cost/:id
// @description Get single cost by id
// @access Public
// router.get('/:id', (req, res) => {
//   cost.findById(req.params.id)
//     .then(cost => res.json(cost))
//     .catch(err => res.status(404).json({ noquotefound: 'No cost found' }));
// });

// @route GET api/cost/quote/:id
// @description Get cost by quote id
// @access Public
router.get('/quote/:id', (req, res) => {
  cost.find({quote: req.params.id}).populate({path: 'quote', select: 'user_id fudge'})
    .then(cost => {
      // By default cannot see costs
      let hideData = true
      if (req.user === undefined) {
        // Not logged in, no data access
        console.log("Not logged in")
      } else if (req.user.admin) {
        // If the user is an admin allow access
        console.log("Admin")
        hideData = false
      } else if (req.user._id.toString() === cost[0].quote.user_id.toString()) {
        // If user is not admin, but is the owner of the quote/costs allow access
        console.log("Owner")
        hideData = false
      }

      // calculate total costs before nulling data
      var subCosts = calculateSubTaskCost(cost);

      // Remove costs if user not permitted
      cost.forEach( element => {
        if (hideData) {
          element.cost = null;
        }
      })
      
      // respond with costs
      res.json({
        data: cost,
        costs: subCosts
      })
    })
    .catch(err => res.status(404).json({ noquotefound: 'No cost found' }));
});

// @route POST api/cost
// @description add/save cost
// @access Public
router.post('/', (req, res) => {
  // only allowed registered users to create
  if (req.user !== undefined) {
    quote.findById(req.body.quote)
      .then(quote => {
        // Only allow to create cost if same user as quote or admin
        if (req.user._id.toString() === quote.user_id.toString() || req.user.admin) {
          cost.create(req.body)
          .then(cost => res.json({ msg: 'cost added successfully' }))
          .catch(err => res.status(400).json({ error: 'Unable to add this cost' }));
        }
      })
  }
});

// @route PUT api/cost/:id
// @description Update cost
// @access Public
router.put('/:id', (req, res) => {
  cost.findById(req.params.id).populate({path: 'quote', select: 'user_id'})
    .then( element => {
      // only worth checking if logged in
      if (req.user !== undefined) {
        // Only if current user and owner match or is admin allow
        if (req.user._id.toString() === element.quote.user_id.toString() || req.user.admin) {
          cost.findByIdAndUpdate(req.params.id, req.body)
            .then(cost => res.json({ msg: 'Updated successfully' }))
            .catch(err =>
              res.status(400).json({ error: 'Unable to update the Database' })
            );
        }
      }
    })
});

// @route DELETE api/cost/:id
// @description Delete cost by id
// @access Public
router.delete('/:id', (req, res) => {
  cost.findById(req.params.id).populate({path: 'quote', select: 'user_id'})
    .then( element => {
      // only worth checking if logged in
      if (req.user !== undefined) {
        // Only if current user and owner match or is admin allow
        if (req.user._id.toString() === element.quote.user_id.toString() || req.user.admin) {
          cost.findByIdAndRemove(req.params.id, req.body)
            .then(cost => res.json({ mgs: 'cost entry deleted successfully' }))
            .catch(err => res.status(404).json({ error: 'No such cost' }));
        }
      }
    })
});

// @route DELETE api/cost/
// @description Delete all cost TEMP FUNCTION
// @access Public
// router.delete('/', (req, res) => {
//   cost.deleteMany(req.params.id, req.body)
//     .then(cost => res.json({ mgs: 'cost deleted successfully' }))
//     .catch(err => res.status(404).json({ error: 'No such cost' }));
// });

function calculateSubTaskCost(cost, fudge) {
  
  // calculate costs for one month, 4 weeks per month with 5 working days of 8 hours
  var subTaskCosts = []

  cost.forEach( element => {
    if (subTaskCosts[element.sub_id] === undefined) {
      subTaskCosts[element.sub_id] = 0
    }

    if(element.type === 'Employee') {  
      switch(element.cost_type) {
        case "Hourly":
          subTaskCosts[element.sub_id] += (4*5*8*element.cost);
          break;
        case "Daily":
          subTaskCosts[element.sub_id] += (4*5*element.cost);
          break;
      }
    } else {
      switch(element.cost_type) {
        case "One Off":
          subTaskCosts[element.sub_id] += element.cost;
          break;
        case "Weekly":
          subTaskCosts[element.sub_id] += 4*element.cost;
          break;
        case "Monthly":
          subTaskCosts[element.sub_id] += element.cost;
          break;
      }
    }
  })

  // if fudge is below zero, double it.
  var fudge = cost[0].quote.fudge
  if (fudge < 1) {
    fudge = fudge*2
  }

  // apply fudge to subtask costs.
  subTaskCosts = subTaskCosts.map(function(element) {
    return element * fudge;
  });

  return subTaskCosts
}

module.exports = router;