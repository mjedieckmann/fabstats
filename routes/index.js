var express = require('express');
var router = express.Router();


router.get('/api/customers', (req, res) => {
  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Steve', lastName: 'Smith'},
    {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  ];

  res.json(customers);
});
/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/catalog');
});

module.exports = router;
