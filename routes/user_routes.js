const express = require("express");
const user_controller = require("../controllers/userController");
const passport = require("passport");
const team_controller = require("../controllers/teamController");
const router = express.Router();
const isAuth = require("../utils/password_utils").isAuth;
const isLoggedIn = require("../utils/password_utils").isLoggedIn

/// USERS ROUTES ///
router.get('/', user_controller.user_list);

router.get('/current', team_controller.current_team, user_controller.user_current);
/// TEAM ROUTES ///
router.get('/teams', team_controller.team_list);

router.get('/teams/:id', function(req, res, next) {
  res.send('respond with a specific team');
});

router.post('/register', user_controller.user_register, passport.authenticate('local', { failureRedirect: '/users/login-failure', successRedirect: '/users/current' }));

router.post('/delete', isAuth, user_controller.user_delete);

router.post('/login', isLoggedIn, passport.authenticate('local', { failureRedirect: '/users/login-failure', successRedirect: '/users/current' }));

router.post('/forgot', user_controller.user_forgot);

router.post('/reset', user_controller.user_reset);

router.post('/edit', isAuth, team_controller.event_create_team, user_controller.user_edit);

router.get('/protected-route', isAuth, (req, res, next) => {
  res.json({message: 'You made it to the route.'});
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
  req.logout();
  res.json({message: 'logout successful'});
});

router.get('/login-failure', (req, res, next) => {
  res.status(401).json({ message: 'Incorrect username or password.' });
});

router.post('/upload',user_controller.user_file_upload);

module.exports = router;
