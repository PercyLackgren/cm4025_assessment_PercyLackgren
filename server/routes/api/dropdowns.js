const express = require("express");
const router = express.Router();
const Dropdown = require("../../models/Dropdown");

// @route POST api/Dropdown
// @description add/save Dropdown
// @access Public
router.post('/', function (req, res) {
    Dropdown.create(req.body)
    .then(dropdown => res.json({ msg: 'dropdown added successfully', id: dropdown._id }))
    .catch(err => res.status(400).json({ error: 'Unable to add this dropdown' }));
})
  
// @route PUT api/Dropdown/:id
// @description Update Dropdown
// @access Public
router.put('/:id', (req, res) => {
    if (req.user !== undefined) {
        if (req.user.admin) {
            Dropdown.findByIdAndUpdate(req.params.id, req.body)
                .then(dropdown => res.json({ msg: 'Updated successfully', id: dropdown._id }))
                .catch(err => res.status(400).json({ error: 'Unable to update the Database' }));
            }
        }
});
  
// @route DELETE api/Dropdown/:id
// @description Delete Dropdown by id
// @access Public
router.delete('/:id', (req, res) => {
    if (req.user !== undefined) {
        if (req.user.admin) {
            Dropdown.findByIdAndRemove(req.params.id, req.body)
            .then(dropdown => res.json({ mgs: 'Dropdown entry deleted successfully' }))
            .catch(err => res.status(404).json({ error: 'No such dropdown' }));
        }
    }
});
  

// @route GET api/dropdown/field/:field 
// @description get dropdowns by field by ChatGPT
// @access Public
router.get('/field/:field', (req, res) => {
    console.log(req.params.field)
    Dropdown.find({ field: req.params.field })
    .then((dropdowns) => {
    if (dropdowns.length === 0) {
        res.status(404).json({ error: 'No matching dropdowns found' });
    } else {
        res.json(dropdowns);
    }
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    });
});

module.exports = router;