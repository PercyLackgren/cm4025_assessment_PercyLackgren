// routes/api/cost.js
const express = require('express');
const router = express.Router();

// Load cost model
const cost = require('../../models/Cost');
const quote = require('../../models/Quote')

// @route GET api/cost/quote/:id
// @description Get cost by quote id
// @access Public
router.get('/quote/:id', (req, res) => {
  cost.find({quote: req.params.id}).populate({path: 'quote'})
    .then(cost => {

      // By default cannot see costs
      let hideData = true
      let isAdmin = false
      if (req.user === undefined) {
        // Not logged in, no data access
        console.log("Not logged in")
      } else if (req.user.admin) {
        // If the user is an admin allow access
        console.log("Admin")
        hideData = false
        isAdmin = true
      } else if (req.user._id.toString() === cost[0].quote.user_id.toString()) {
        // If user is not admin, but is the owner of the quote/costs allow access
        console.log("Owner")
        hideData = false
      }

      // calculate total costs before nulling data
      var subTaskCost = calculateSubTaskCost(cost, false);
      var subCosts = subTaskCost[0]
      // var otcs = subTaskCost[1] This doesnt work for some reason?
      if (isAdmin) {
        subTaskCost = calculateSubTaskCost(cost, isAdmin);
        var fudgelessCosts = subTaskCost[0]
        var fudgelessOtcs = subTaskCost[1]
      }

      // Remove costs if user not permitted
      cost.forEach( element => {
        if (hideData) {
          element.cost = null;
        }
        if (!isAdmin) {
          // if not admin remove fudge
          element.quote.fudge = null;
        }
      })

      const sum = subCosts.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);      

      const otcSum = subTaskCost[1].reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);      

      const query = { _id: req.params.id };
      const update = { cost: sum, otc: otcSum };
      const options = { new: true };
      
      // Update the original quote with the fudged cost.
      quote.findOneAndUpdate(query, update, options).then(() => {
          console.log('Quote updated successfully');
        }).catch((err) => {
          console.log(err);
      });

      // respond with costs
      res.json({
        data: cost,
        costs: subCosts,
        otcs: subTaskCost[1],
        fudgeless: fudgelessCosts,
        fudgelessOtcs: fudgelessOtcs
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

// TODO otc is not calculated correctly ree

// Function to generate subtask costs, fudge and fudgeless
function calculateSubTaskCost(cost, admin) {
  
  // calculate costs for one month, 4 weeks per month with 5 working days of 8 hours
  var subTaskCosts = []
  var otcs =  []

  // Pre-define some randomness based off of the fudge factor
  var fudge = cost[0].quote.fudge

  var weeks = 4
  var days = 5
  var hours = 8
  var months = 1

  if(!admin) {
    var randomNumber = 0.5 + (0.5 * Math.sin(cost[0].cost * 0.001571) * (fudge - 1) + 1); //ChatGPT generated

    // modify values based off of fudge
    switch(fudge) {
      case fudge < 1:
        weeks = weeks*randomNumber
        break;
      case fudge > 1.1:
        days = days*randomNumber
        break;
      default:
        hours = hours*randomNumber
        months = months*randomNumber
    }
  }

  cost.forEach( element => {
    if (subTaskCosts[element.sub_id] === undefined) {
      subTaskCosts[element.sub_id] = 0
      otcs[element.sub_id] = 0
    }

    if(element.type === 'Employee') {  
      switch(element.cost_type) {
        case "Hourly":
          subTaskCosts[element.sub_id] += (weeks*days*hours*element.cost);
          break;
        case "Daily":
          subTaskCosts[element.sub_id] += (weeks*days*element.cost);
          break;
      }
    } else {
      switch(element.cost_type) {
        case "otc":
          // dont add, will be calculated on the frontend
          otcs[element.sub_id] += element.cost;
          break;
        case "Weekly":
          subTaskCosts[element.sub_id] += weeks*element.cost;
          break;
        case "Monthly":
          subTaskCosts[element.sub_id] += months*element.cost;
          break;
      }
    }
  })

  if(!admin) {
    // apply fudge to subtask costs.
    subTaskCosts = subTaskCosts.map(function(element) {
      return element * fudge;
    });
    otcs = otcs.map(function(element) {
      return element * fudge;
    });
  }

  return [subTaskCosts, otcs];
}

module.exports = router;