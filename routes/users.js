const express = require('express');
const user_controller = require("../controllers/userController");
const router = express.Router();

/// USERS ROUTES ///
router.get('/', user_controller.user_list);
router.get('/:id', user_controller.user_detail);

/// TEAM ROUTES ///
router.get('/teams', function(req, res, next) {
  res.send('respond with all teams');
});
router.get('/teams/:id', function(req, res, next) {
  res.send('respond with a specific team');
});

module.exports = router;
