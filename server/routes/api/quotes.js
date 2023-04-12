// routes/api/quote.js
const express = require('express');
const router = express.Router();

// Load quote model
const quote = require('../../models/Quote');
const Quote = require('../../models/Quote');

// @route GET api/quote
// @description Get all quotes
// @access Public
router.get('/', (req, res) => {
  quote.find()
    .select("-fudge")
    .populate({path: 'user_id', select: 'username'})
    .then(quote => res.json(quote))
    .catch(err => res.status(404).json({ noquotesfound: 'No quote found' }));
});

// @route GET api/quote/:id
// @description Get single quote by id
// @access Public
router.get('/:id', (req, res) => {
  quote.findById(req.params.id)
    .populate({path: 'user_id', select: 'username'})
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

// @route GET api/quotes/user_id/:user_id 
// @description get quote by user id field
// @access Public
router.get('/user_id/:user_id', (req, res) => {
  // console.log(req.params.user_id)
  Quote.find({ user_id: req.params.user_id })
    .then((quote) => {
      if (quote.length === 0) {
          res.status(404).json({ error: 'No matching quotes found' });
      } else {
          res.json(quote);
    }
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    });
});

// Route to combine quotes and update the associated costs
router.post('/combine', async (req, res) => {
  try {
    const quote_ids = req.body;
    const combinedQuote = new Quote({ user_id: req.user._id });

    // setup variables
    let description = '';
    let buffer = 0
    let max_sub_id = 0
    let last_quote_id = ''

    for (const quote_id of quote_ids) {
      const quote = await Quote.findById(quote_id);
      if (!quote) {
        return res.status(404).json({ msg: `Quote ${quote_id} not found` });
      }

      // Concatenate the descriptions of all the quotes
      description += '\n' + quote.description;
      // cost += quote.cost;

      // Update the quote_id field in the associated Cost documents
      const costs = await Cost.find({ quote: quote_id }).sort({ 'quote': 1, 'sub_id': 1 });

      // intialise last quote id
      if(last_quote_id === '') {
        last_quote_id = costs[0].quote
      }

      // Loop to update subt_id in order to preserve them
      for (const cost of costs) {

        // run only encountering new quotes
        if (!cost.quote.equals(last_quote_id)) {
          // sanity check
          console.log(cost.quote + " !== " + last_quote_id)
          // note cost quote id
          last_quote_id = cost.quote
          // update buffer to max sub_id found + 1
          buffer = max_sub_id+1
        }

        // set cost sub_id as itself plus the buffer
        cost.sub_id = cost.sub_id+buffer
        // set the max_sub_id to the current sub_id
        max_sub_id = cost.sub_id

        // update the cost
        cost.quote = combinedQuote._id;
        await cost.save();
      }

      // Delete old quote
      Quote.findByIdAndRemove(quote_id)
        .then(quote => (console.log("quote entry deleted successfully")))
        .catch(err => (console.log("No such quote")));
    }

    // get rid of leading line break and spaces https://stackoverflow.com/a/14572494
    description = description.replace(/^\n|\n$/g, '');
    combinedQuote.description = description;
    combinedQuote.timespan = 1
    combinedQuote.timespan_type = 'months'

    // console.log(description)
    // console.log(combinedQuote)
    await combinedQuote.save();

    res.json({ success: true, combinedQuote });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;