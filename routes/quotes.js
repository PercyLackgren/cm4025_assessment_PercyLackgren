var express = require('express');
var router = express.Router();

/* GET quotes listing. */
router.get('/', function(req, res, next) {
    res.render('quote', { title: 'Generate quote' });
});

module.exports = router;